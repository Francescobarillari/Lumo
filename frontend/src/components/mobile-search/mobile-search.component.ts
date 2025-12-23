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

    searchQuery: string = '';
    isExpanded: boolean = false;
    isSearching: boolean = false;
    activeTab: 'events' | 'places' | 'creators' = 'events';

    searchResults: Event[] = [];
    cityResults: { name: string, center: [number, number] }[] = [];
    userResults: User[] = [];

    constructor(
        private eventService: EventService,
        private mapboxService: MapboxService,
        private userService: UserService
    ) { }

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
        });
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
}
