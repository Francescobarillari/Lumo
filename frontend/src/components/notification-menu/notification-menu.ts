import { Component, Input, OnInit, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Notification, NotificationService } from '../../services/notification.service';

@Component({
    selector: 'notification-menu',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './notification-menu.html',
    styleUrls: ['./notification-menu.css']
})
export class NotificationMenuComponent implements OnInit {
    @Input() userId!: number | string;
    notifications: Notification[] = [];
    expandedId: number | null = null;

    constructor(private notifService: NotificationService, private eRef: ElementRef) { }

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

    getIcon(type: string): string {
        switch (type) {
            case 'APPROVED': return 'check_circle';
            case 'REJECTED': return 'cancel';
            case 'FOLLOWUP': return 'event_available';
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
            default: return 'white';
        }
    }
}
