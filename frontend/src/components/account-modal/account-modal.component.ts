import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../../services/user-service/user-service';
import { ConfirmationService } from '../../services/confirmation.service';
import { CircleIcon } from '../circle-icon/circle-icon';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

import * as QRCode from 'qrcode';

@Component({
    selector: 'app-account-modal',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatSnackBarModule, FormsModule],
    templateUrl: './account-modal.html',
    styleUrl: './account-modal.css'
})
export class AccountModalComponent {
    private _user: { id: string; name: string; email: string; description?: string; profileImage?: string; followersCount?: number; followingCount?: number } | null = null;
    qrCodeUrl: string = '';

    @Input()
    set user(value: { id: string; name: string; email: string; description?: string; profileImage?: string; followersCount?: number; followingCount?: number } | null) {
        this._user = value;
        this.generateQrCode();
    }
    get user() {
        return this._user;
    }

    @Output() close = new EventEmitter<void>();
    @Output() changePhoto = new EventEmitter<void>();
    @Output() openProfile = new EventEmitter<string>();

    view: 'profile' | 'followers' | 'following' | 'edit-profile' = 'profile';
    userList: any[] = [];
    followingIds: Set<string> = new Set();
    loadingList = false;

    editData = { name: '', email: '', description: '' };
    passwordData = { old: '', new: '', confirm: '' };

    constructor(
        private userService: UserService,
        private confirmation: ConfirmationService,
        private snackBar: MatSnackBar
    ) { }

    onClose() {
        this.view = 'profile';
        this.close.emit();
    }

    onBack() {
        if (this.view !== 'profile') {
            this.view = 'profile';
        }
    }

    onBackOrClose() {
        if (this.view !== 'profile') {
            this.onBack();
            return;
        }
        this.onClose();
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

    async onUnfollow(userToUnfollow: any) {
        if (!this.user) return;
        const confirmed = await this.confirmation.confirm({
            title: 'Unfollow user',
            message: `Are you sure you want to unfollow ${userToUnfollow.name}?`,
            confirmText: 'Unfollow',
            cancelText: 'Cancel',
            confirmClass: 'white-text'
        });
        if (!confirmed) return;

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
                this.showToast('Profile updated successfully');
                this.userService.notifyUserUpdate();
            },
            error: (err) => {
                console.error(err);
                this.showToast('Failed to update profile', 'error');
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

    generateQrCode() {
        if (!this.user) {
            this.qrCodeUrl = '';
            return;
        }
        const link = this.getShareLink();
        QRCode.toDataURL(link, { width: 200, margin: 1, color: { dark: '#000000', light: '#ffffff' } })
            .then(url => {
                this.qrCodeUrl = url;
            })
            .catch(err => {
                console.error('QR Code generation failed', err);
                this.qrCodeUrl = '';
            });
    }

    getQrCodeUrl(): string {
        return this.qrCodeUrl;
    }

    copyShareLink() {
        const link = this.getShareLink();
        navigator.clipboard.writeText(link).then(() => {
            this.showToast('Link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            this.showToast('Unable to copy the link.', 'error');
        });
    }

    onChangePassword() {
        if (!this.user) return;
        if (this.passwordData.new !== this.passwordData.confirm) {
            this.showToast('New passwords do not match', 'error');
            return;
        }
        if (!this.passwordData.old || !this.passwordData.new) {
            this.showToast('Please fill in default fields', 'error');
            return;
        }

        this.userService.changePassword(this.user.id, this.passwordData.old, this.passwordData.new).subscribe({
            next: () => {
                this.showToast('Password changed successfully');
                this.passwordData = { old: '', new: '', confirm: '' };
            },
            error: (err) => {
                console.error(err);
                this.showToast('Failed to change password. Existing password may be incorrect.', 'error');
            }
        });
    }

    private showToast(message: string, tone: 'default' | 'error' = 'default') {
        this.snackBar.open(message, undefined, {
            duration: tone === 'error' ? 700 : 700,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: tone === 'error' ? ['toast-snackbar', 'toast-snackbar--error'] : ['toast-snackbar']
        });
    }
}
