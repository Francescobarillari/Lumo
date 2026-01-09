import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Event } from '../../models/event';
import { EventService } from '../../services/event.service';
import { EventCardComponent } from '../event-card/event-card.component';
import { User } from '../../models/user';

@Component({
    selector: 'app-my-events-modal',
    standalone: true,
    imports: [CommonModule, MatIconModule, EventCardComponent],
    templateUrl: './my-events-modal.html',
    styleUrl: './my-events-modal.css'
})
export class MyEventsModal implements OnInit {
    @Input() userId!: string | number;
    @Output() close = new EventEmitter<void>();

    view: 'organized' | 'joined' = 'organized'; // Simplified/restored if needed, or keep activeTab

    getViewTitle(): string {
        return this.activeTab === 'ORGANIZED' ? 'My Events' : 'Joined Events';
    }
    activeTab: 'ORGANIZED' | 'JOINED' = 'ORGANIZED';
    organizedEvents: Event[] = [];
    joinedEvents: Event[] = [];
    loading = false;

    // For expanding requests view for a specific event
    expandedEventRequestsId: number | null = null;

    constructor(private eventService: EventService) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading = true;
        // Load both or just active? Let's load both to have counts
        this.eventService.getOrganizedEvents(this.userId).subscribe({
            next: (events) => this.organizedEvents = events,
            error: (err) => console.error('Error loading organized events', err)
        });

        this.eventService.getJoinedEvents(this.userId).subscribe({
            next: (events) => {
                this.joinedEvents = events;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading joined events', err);
                this.loading = false;
            }
        });
    }

    switchTab(tab: 'ORGANIZED' | 'JOINED') {
        this.activeTab = tab;
        this.expandedEventRequestsId = null; // Reset expansion
    }

    toggleRequests(eventId: number) {
        if (this.expandedEventRequestsId === eventId) {
            this.expandedEventRequestsId = null;
        } else {
            this.expandedEventRequestsId = eventId;
        }
    }

    deleteEvent(event: Event) {
        const confirmed = confirm('Sei sicuro di voler cancellare questo evento?');
        if (!confirmed) return;

        this.eventService.deleteEvent(event.id).subscribe({
            next: () => {
                this.organizedEvents = this.organizedEvents.filter(e => e.id !== event.id);
                if (this.expandedEventRequestsId === event.id) {
                    this.expandedEventRequestsId = null;
                }
            },
            error: (err) => console.error('Errore nella cancellazione dell\'evento', err)
        });
    }

    acceptRequest(event: Event, user: User) {
        this.eventService.acceptParticipation(event.id, user.id).subscribe({
            next: () => {
                // Remove user from processed list locally
                if (event.pendingUsersList) {
                    event.pendingUsersList = event.pendingUsersList.filter(u => u.id !== user.id);
                }

                // Add to accepted list immediately
                if (!event.acceptedUsersList) {
                    event.acceptedUsersList = [];
                }
                event.acceptedUsersList.push(user);

                // Sort by name
                event.acceptedUsersList.sort((u1, u2) => (u1.name || '').localeCompare(u2.name || ''));

                // Increment occupied spots
                event.occupiedSpots = (event.occupiedSpots || 0) + 1;
            },
            error: (err) => console.error('Error accepting', err)
        });
    }

    rejectRequest(event: Event, user: User) {
        this.eventService.rejectParticipation(event.id, user.id).subscribe({
            next: () => {
                if (event.pendingUsersList) {
                    event.pendingUsersList = event.pendingUsersList.filter(u => u.id !== user.id);
                }
            },
            error: (err) => console.error('Error rejecting', err)
        });
    }

    formatDateTime(event: Event): string {
        const date = event.date ? new Date(`${event.date}T00:00:00`) : null;
        const start = event.startTime ? event.startTime.slice(0, 5) : '';
        const datePart = date ? date.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }) : '';
        return `${datePart} | ${start}`;
    }
}
