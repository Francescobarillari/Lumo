import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../../services/user-service/user-service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-account-modal',
    standalone: true,
    imports: [CommonModule, MatIconModule, FormsModule],
    templateUrl: './account-modal.html',
    styleUrl: './account-modal.css'
})
export class AccountModalComponent {
    @Input() user: { id: string; name: string; email: string; description?: string; profileImage?: string; followersCount?: number; followingCount?: number } | null = null;
    @Output() close = new EventEmitter<void>();
    @Output() changePhoto = new EventEmitter<void>();
    @Output() openProfile = new EventEmitter<string>();

    view: 'profile' | 'followers' | 'following' | 'edit-profile' = 'profile';
    userList: any[] = [];
    followingIds: Set<string> = new Set();
    loadingList = false;

    editData = { name: '', email: '', description: '' };
    passwordData = { old: '', new: '', confirm: '' };

    constructor(private userService: UserService) { }

    onClose() {
        if (this.view !== 'profile') {
            this.view = 'profile';
        } else {
            this.close.emit();
        }
    }

    getViewTitle(): string {
        switch (this.view) {
            case 'edit-profile': return 'Edit Profile';
            case 'followers': return 'Followers';
            case 'following': return 'Following';
            default: return 'Account';
        }
    }

    onChangePhoto() {
        this.changePhoto.emit();
    }

    getInitials(name: string): string {
        if (!name) return '';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }

    getDiscreteEmail(email: string | undefined): string {
        if (!email) return '';
        if (email.length <= 25) return email;
        const parts = email.split('@');
        if (parts.length !== 2) return email; // Fallback for weird formats
        const [user, domain] = parts;
        return `...${user.slice(-3)}@${domain}`;
    }

    showFollowers() {
        if (!this.user) return;
        const userId = this.user.id;
        this.view = 'followers';
        this.loadingList = true;

        // Fetch followers AND following to know relationship
        this.userService.getFollowers(userId).subscribe({
            next: (followers) => {
                this.userList = followers;

                // Fetch following to check who we already follow
                this.userService.getFollowing(userId).subscribe({
                    next: (following) => {
                        this.followingIds = new Set(following.map((u: any) => u.id.toString()));
                        this.loadingList = false;
                    },
                    error: (err) => {
                        console.error('Error fetching following list', err);
                        this.loadingList = false;
                    }
                });
            },
            error: (err) => {
                console.error(err);
                this.loadingList = false;
            }
        });
    }

    showFollowing() {
        if (!this.user) return;
        this.view = 'following';
        this.loadingList = true;
        this.userService.getFollowing(this.user.id).subscribe({
            next: (users) => {
                this.userList = users;
                this.loadingList = false;
            },
            error: (err) => {
                console.error(err);
                this.loadingList = false;
            }
        });
    }

    onFollow(userToFollow: any) {
        if (!this.user) return;
        this.userService.followUser(this.user.id, userToFollow.id).subscribe({
            next: () => {
                this.followingIds.add(userToFollow.id.toString());
                if (this.user) {
                    this.user.followingCount = (this.user.followingCount || 0) + 1;
                }
                this.userService.notifyUserUpdate();
            },
            error: (err) => console.error(err)
        });
    }

    onUnfollow(userToUnfollow: any) {
        if (!this.user) return;
        if (confirm(`Are you sure you want to unfollow ${userToUnfollow.name}?`)) {
            this.userService.unfollowUser(this.user.id, userToUnfollow.id).subscribe({
                next: () => {
                    // If in "following" view, remove from list
                    if (this.view === 'following') {
                        this.userList = this.userList.filter(u => u.id !== userToUnfollow.id);
                    } else {
                        // If in "followers" view (and unfollowing someone who follows me), just update state
                        this.followingIds.delete(userToUnfollow.id.toString());
                    }

                    // Update local count optimistically
                    if (this.user) {
                        this.user.followingCount = (this.user.followingCount || 1) - 1;
                    }
                    this.userService.notifyUserUpdate();
                },
                error: (err) => console.error(err)
            });
        }
    }

    openProfileFromList(userToOpen: any) {
        if (!userToOpen?.id) return;
        this.view = 'profile';
        this.openProfile.emit(userToOpen.id.toString());
    }

    showEditProfile() {
        if (!this.user) return;
        this.view = 'edit-profile';
        this.editData = {
            name: this.user.name,
            email: this.user.email,
            description: this.user.description || ''
        };
        this.passwordData = { old: '', new: '', confirm: '' };
    }

    onSaveProfile() {
        if (!this.user) return;
        this.userService.updateUser(this.user.id, this.editData).subscribe({
            next: (updatedUser) => {
                // Update local data
                if (this.user) {
                    this.user.name = updatedUser.name;
                    this.user.email = updatedUser.email;
                    this.user.description = updatedUser.description;
                }
                alert('Profile updated successfully');
                this.userService.notifyUserUpdate();
            },
            error: (err) => {
                console.error(err);
                alert('Failed to update profile');
            }
        });
    }

    getShareLink(): string {
        if (!this.user) return '';
        // Assuming the app is hosted at root or we construct the full URL
        const protocol = window.location.protocol;
        const host = window.location.host;
        return `${protocol}//${host}/?user=${this.user.id}`;
    }

    getQrCodeUrl(): string {
        if (!this.user) return '';
        const link = this.getShareLink();
        // Using QR Server API
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}`;
    }

    copyShareLink() {
        const link = this.getShareLink();
        navigator.clipboard.writeText(link).then(() => {
            alert('Link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }

    onChangePassword() {
        if (!this.user) return;
        if (this.passwordData.new !== this.passwordData.confirm) {
            alert('New passwords do not match');
            return;
        }
        if (!this.passwordData.old || !this.passwordData.new) {
            alert('Please fill in default fields');
            return;
        }

        this.userService.changePassword(this.user.id, this.passwordData.old, this.passwordData.new).subscribe({
            next: () => {
                alert('Password changed successfully');
                this.passwordData = { old: '', new: '', confirm: '' };
            },
            error: (err) => {
                console.error(err);
                alert('Failed to change password. existing password may be incorrect.');
            }
        });
    }
}
