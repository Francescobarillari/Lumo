import { Component, EventEmitter, Input, Output, ElementRef, HostListener, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UserMenu } from '../user-menu/user-menu';
import { NotificationMenuComponent } from '../notification-menu/notification-menu';
import { NotificationService } from '../../services/notification.service';
import { interval, Subscription, switchMap } from 'rxjs';
import { MyEventsModal } from '../my-events-modal/my-events-modal.component';
import { AccountModalComponent } from '../account-modal/account-modal.component';
import { UserService } from '../../services/user-service/user-service';
import { Event as LumoEvent } from '../../models/event';

@Component({
    selector: 'app-action-bar',
    standalone: true,
    imports: [CommonModule, MatIconModule, UserMenu, NotificationMenuComponent, MyEventsModal, AccountModalComponent],
    templateUrl: './action-bar.html',
    styleUrl: './action-bar.css'
})
export class ActionBarComponent implements OnInit, OnDestroy, OnChanges {
    @Input() loggedUser: { id: string; name: string; email: string; profileImage?: string; followersCount?: number; followingCount?: number } | null = null;
    @Output() action = new EventEmitter<string>();
    @Output() openProfile = new EventEmitter<string>();
    @Output() openChatFromNotification = new EventEmitter<number>();
    @Output() openEventFromNotification = new EventEmitter<number>();
    @Output() focusEvent = new EventEmitter<LumoEvent>();

    showUserMenu = false;
    showNotifications = false;
    showMyEventsModal = false;
    showAccountModal = false;
    hasUnread = false;
    private pollSubscription: Subscription | null = null;

    constructor(
        private notificationService: NotificationService,
        private elementRef: ElementRef,
        private userService: UserService
    ) { }

    ngOnInit() {
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
        if (this.pollSubscription) return;
        if (!this.loggedUser) return;

        this.pollSubscription = interval(5000).pipe(
            switchMap(() => {
                const requests = [];

                if (this.loggedUser && !this.showNotifications) {
                    requests.push(this.notificationService.getNotifications(this.loggedUser.id));
                }

                if (this.loggedUser) {
                    this.userService.notifyUserUpdate();
                }

                if (requests.length > 0) {
                    return this.notificationService.getNotifications(this.loggedUser!.id);
                }
                return [];
            })
        ).subscribe({
            next: (notifications) => {
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

    toggleUserMenu(event?: MouseEvent) {
        if (event) event.stopPropagation();
        this.showUserMenu = !this.showUserMenu;
        this.showNotifications = false;
    }

    toggleNotifications(event: MouseEvent) {
        event.stopPropagation();
        this.showNotifications = !this.showNotifications;
        this.showUserMenu = false;

        if (this.showNotifications && this.loggedUser) {
            this.notificationService.markAllAsRead(this.loggedUser.id).subscribe({
                next: () => {
                    this.hasUnread = false;
                },
                error: (err) => console.error('Error marking read', err)
            });
        } else if (!this.showNotifications && this.loggedUser) {
            this.checkUnreadNotifications();
        }
    }

    onMenuAction(actionName: string) {
        if (actionName === 'my-events') {
            this.showMyEventsModal = true;
        } else if (actionName === 'account') {
            this.showAccountModal = true;
        } else {
            this.action.emit(actionName);
        }
        this.showUserMenu = false;
    }

    onOpenProfileFromAccount(userId: string) {
        this.showAccountModal = false;
        this.openProfile.emit(userId);
    }

    onChangePhotoFromAccount() {
        this.showAccountModal = false;
        this.action.emit('change-photo');
    }

    onOpenChatFromNotification(eventId: number) {
        this.showNotifications = false;
        this.openChatFromNotification.emit(eventId);
    }

    onOpenEventFromNotification(eventId: number) {
        this.showNotifications = false;
        this.openEventFromNotification.emit(eventId);
    }

    onFocusEvent(event: LumoEvent) {
        this.showMyEventsModal = false;
        this.focusEvent.emit(event);
    }

    onAddEvent() {
        this.action.emit('add-event');
    }

    getInitials(name: string): string {
        if (!name) return '';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
}
