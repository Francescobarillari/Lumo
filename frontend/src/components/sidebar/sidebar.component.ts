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
    filterMenuOpen = false;
    sortMenuOpen = false;
    readonly filterOrder: Array<typeof this.filterOption> = ['all', 'participating', 'free', 'available'];
    readonly sortOrder: Array<typeof this.sortOption> = ['date', 'distance', 'name'];
    readonly filterLabels: Record<typeof this.filterOption, string> = {
        all: 'Tutti',
        participating: 'Partecipi',
        free: 'Gratuiti',
        available: 'Posti liberi'
    };
    readonly sortLabels: Record<typeof this.sortOption, string> = {
        date: 'Data',
        distance: 'Distanza',
        name: 'Nome'
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

    formatDateTime(event: Event): string {
        const date = event.date ? new Date(`${event.date}T00:00:00`) : null;
        const start = event.startTime ? event.startTime.slice(0, 5) : '';
        const end = event.endTime ? event.endTime.slice(0, 5) : '';

        const datePart = date
            ? date.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })
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
