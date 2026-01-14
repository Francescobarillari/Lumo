import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { EventCardComponent } from '../event-card/event-card.component';
import { Event } from '../../models/event';
import { EventService } from '../../services/event.service';
import { MapboxService } from '../../services/mapbox.service';
import { UserService } from '../../services/user-service/user-service';
import { User } from '../../models/user';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, FormsModule, MatIconModule, EventCardComponent], // Added FormsModule
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnChanges, OnInit, OnDestroy {
    @Input() events: Event[] = [];
    @Output() focusEvent = new EventEmitter<Event>();
    @Input() collapsed = false;
    @Input() userId: string | null = null;
    @Output() toggleSidebar = new EventEmitter<void>();
    @Output() toggleFavorite = new EventEmitter<Event>();
    @Output() foundLocation = new EventEmitter<{ lat: number, lng: number }>(); // New output
    @Output() openUserProfile = new EventEmitter<string>(); // New output for profile
    @Output() shareEvent = new EventEmitter<Event>();

    searchQuery: string = '';
    searchResults: Event[] = [];
    cityResults: { name: string, center: [number, number] }[] = [];
    userResults: User[] = [];
    activeTab: 'events' | 'places' | 'creators' = 'events';
    isSearching: boolean = false;
    followingMap: { [userId: number]: boolean } = {};
    showFilterOptions: boolean = false;


    constructor(
        private eventService: EventService,
        private mapboxService: MapboxService,
        private userService: UserService
    ) { }

    private searchInput$ = new Subject<string>();
    private searchSub?: Subscription;

    ngOnInit() {
        this.searchSub = this.searchInput$
            .pipe(debounceTime(300), distinctUntilChanged())
            .subscribe((value) => {
                const trimmed = value?.trim() || '';
                if (!trimmed) {
                    this.clearSearch();
                    return;
                }
                this.onSearchInternal(trimmed);
            });
    }

    ngOnDestroy() {
        this.searchSub?.unsubscribe();
    }

    followUpEvents: Event[] = [];
    savedEvents: Event[] = [];
    discoverEvents: Event[] = [];
    foundEvents: Event[] = [];

    // Filter/Sort state
    filterOption: 'all' | 'participating' | 'free' | 'available' = 'all';
    sortOption: 'date' | 'distance' | 'name' = 'date';
    priceMin = 0;
    priceMax = 100;
    priceMaxLimit = 100;
    priceStep = 1;
    distanceMin = 0;
    distanceMax = 20;
    distanceMaxLimit = 20;
    distanceStep = 0.5;
    filterMenuOpen = false;
    sortMenuOpen = false;
    readonly filterOrder: Array<typeof this.filterOption> = ['all', 'participating', 'free', 'available'];
    readonly sortOrder: Array<typeof this.sortOption> = ['date', 'distance', 'name'];
    readonly filterLabels: Record<typeof this.filterOption, string> = {
        all: 'All',
        participating: 'Participating',
        free: 'Free',
        available: 'Available spots'
    };
    readonly sortLabels: Record<typeof this.sortOption, string> = {
        date: 'Date',
        distance: 'Distance',
        name: 'Name'
    };

    get isFiltering(): boolean {
        return this.filterOption !== 'all';
    }

    private isFutureEvent = (event: Event): boolean => {
        if (!event.date) return true;
        const end = event.endTime || event.startTime || '23:59';
        const eventDateTime = new Date(`${event.date}T${end}`);
        return eventDateTime.getTime() >= Date.now();
    };

    ngOnChanges(changes: SimpleChanges) {
        if (changes['events'] || changes['userId']) {
            this.categorizeEvents();
        }
    }

    private categorizeEvents() {
        console.log('Sidebar received events:', this.events);

        // Reset all arrays
        this.followUpEvents = [];
        this.savedEvents = [];
        this.discoverEvents = [];
        this.foundEvents = [];
        this.updateRangeLimits();

        // Guest Mode
        if (!this.userId) {
            this.foundEvents = this.events.filter(this.isFutureEvent);
            return;
        }

        // Logged In Logic
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Normalize today

        // 1. Fetch Follow Up Events (Directly from backend to ensure we get everything, including own events)
        this.eventService.getJoinedEvents(this.userId).subscribe({
            next: (joined) => {
                this.followUpEvents = joined.filter(this.isFutureEvent);

                // Sort by Date
                this.followUpEvents.sort((a, b) => {
                    const dateA = new Date(`${a.date}T${a.startTime || '00:00'}`);
                    const dateB = new Date(`${b.date}T${b.startTime || '00:00'}`);
                    return dateA.getTime() - dateB.getTime();
                });
            },
            error: (err) => console.error('Error fetching follow up events', err)
        });

        // 2. Categorize Map Events for Saved and Discover
        this.events.filter(this.isFutureEvent).forEach(event => {
            let isSaved = false;
            const isParticipating = event.isParticipating || false;

            // Check Saved
            if (event.isSaved && !isParticipating) {
                isSaved = true;
            }

            if (isSaved) {
                this.savedEvents.push(event);
            }

            // Discover: Not Participating AND Not Saved
            if (!isParticipating && !isSaved) {
                this.discoverEvents.push(event);
            }
        });

        console.log('Categorized:', {
            followUp: this.followUpEvents,
            saved: this.savedEvents,
            discover: this.discoverEvents
        });
    }

    private updateRangeLimits() {
        const priceValues = this.events.map(event => event.costPerPerson ?? 0);
        const rawPriceMax = priceValues.length ? Math.max(...priceValues) : 0;
        const nextPriceMaxLimit = Math.max(10, Math.ceil(rawPriceMax));

        const distanceValues = this.events
            .map(event => event.distanceKm)
            .filter((value): value is number => typeof value === 'number' && !Number.isNaN(value));
        const rawDistanceMax = distanceValues.length ? Math.max(...distanceValues) : 0;
        const nextDistanceMaxLimit = Math.max(5, Math.ceil(rawDistanceMax));

        const priceMaxAtLimit = this.priceMax === this.priceMaxLimit || this.priceMax === 0;
        this.priceMaxLimit = nextPriceMaxLimit;
        if (priceMaxAtLimit || this.priceMax > this.priceMaxLimit) {
            this.priceMax = this.priceMaxLimit;
        }
        if (this.priceMin > this.priceMax) {
            this.priceMin = this.priceMax;
        }

        const distanceMaxAtLimit = this.distanceMax === this.distanceMaxLimit || this.distanceMax === 0;
        this.distanceMaxLimit = nextDistanceMaxLimit;
        if (distanceMaxAtLimit || this.distanceMax > this.distanceMaxLimit) {
            this.distanceMax = this.distanceMaxLimit;
        }
        if (this.distanceMin > this.distanceMax) {
            this.distanceMin = this.distanceMax;
        }
    }

    private applyFilters(events: Event[]): Event[] {
        let filtered = [...events];

        switch (this.filterOption) {
            case 'participating':
                filtered = filtered.filter(e => !!e.isParticipating);
                break;
            case 'free':
                filtered = filtered.filter(e => e.costPerPerson == null || e.costPerPerson === 0);
                break;
            case 'available':
                filtered = filtered.filter(e => {
                    if (e.nPartecipants == null || e.occupiedSpots == null) return true;
                    const freeSpots = e.nPartecipants - e.occupiedSpots;
                    return freeSpots > 0;
                });
                break;
            default:
                break;
        }

        switch (this.sortOption) {
            case 'distance':
                filtered.sort((a, b) => {
                    const da = a.distanceKm ?? Number.MAX_SAFE_INTEGER;
                    const db = b.distanceKm ?? Number.MAX_SAFE_INTEGER;
                    return da - db;
                });
                break;
            case 'name':
                filtered.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'it'));
                break;
            case 'date':
            default:
                filtered.sort((a, b) => {
                    const aTime = new Date(`${a.date}T${a.startTime || '00:00'}`).getTime();
                    const bTime = new Date(`${b.date}T${b.startTime || '00:00'}`).getTime();
                    return aTime - bTime;
                });
                break;
        }

        const isPriceFiltering = this.priceMin > 0 || this.priceMax < this.priceMaxLimit;
        if (isPriceFiltering) {
            filtered = filtered.filter((e) => {
                const price = e.costPerPerson ?? 0;
                return price >= this.priceMin && price <= this.priceMax;
            });
        }

        const isDistanceFiltering = this.distanceMin > 0 || this.distanceMax < this.distanceMaxLimit;
        if (isDistanceFiltering) {
            filtered = filtered.filter((e) => {
                const distance = e.distanceKm;
                if (distance == null) return false;
                return distance >= this.distanceMin && distance <= this.distanceMax;
            });
        }

        return filtered;
    }

    getFiltered(list: Event[]): Event[] {
        return this.applyFilters(list);
    }

    cycleFilter() {
        const idx = this.filterOrder.indexOf(this.filterOption);
        this.filterOption = this.filterOrder[(idx + 1) % this.filterOrder.length];
    }

    cycleSort() {
        const idx = this.sortOrder.indexOf(this.sortOption);
        this.sortOption = this.sortOrder[(idx + 1) % this.sortOrder.length];
    }

    selectFilter(option: typeof this.filterOption) {
        this.filterOption = option;
        this.filterMenuOpen = false;
        this.sortMenuOpen = false;
    }

    selectSort(option: typeof this.sortOption) {
        this.sortOption = option;
        this.sortMenuOpen = false;
        this.filterMenuOpen = false;
    }

    get priceMinPercent(): string {
        if (!this.priceMaxLimit) return '0%';
        return `${(this.priceMin / this.priceMaxLimit) * 100}%`;
    }

    get priceMaxPercent(): string {
        if (!this.priceMaxLimit) return '100%';
        return `${(this.priceMax / this.priceMaxLimit) * 100}%`;
    }

    get distanceMinPercent(): string {
        if (!this.distanceMaxLimit) return '0%';
        return `${(this.distanceMin / this.distanceMaxLimit) * 100}%`;
    }

    get distanceMaxPercent(): string {
        if (!this.distanceMaxLimit) return '100%';
        return `${(this.distanceMax / this.distanceMaxLimit) * 100}%`;
    }

    onPriceMinChange(value: string) {
        const next = Math.max(0, Math.min(Number(value), this.priceMax));
        this.priceMin = Number.isNaN(next) ? this.priceMin : next;
    }

    onPriceMaxChange(value: string) {
        const next = Math.min(this.priceMaxLimit, Math.max(Number(value), this.priceMin));
        this.priceMax = Number.isNaN(next) ? this.priceMax : next;
    }

    onDistanceMinChange(value: string) {
        const next = Math.max(0, Math.min(Number(value), this.distanceMax));
        this.distanceMin = Number.isNaN(next) ? this.distanceMin : next;
    }

    onDistanceMaxChange(value: string) {
        const next = Math.min(this.distanceMaxLimit, Math.max(Number(value), this.distanceMin));
        this.distanceMax = Number.isNaN(next) ? this.distanceMax : next;
    }

    formatDateTime(event: Event): string {
        const date = event.date ? new Date(`${event.date}T00:00:00`) : null;
        const start = event.startTime ? event.startTime.slice(0, 5) : '';
        const end = event.endTime ? event.endTime.slice(0, 5) : '';

        const datePart = date
            ? date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })
            : '';
        const timePart = start && end ? `${start} - ${end}` : start || end;

        return [datePart, timePart].filter(Boolean).join(' | ');
    }

    formatDistance(distanceKm?: number): string {
        if (distanceKm == null) return '';
        if (distanceKm < 1) return `${(distanceKm * 1000).toFixed(0)} m`;
        return `${distanceKm.toFixed(1)} km`;
    }

    goToEvent(event: Event) {
        this.focusEvent.emit(event);
    }

    toggle() {
        this.toggleSidebar.emit();
    }


    onSearchChange(value: string) {
        this.searchQuery = value;
        this.searchInput$.next(value);
    }

    onSearch() {
        if (!this.searchQuery || this.searchQuery.trim() === '') {
            this.clearSearch();
            return;
        }
        this.onSearchInternal(this.searchQuery.trim());
    }

    private onSearchInternal(query: string) {
        this.isSearching = true;

        // 1. Search Events (Backend)
        this.eventService.searchEvents(query).subscribe(results => {
            this.searchResults = results.filter(this.isFutureEvent);
        });

        // 2. Search City (Mapbox)
        this.mapboxService.searchCity(query).subscribe(features => {
            this.cityResults = features.map(f => ({
                name: f.place_name,
                center: f.center
            }));
        });

        // 3. Search Users (Backend)
        this.userService.searchUsers(query).subscribe(users => {
            this.userResults = users;
            this.checkFollowingStatuses();
        });
    }

    private checkFollowingStatuses() {
        if (!this.userId) return;
        this.userResults.forEach(user => {
            this.userService.isFollowing(this.userId!, user.id.toString()).subscribe(res => {
                console.log(`Checking follow status for ${user.id} (me: ${this.userId}):`, res);
                this.followingMap[user.id] = res.isFollowing;
            });
        });
    }

    followUser(user: User, event: MouseEvent) {
        event.stopPropagation();
        if (!this.userId) return;
        this.userService.followUser(this.userId, user.id.toString()).subscribe(() => {
            this.followingMap[user.id] = true;
        });
    }

    unfollowUser(user: User, event: MouseEvent) {
        event.stopPropagation();
        if (!this.userId) return;
        this.userService.unfollowUser(this.userId, user.id.toString()).subscribe(() => {
            this.followingMap[user.id] = false;
        });
    }

    setActiveTab(tab: 'events' | 'places' | 'creators') {
        this.activeTab = tab;
    }

    selectCity(city: { name: string, center: [number, number] }) {
        if (city) {
            const [lng, lat] = city.center;
            this.foundLocation.emit({ lat, lng });
        }
    }

    clearSearch() {
        this.searchQuery = '';
        this.isSearching = false;
        this.searchResults = [];
        this.cityResults = [];
        this.userResults = [];
        this.activeTab = 'events';
    }

    isMobileOrTablet(): boolean {
        return window.innerWidth <= 1024;
    }
}
