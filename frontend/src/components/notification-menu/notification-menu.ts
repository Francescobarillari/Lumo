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
    notifications: Notification[] = [];
    expandedId: number | null = null;

    constructor(private notifService: NotificationService, private eventService: EventService, private eRef: ElementRef) { }

    ngOnInit() {
        this.loadNotifications();
    }

    loadNotifications() {
        if (!this.userId) return;
        this.notifService.getNotifications(this.userId).subscribe(list => {
            this.notifications = list;
        });
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

    getIcon(type: string): string {
        switch (type) {
            case 'APPROVED': return 'check_circle';
            case 'REJECTED': return 'cancel';
            case 'FOLLOWUP': return 'event_available';
            case 'PARTICIPATION_REQUEST': return 'person_add';
            case 'PARTICIPATION_ACCEPTED': return 'how_to_reg';
            case 'PARTICIPATION_REJECTED': return 'person_remove';
            case 'REQUEST_ACCEPTED': return 'check_circle'; // Visual feedback for decision
            case 'REQUEST_REJECTED': return 'cancel'; // Visual feedback for decision
            case 'SUCCESS': return 'check_circle';
            case 'ERROR': return 'error';
            case 'WARNING': return 'warning';
            default: return 'notifications';
        }
    }

    getIconColor(type: string): string {
        switch (type) {
            case 'APPROVED': return 'var(--color-accent)'; // Yellow/Gold
            case 'REJECTED': return '#ff4444'; // Red
            case 'FOLLOWUP': return '#4caf50'; // Green
            case 'PARTICIPATION_REQUEST': return '#2196f3'; // Blue
            case 'PARTICIPATION_ACCEPTED': return '#4caf50';
            case 'PARTICIPATION_REJECTED': return '#ff4444';
            default: return 'white';
        }
    }
}
