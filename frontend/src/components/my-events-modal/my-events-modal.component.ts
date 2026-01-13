import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Event } from '../../models/event';
import { EventService } from '../../services/event.service';
import { EventCardComponent } from '../event-card/event-card.component';
import { EventShareModalComponent } from '../event-share-modal/event-share-modal.component';
import { EventChatModalComponent } from '../event-chat-modal/event-chat-modal';
import { User } from '../../models/user';

@Component({
    selector: 'app-my-events-modal',
    standalone: true,
    imports: [CommonModule, MatIconModule, EventCardComponent, EventShareModalComponent, EventChatModalComponent],
    templateUrl: './my-events-modal.html',
    styleUrl: './my-events-modal.css'
})
export class MyEventsModal implements OnInit {
    @Input() userId!: string | number;
    @Output() close = new EventEmitter<void>();

    view: 'organized' | 'joined' = 'organized'; // Simplified/restored if needed, or keep activeTab

    getViewTitle(): string {
        if (this.expandedEventRequestsId) return 'Manage Requests';
        if (this.activeTab === 'ORGANIZED') return 'My Events';
        if (this.activeTab === 'JOINED') return 'Joined Events';
        return 'Saved Events';
    }

    onBack() {
        if (this.expandedEventRequestsId) {
            this.expandedEventRequestsId = null;
        } else {
            this.close.emit();
        }
    }
    activeTab: 'ORGANIZED' | 'JOINED' | 'SAVED' = 'ORGANIZED';
    organizedEvents: Event[] = [];
    joinedEvents: Event[] = [];
    savedEvents: Event[] = [];
    loading = false;
    sharingEvent: Event | null = null;

    // For expanding requests view for a specific event
    expandedEventRequestsId: number | null = null;
    showChatModal = false;
    chatEvent: Event | null = null;

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
            },
            error: (err) => {
                console.error('Error loading joined events', err);
            }
        });

        this.eventService.getSavedEvents(this.userId).subscribe({
            next: (events) => {
                this.savedEvents = events;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading saved events', err);
                this.loading = false;
            }
        });
    }

    switchTab(tab: 'ORGANIZED' | 'JOINED' | 'SAVED') {
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
        const confirmed = confirm('Are you sure you want to delete this event?');
        if (!confirmed) return;

        this.eventService.deleteEvent(event.id).subscribe({
            next: () => {
                this.organizedEvents = this.organizedEvents.filter(e => e.id !== event.id);
                if (this.expandedEventRequestsId === event.id) {
                    this.expandedEventRequestsId = null;
                }
            },
            error: (err) => console.error('Error deleting event', err)
        });
    }

    openChat(event: Event) {
        this.chatEvent = event;
        this.showChatModal = true;
    }

    closeChat() {
        this.showChatModal = false;
        this.chatEvent = null;
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

    removeParticipant(event: Event, user: User) {
        const confirmed = confirm(`Remove ${user.name} ${user.surname} from this event?`);
        if (!confirmed) return;

        this.eventService.removeParticipant(event.id, user.id, this.userId).subscribe({
            next: () => {
                if (event.acceptedUsersList) {
                    event.acceptedUsersList = event.acceptedUsersList.filter(u => u.id !== user.id);
                }
                event.occupiedSpots = Math.max(0, (event.occupiedSpots || 0) - 1);
            },
            error: (err) => console.error('Error removing participant', err)
        });
    }

    openShare(event: Event) {
        this.sharingEvent = event;
    }

    formatDateTime(event: Event): string {
        const date = event.date ? new Date(`${event.date}T00:00:00`) : null;
        const start = event.startTime ? event.startTime.slice(0, 5) : '';
        const datePart = date ? date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }) : '';
        return `${datePart} | ${start}`;
    }
}
