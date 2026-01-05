import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user-service/user-service';
import { User } from '../../models/user';

@Component({
    selector: 'app-user-profile-modal',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './user-profile-modal.html',
    styleUrl: './user-profile-modal.css'
})
export class UserProfileModalComponent implements OnChanges {
    @Input() userId: string | null = null;
    @Input() currentUserId: string | null = null;
    @Output() close = new EventEmitter<void>();

    user: User | null = null;
    isFollowing: boolean = false;
    loading: boolean = false;

    // Followers/Following lists
    view: 'profile' | 'followers' | 'following' = 'profile';
    userList: User[] = [];
    loadingList: boolean = false;
    myFollowingIds: Set<string> = new Set(); // To knowing if I follow the people in the lists

    constructor(private userService: UserService) { }

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
            },
            error: (err) => console.error(err)
        });
    }

    toggleFollow() {
        if (!this.userId || !this.currentUserId) return;

        if (this.isFollowing) {
            if (confirm('Sei sicuro di voler smettere di seguire questo utente?')) {
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

    onListUnfollow(targetUser: User) {
        if (!this.currentUserId) return;
        if (confirm(`Sei sicuro di voler smettere di seguire ${targetUser.name}?`)) {
            this.userService.unfollowUser(this.currentUserId, targetUser.id.toString()).subscribe({
                next: () => {
                    this.myFollowingIds.delete(targetUser.id.toString());
                    this.userService.notifyUserUpdate();
                },
                error: (err) => console.error(err)
            });
        }
    }
}
