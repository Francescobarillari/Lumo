import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UserMenu } from '../user-menu/user-menu';
import { NotificationMenuComponent } from '../notification-menu/notification-menu';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-action-bar',
    standalone: true,
    imports: [CommonModule, MatIconModule, UserMenu, NotificationMenuComponent],
    templateUrl: './action-bar.html',
    styleUrl: './action-bar.css'
})
export class ActionBarComponent {
    @Input() loggedUser: { id: string; name: string; email: string; profileImage?: string } | null = null;
    @Output() action = new EventEmitter<string>();

    showUserMenu = false;
    showNotifications = false;
    hasUnread = false;

    constructor(private notificationService: NotificationService) { }

    ngOnChanges() {
        if (this.loggedUser) {
            this.checkUnreadNotifications();
        }
    }

    checkUnreadNotifications() {
        if (!this.loggedUser) return;
        this.notificationService.getNotifications(this.loggedUser.id).subscribe({
            next: (notifications) => {
                this.hasUnread = notifications.some(n => !n.isRead);
            },
            error: (err) => console.error('Error fetching notifications status', err)
        });
    }

    toggleUserMenu() {
        this.showUserMenu = !this.showUserMenu;
        this.showNotifications = false;
    }

    toggleNotifications(event: Event) {
        event.stopPropagation();
        this.showNotifications = !this.showNotifications;
        this.showUserMenu = false;

        if (this.showNotifications && this.loggedUser) {
            // Mark all as read when opening
            this.notificationService.markAllAsRead(this.loggedUser.id).subscribe({
                next: () => {
                    this.hasUnread = false; // Clear indicator immediately
                },
                error: (err) => console.error('Error marking read', err)
            });
        } else if (!this.showNotifications && this.loggedUser) {
            // Optional: Re-fetch status if needed, but local optimisic update is fine
            this.checkUnreadNotifications();
        }
    }

    onMenuAction(actionName: string) {
        this.action.emit(actionName);
        this.showUserMenu = false;
    }

    onAddEvent() {
        this.action.emit('add-event');
    }

    getInitials(name: string): string {
        if (!name) return '';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
}
