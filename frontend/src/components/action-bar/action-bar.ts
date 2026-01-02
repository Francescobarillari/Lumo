import { Component, EventEmitter, Input, Output, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UserMenu } from '../user-menu/user-menu';
import { NotificationMenuComponent } from '../notification-menu/notification-menu';
import { NotificationService } from '../../services/notification.service';
import { interval, Subscription, switchMap } from 'rxjs';
import { MyEventsModal } from '../my-events-modal/my-events-modal.component';

@Component({
    selector: 'app-action-bar',
    standalone: true,
    imports: [CommonModule, MatIconModule, UserMenu, NotificationMenuComponent, MyEventsModal],
    templateUrl: './action-bar.html',
    styleUrl: './action-bar.css'
})
export class ActionBarComponent implements OnInit, OnDestroy {
    @Input() loggedUser: { id: string; name: string; email: string; profileImage?: string } | null = null;
    @Output() action = new EventEmitter<string>();

    showUserMenu = false;
    showNotifications = false;
    showMyEventsModal = false;
    hasUnread = false;
    private pollSubscription: Subscription | null = null;

    constructor(private notificationService: NotificationService, private elementRef: ElementRef) { }

    ngOnInit() {
        // Poll for notifications every 5 seconds if user is logged in
        this.startPolling();
    }

    ngOnDestroy() {
        this.stopPolling();
    }

    ngOnChanges() {
        if (this.loggedUser) {
            this.checkUnreadNotifications();
            this.startPolling();
        } else {
            this.stopPolling();
        }
    }

    private startPolling() {
        if (this.pollSubscription) return; // Already polling
        if (!this.loggedUser) return;

        this.pollSubscription = interval(5000).pipe(
            switchMap(() => {
                if (this.loggedUser && !this.showNotifications) {
                    return this.notificationService.getNotifications(this.loggedUser.id);
                }
                return [];
            })
        ).subscribe({
            next: (notifications) => {
                // If notifications returned (array), check unread
                if (Array.isArray(notifications)) {
                    this.hasUnread = notifications.some(n => !n.isRead);
                }
            },
            error: (err) => console.error('Error polling notifications', err)
        });
    }

    private stopPolling() {
        if (this.pollSubscription) {
            this.pollSubscription.unsubscribe();
            this.pollSubscription = null;
        }
    }

    @HostListener('document:click', ['$event'])
    onClickOutside(event: MouseEvent) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.showUserMenu = false;
            this.showNotifications = false;
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

    toggleUserMenu(event?: Event) {
        if (event) event.stopPropagation();
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
        if (actionName === 'my-events') {
            this.showMyEventsModal = true;
        } else {
            this.action.emit(actionName);
        }
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
