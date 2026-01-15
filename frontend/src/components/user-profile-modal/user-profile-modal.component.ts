import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user-service/user-service';
import { User } from '../../models/user';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event';
import { ReportModalComponent } from '../report-modal/report-modal.component';

@Component({
    selector: 'app-user-profile-modal',
    standalone: true,
    imports: [CommonModule, MatIconModule, ReportModalComponent],
    templateUrl: './user-profile-modal.html',
    styleUrl: './user-profile-modal.css'
})
export class UserProfileModalComponent implements OnChanges {
    @Input() userId: string | null = null;
    @Input() currentUserId: string | null = null;
    @Output() close = new EventEmitter<void>();
    @Output() openProfile = new EventEmitter<string>();

    user: User | null = null;
    isFollowing: boolean = false;
    loading: boolean = false;
    notificationsEnabled: boolean = false;
    notificationsLoading: boolean = false;

    // Followers/Following lists
    view: 'profile' | 'followers' | 'following' | 'events' = 'profile';
    userList: User[] = [];
    loadingList: boolean = false;
    myFollowingIds: Set<string> = new Set(); // To knowing if I follow the people in the lists
    loadingEvents: boolean = false;
    upcomingEvents: Event[] = [];
    pastEvents: Event[] = [];
    showReportModal = false;

