import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-account-modal',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './account-modal.html',
    styleUrl: './account-modal.css'
})
export class AccountModalComponent {
    @Input() user: { id: string; name: string; email: string; profileImage?: string; followersCount?: number; followingCount?: number } | null = null;
    @Output() close = new EventEmitter<void>();
    @Output() changePhoto = new EventEmitter<void>();

    onClose() {
        this.close.emit();
    }

    onChangePhoto() {
        this.changePhoto.emit();
    }

    getInitials(name: string): string {
        if (!name) return '';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
}
