import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { EventCardComponent } from '../event-card/event-card.component';
import { Event } from '../../models/event';
import { EventService } from '../../services/event.service';
import { MapboxService } from '../../services/mapbox.service';
import { UserService } from '../../services/user-service/user-service';
import { User } from '../../models/user';
@Component({
    selector: 'app-mobile-search',
    standalone: true,
    imports: [CommonModule, FormsModule, MatIconModule, EventCardComponent],
    templateUrl: './mobile-search.component.html',
    styleUrl: './mobile-search.component.css'
})
export class MobileSearchComponent {
    @Output() focusEvent = new EventEmitter<Event>();
    @Output() foundLocation = new EventEmitter<{ lat: number, lng: number }>();
    @Output() toggleFavorite = new EventEmitter<Event>();
    @Output() openUserProfile = new EventEmitter<string>();
    @Input() userId: string | null = null;
    @Input() events: Event[] = [];

    searchQuery: string = '';
    isExpanded: boolean = false;
    isSearching: boolean = false;
    activeTab: 'events' | 'places' | 'creators' = 'events';

    searchResults: Event[] = [];
    cityResults: { name: string, center: [number, number] }[] = [];
    userResults: User[] = [];
    followingMap: { [userId: number]: boolean } = {};

    // Restore desktop sections for mobile
    followUpEvents: Event[] = [];
    savedEvents: Event[] = [];
    discoverEvents: Event[] = [];
    foundEvents: Event[] = [];

    // Filter/Sort state
    filterOption: 'all' | 'participating' | 'free' | 'available' = 'all';
    sortOption: 'date' | 'distance' | 'name' = 'date';
    filterMenuOpen = false;
    sortMenuOpen = false;
    showFilterOptions = false;

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

    constructor(
        private eventService: EventService,
        private mapboxService: MapboxService,
        private userService: UserService
    ) { }

    ngOnChanges() {
        this.categorizeEvents();
    }

    toggleExpand() {
        this.isExpanded = !this.isExpanded;
        if (!this.isExpanded) {
            this.clearSearch();
        }
    }

    onSearch() {
        if (!this.searchQuery || this.searchQuery.trim() === '') {
            this.clearSearch();
            return;
        }

        this.isSearching = true;

        // 1. Search Events
        this.eventService.searchEvents(this.searchQuery).subscribe(results => {
            this.searchResults = results;
        });

        // 2. Search City
        this.mapboxService.searchCity(this.searchQuery).subscribe(features => {
            this.cityResults = features.map(f => ({
                name: f.place_name,
                center: f.center
            }));
        });

        // 3. Search Users
        this.userService.searchUsers(this.searchQuery).subscribe(users => {
            this.userResults = users;
            this.checkFollowingStatuses();
        });
    }

    private checkFollowingStatuses() {
        if (!this.userId) return;
        this.userResults.forEach(user => {
            this.userService.isFollowing(this.userId!, user.id.toString()).subscribe(res => {
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

    openProfile(user: User) {
        this.openUserProfile.emit(user.id.toString());
        this.closeSearch();
    }

    setActiveTab(tab: 'events' | 'places' | 'creators') {
        this.activeTab = tab;
    }

    selectCity(city: { name: string, center: [number, number] }) {
        const [lng, lat] = city.center;
        this.foundLocation.emit({ lat, lng });
        this.closeSearch();
    }

    goToEvent(event: Event) {
        this.focusEvent.emit(event);
        this.closeSearch();
    }

    clearSearch() {
        this.searchQuery = '';
        this.isSearching = false;
        this.searchResults = [];
        this.cityResults = [];
        this.userResults = [];
    }

    closeSearch() {
        this.isExpanded = false;
        this.clearSearch();
    }

    formatDateTime(event: Event): string {
        const date = event.date ? new Date(`${event.date}T00:00:00`) : null;
        const start = event.startTime ? event.startTime.slice(0, 5) : '';
        const end = event.endTime ? event.endTime.slice(0, 5) : '';
        const datePart = date ? date.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }) : '';
        const timePart = start && end ? `${start} - ${end}` : start || end;
        return [datePart, timePart].filter(Boolean).join(' | ');
    }

    formatDistance(distanceKm?: number): string {
        if (distanceKm == null) return '';
        if (distanceKm < 1) return `${(distanceKm * 1000).toFixed(0)} m`;
        return `${distanceKm.toFixed(1)} km`;
    }

    private isFutureEvent = (event: Event): boolean => {
        if (!event.date) return true;
        const end = event.endTime || event.startTime || '23:59';
        const eventDateTime = new Date(`${event.date}T${end}`);
        return eventDateTime.getTime() >= Date.now();
    };

    private categorizeEvents() {
        this.followUpEvents = [];
        this.savedEvents = [];
        this.discoverEvents = [];
        this.foundEvents = [];

        if (!this.userId) {
            this.foundEvents = this.events.filter(this.isFutureEvent);
            return;
        }

        this.eventService.getJoinedEvents(this.userId).subscribe(joined => {
            this.followUpEvents = joined.filter(this.isFutureEvent);
        });

        this.events.filter(this.isFutureEvent).forEach(event => {
            const isSaved = event.isSaved || false;
            const isParticipating = event.isParticipating || false;

            if (isSaved) this.savedEvents.push(event);
            if (!isParticipating && !isSaved) this.discoverEvents.push(event);
        });
    }

    private applyFilters(events: Event[]): Event[] {
        let filtered = [...events];
        switch (this.filterOption) {
            case 'participating': filtered = filtered.filter(e => !!e.isParticipating); break;
            case 'free': filtered = filtered.filter(e => e.costPerPerson == null || e.costPerPerson === 0); break;
            case 'available': filtered = filtered.filter(e => {
                if (e.nPartecipants == null || e.occupiedSpots == null) return true;
                return (e.nPartecipants - e.occupiedSpots) > 0;
            }); break;
        }
        switch (this.sortOption) {
            case 'distance': filtered.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999)); break;
            case 'name': filtered.sort((a, b) => (a.title || '').localeCompare(b.title || '')); break;
            case 'date': default: filtered.sort((a, b) => {
                const aTime = new Date(`${a.date}T${a.startTime || '00:00'}`).getTime();
                const bTime = new Date(`${b.date}T${b.startTime || '00:00'}`).getTime();
                return aTime - bTime;
            }); break;
        }
        return filtered;
    }

    getFiltered(list: Event[]): Event[] {
        return this.applyFilters(list);
    }

    selectFilter(opt: any) { this.filterOption = opt; this.filterMenuOpen = false; }
    selectSort(opt: any) { this.sortOption = opt; this.sortMenuOpen = false; }
}
