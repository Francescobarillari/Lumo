import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
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
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, FormsModule, MatIconModule, EventCardComponent], // Added FormsModule
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnChanges {
    @Input() events: Event[] = [];
    @Output() focusEvent = new EventEmitter<Event>();
    @Input() collapsed = false;
    @Input() userId: string | null = null;
    @Output() toggleSidebar = new EventEmitter<void>();
    @Output() toggleFavorite = new EventEmitter<Event>();
    @Output() foundLocation = new EventEmitter<{ lat: number, lng: number }>(); // New output

    searchQuery: string = '';
    searchResults: Event[] = [];
    cityResults: { name: string, center: [number, number] }[] = [];
    userResults: User[] = [];
    activeTab: 'events' | 'places' | 'creators' = 'events';
    isSearching: boolean = false;

    constructor(
        private eventService: EventService,
        private mapboxService: MapboxService,
        private userService: UserService
    ) { }

    followUpEvents: Event[] = [];
    savedEvents: Event[] = [];
    discoverEvents: Event[] = [];
    foundEvents: Event[] = [];

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
            this.foundEvents = [...this.events];
            return;
        }

        // Logged In Logic
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Normalize today

        // 1. Fetch Follow Up Events (Directly from backend to ensure we get everything, including own events)
        this.eventService.getJoinedEvents(this.userId).subscribe({
            next: (joined) => {
                this.followUpEvents = joined;

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
        this.events.forEach(event => {
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


    onSearch() {
        if (!this.searchQuery || this.searchQuery.trim() === '') {
            this.clearSearch();
            return;
        }

        this.isSearching = true;

        // 1. Search Events (Backend)
        this.eventService.searchEvents(this.searchQuery).subscribe(results => {
            this.searchResults = results;
        });

        // 2. Search City (Mapbox)
        this.mapboxService.searchCity(this.searchQuery).subscribe(features => {
            this.cityResults = features.map(f => ({
                name: f.place_name,
                center: f.center
            }));
        });

        // 3. Search Users (Backend)
        this.userService.searchUsers(this.searchQuery).subscribe(users => {
            this.userResults = users;
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
}
