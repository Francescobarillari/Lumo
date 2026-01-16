import { Component, Input, OnInit, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Notification, NotificationService } from '../../services/notification.service';
import { EventService } from '../../services/event.service';

@Component({
    selector: 'notification-menu',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './notification-menu.html',
    styleUrls: ['./notification-menu.css']
})
export class NotificationMenuComponent implements OnInit {
    @Input() userId!: number | string;
    @Output() close = new EventEmitter<void>();
    @Output() openChat = new EventEmitter<number>();
    @Output() openEvent = new EventEmitter<number>();
    notifications: Notification[] = [];
    expandedId: number | null = null;

    constructor(private notifService: NotificationService, private eventService: EventService, private eRef: ElementRef) { }

    ngOnInit() {
        this.loadNotifications();
    }

    loadNotifications() {
        if (!this.userId) return;
        this.notifService.getNotifications(this.userId).subscribe(list => {
            this.notifications = list.map(n => this.translateNotification(n));
        });
    }

    translateNotification(n: Notification): Notification {
        const originalMessage = n.message || '';
        const quotedParts = originalMessage.match(/["']([^"']+)["']/g)?.map((m) => m.slice(1, -1)) || [];
        const eventName = quotedParts.length ? quotedParts[quotedParts.length - 1] : '';
        const firstQuoted = quotedParts[0] || '';

        switch (n.type) {
            case 'APPROVED':
                n.title = 'Event Approved';
                if (eventName) {
                    n.message = `Your event '${eventName}' has been approved and is now visible!`;
                } else {
                    n.message = 'Your event has been approved and is now visible!';
                }
                break;
            case 'REJECTED':
                n.title = 'Event Rejected';
                if (originalMessage.toLowerCase().includes('reason:')) {
                    n.message = originalMessage;
                } else if (eventName) {
                    n.message = `Your event '${eventName}' has been rejected.`;
                } else {
                    n.message = 'Your event has been rejected.';
                }
                break;
            case 'PARTICIPATION_REQUEST':
                n.title = 'Participation Request';
                if (quotedParts.length >= 2) {
                    n.message = `User '${firstQuoted}' wants to join event '${eventName}'.`;
                } else if (eventName) {
                    n.message = `A user wants to join event '${eventName}'.`;
                } else {
                    n.message = 'A user requested to join your event.';
                }
                break;
            case 'PARTICIPATION_ACCEPTED':
                n.title = 'Request Accepted';
                n.message = 'Your request to join the event has been accepted!';
                break;
            case 'PARTICIPATION_REJECTED':
                n.title = 'Request Rejected';
                n.message = 'Your request to join the event has been rejected.';
                break;
            case 'PARTICIPATION_REMOVED':
                n.title = 'Removed from Event';
                if (eventName) {
                    n.message = `You have been removed from the event '${eventName}'.`;
                } else {
                    n.message = 'You have been removed from the event.';
                }
                break;
            case 'REQUEST_ACCEPTED':
                n.title = 'Request Accepted';
                break;
            case 'REQUEST_REJECTED':
                n.title = 'Request Rejected';
                break;
            case 'CHAT_MESSAGE':
                n.title = 'New chat message';
                break;
        }
        return n;
    }

    toggleExpand(id: number, event: Event) {
        event.stopPropagation();
        this.expandedId = this.expandedId === id ? null : id;
    }

    deleteRead() {
        if (!this.userId) return;
        this.notifService.deleteReadNotifications(this.userId).subscribe({
            next: () => {
                this.notifications = this.notifications.filter(n => !n.isRead);
            },
            error: (err) => console.error('Error deleting read notifications', err)
        });
    }

    acceptRequest(n: Notification, event: Event) {
        event.stopPropagation();
        console.log('Attempting to accept request:', n);
        if (n.relatedEventId && n.relatedUserId) {
            console.log('IDs found, calling service...');
            this.eventService.acceptParticipation(n.relatedEventId, n.relatedUserId).subscribe({
                next: () => {
                    console.log('Participation accepted successfully');
                    this.notifService.updateType(n.id, 'REQUEST_ACCEPTED').subscribe(() => {
                        this.notifService.markAsRead(n.id).subscribe(() => this.loadNotifications());
                    });
                },
                error: (err) => console.error('Error accepting participation', err)
            });
        } else {
            console.error('Missing relatedEventId or relatedUserId in notification:', n);
        }
    }

    rejectRequest(n: Notification, event: Event) {
        event.stopPropagation();
        if (n.relatedEventId && n.relatedUserId) {
            this.eventService.rejectParticipation(n.relatedEventId, n.relatedUserId).subscribe({
                next: () => {
                    this.notifService.updateType(n.id, 'REQUEST_REJECTED').subscribe(() => {
                        this.notifService.markAsRead(n.id).subscribe(() => this.loadNotifications());
                    });
                },
                error: (err) => console.error('Error rejecting participation', err)
            });
        }
    }

    delete(event: Event, n: Notification) {
        event.stopPropagation();
        this.notifService.deleteNotification(n.id).subscribe({
            next: () => {
                this.notifications = this.notifications.filter(item => item.id !== n.id);
            },
            error: (err) => console.error('Error deleting notification', err)
        });
    }

    onNotificationClick(n: Notification) {
        if (n.type === 'CHAT_MESSAGE') {
            if (!n.relatedEventId) {
                console.error('Missing relatedEventId in chat notification:', n);
                return;
            }
            this.openChat.emit(n.relatedEventId);
            this.close.emit();
            return;
        }

        if (n.type === 'FOLLOWUP') {
            if (!n.relatedEventId) {
                console.error('Missing relatedEventId in followup notification:', n);
                return;
            }
            this.openEvent.emit(n.relatedEventId);
            this.close.emit();
        }
    }

    getIcon(type: string): string {
        switch (type) {
            case 'APPROVED': return 'check_circle';
            case 'REJECTED': return 'cancel';
            case 'FOLLOWUP': return 'event_available';
            case 'PARTICIPATION_REQUEST': return 'person_add';
            case 'PARTICIPATION_ACCEPTED': return 'how_to_reg';
            case 'PARTICIPATION_REJECTED': return 'person_remove';
            case 'PARTICIPATION_REMOVED': return 'person_remove';
            case 'REQUEST_ACCEPTED': return 'check_circle';
            case 'REQUEST_REJECTED': return 'cancel';
            case 'CHAT_MESSAGE': return 'chat';
            case 'SUCCESS': return 'check_circle';
            case 'ERROR': return 'error';
            case 'WARNING': return 'warning';
            default: return 'notifications';
        }
    }

    getIconColor(type: string): string {
        switch (type) {
            case 'APPROVED': return 'var(--color-accent)';
            case 'REJECTED': return '#ff4444';
            case 'FOLLOWUP': return '#4caf50';
            case 'PARTICIPATION_REQUEST': return '#2196f3';
            case 'PARTICIPATION_ACCEPTED': return '#4caf50';
            case 'PARTICIPATION_REJECTED': return '#ff4444';
            case 'PARTICIPATION_REMOVED': return '#ff4444';
            case 'CHAT_MESSAGE': return 'var(--color-accent)';

            default: return 'white';
        }
    }
}