    constructor(private userService: UserService, private eventService: EventService) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['userId'] && this.userId) {
            this.loadUser();
            this.checkIfFollowing();
        }
    }

    onClose() {
        if (this.view !== 'profile') {
            this.view = 'profile';
        } else {
            this.close.emit();
        }
    }

    getViewTitle(): string {
        switch (this.view) {
            case 'followers': return 'Followers';
            case 'following': return 'Following';
            case 'events': return 'Events';
            default: return 'Profile';
        }
    }

    loadUser() {
        if (!this.userId) return;
        this.loading = true;
        this.userService.getUserById(this.userId).subscribe({
            next: (u) => {
                this.user = u;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading user profile', err);
                this.loading = false;
            }
        });
    }

    checkIfFollowing() {
        if (!this.userId || !this.currentUserId) return;
        this.userService.isFollowing(this.currentUserId, this.userId).subscribe({
            next: (res) => {
                this.isFollowing = res.isFollowing;
                if (this.isFollowing) {
                    this.loadNotificationPreference();
                } else {
                    this.notificationsEnabled = false;
                }
            },
            error: (err) => console.error(err)
        });
    }

    toggleFollow() {
        if (!this.userId || !this.currentUserId) return;

        if (this.isFollowing) {
            if (confirm('Are you sure you want to unfollow this user?')) {
                this.userService.unfollowUser(this.currentUserId, this.userId).subscribe({
                    next: () => {
                        this.isFollowing = false;
                        if (this.user) {
                            this.user.followersCount = (this.user.followersCount || 1) - 1;
                        }
                        this.userService.notifyUserUpdate();
                    },
                    error: (err) => console.error(err)
                });
            }
        } else {
            this.userService.followUser(this.currentUserId, this.userId).subscribe({
                next: () => {
                    this.isFollowing = true;
                    this.notificationsEnabled = true;
                    if (this.user) {
                        this.user.followersCount = (this.user.followersCount || 0) + 1;
                    }
                    this.userService.notifyUserUpdate();
                },
                error: (err) => console.error(err)
            });
        }
    }

    getInitials(name: string): string {
        if (!name) return '';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }

    // List Logic (Copy-Paste adapted from AccountModal but Read-Only mainly)
    showFollowers() {
        if (!this.userId) return;
        this.view = 'followers';
        this.loadingList = true;

        this.userService.getFollowers(this.userId).subscribe({
            next: (followers) => {
                this.userList = followers;
                this.fetchMyFollowing(); // To show follow/unfollow buttons in the list if desired
            },
            error: (err) => {
                console.error(err);
                this.loadingList = false;
            }
        });
    }

    showFollowing() {
        if (!this.userId) return;
        this.view = 'following';
        this.loadingList = true;
        this.userService.getFollowing(this.userId).subscribe({
            next: (following) => {
                this.userList = following;
                this.fetchMyFollowing();
            },
            error: (err) => {
                console.error(err);
                this.loadingList = false;
            }
        });
    }

    fetchMyFollowing() {
        if (!this.currentUserId) {
            this.loadingList = false;
            return;
        }
        this.userService.getFollowing(this.currentUserId).subscribe({
            next: (following) => {
                this.myFollowingIds = new Set(following.map(u => u.id.toString()));
                this.loadingList = false;
            },
            error: (err) => {
                console.error(err);
                this.loadingList = false;
            }
        });
    }

    // Follow logic for the list items
    onListFollow(targetUser: User) {
        if (!this.currentUserId) return;
        this.userService.followUser(this.currentUserId, targetUser.id.toString()).subscribe({
            next: () => {
                this.myFollowingIds.add(targetUser.id.toString());
                this.userService.notifyUserUpdate();
            },
            error: (err) => console.error(err)
        });
    }

    onOpenProfileFromList(targetUser: User) {
        if (!targetUser?.id) return;
        this.view = 'profile';
        this.openProfile.emit(targetUser.id.toString());
    }

    onListUnfollow(targetUser: User) {
        if (!this.currentUserId) return;
        if (confirm(`Are you sure you want to unfollow ${targetUser.name}?`)) {
            this.userService.unfollowUser(this.currentUserId, targetUser.id.toString()).subscribe({
                next: () => {
                    this.myFollowingIds.delete(targetUser.id.toString());
                    this.userService.notifyUserUpdate();
                },
                error: (err) => console.error(err)
            });
        }
    }

    showEvents() {
        if (!this.userId) return;
        this.view = 'events';
        if (this.upcomingEvents.length || this.pastEvents.length || this.loadingEvents) {
            return;
        }
        this.loadingEvents = true;
        this.eventService.getOrganizedEvents(this.userId).subscribe({
            next: (events) => {
                const now = new Date();
                this.upcomingEvents = [];
                this.pastEvents = [];
                events.forEach(ev => {
                    const eventDate = new Date(`${ev.date}T${ev.endTime || ev.startTime || '00:00'}`);
                    if (eventDate.getTime() >= now.getTime()) {
                        this.upcomingEvents.push(ev);
                    } else {
                        this.pastEvents.push(ev);
                    }
                });
                this.upcomingEvents.sort((a, b) => new Date(`${a.date}T${a.startTime || '00:00'}`).getTime() - new Date(`${b.date}T${b.startTime || '00:00'}`).getTime());
                this.pastEvents.sort((a, b) => new Date(`${b.date}T${b.startTime || '00:00'}`).getTime() - new Date(`${a.date}T${a.startTime || '00:00'}`).getTime());
                this.loadingEvents = false;
            },
            error: (err) => {
                console.error('Error loading events by user', err);
                this.loadingEvents = false;
            }
        });
    }

    formatEventDate(ev: Event): string {
        const date = ev.date ? new Date(`${ev.date}T00:00:00`) : null;
        const start = ev.startTime ? ev.startTime.slice(0, 5) : '';
        const end = ev.endTime ? ev.endTime.slice(0, 5) : '';
        const datePart = date ? date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }) : '';
        const timePart = start && end ? `${start} - ${end}` : start || end;
        return [datePart, timePart].filter(Boolean).join(' • ');
    }

    eventStats(ev: Event): { participants: string; freeSpots?: string; cost: string } {
        const occupied = ev.occupiedSpots ?? 0;
        const max = ev.nPartecipants ?? null;
        let participants = `${occupied}${max ? `/${max}` : ''}`;
        let freeSpots: string | undefined;
        if (max != null) {
            freeSpots = Math.max(max - occupied, 0).toString();
        }
        const cost = ev.costPerPerson == null || ev.costPerPerson === 0
            ? 'Free'
            : ev.costPerPerson.toString();
        return { participants, freeSpots, cost };
    }

    toggleNotifications(event?: MouseEvent) {
        event?.stopPropagation();
        if (!this.currentUserId || !this.userId || !this.isFollowing) return;

        const nextValue = !this.notificationsEnabled;
        this.notificationsLoading = true;
        this.userService.setFollowNotifications(this.currentUserId, this.userId, nextValue).subscribe({
            next: (res) => {
                this.notificationsEnabled = res.enabled;
                this.notificationsLoading = false;
            },
            error: (err) => {
                console.error('Error updating follow notifications', err);
                this.notificationsLoading = false;
            }
        });
    }

    openReportModal() {
        if (!this.user || !this.currentUserId) return;
        if (this.user.id.toString() === this.currentUserId) return;
        this.showReportModal = true;
    }

    closeReportModal() {
        this.showReportModal = false;
    }

    private loadNotificationPreference() {
        if (!this.currentUserId || !this.userId) return;
        this.notificationsLoading = true;
        this.userService.getFollowNotifications(this.currentUserId, this.userId).subscribe({
            next: (res) => {
                this.notificationsEnabled = !!res.enabled;
                this.notificationsLoading = false;
            },
            error: (err) => {
                console.error('Error loading follow notification preference', err);
                this.notificationsEnabled = false;
                this.notificationsLoading = false;
            }
        });
    }
}
