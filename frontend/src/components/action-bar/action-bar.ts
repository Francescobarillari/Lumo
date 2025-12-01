import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMenu } from '../user-menu/user-menu';

@Component({
    selector: 'app-action-bar',
    standalone: true,
    imports: [CommonModule, UserMenu],
    templateUrl: './action-bar.html',
    styleUrl: './action-bar.css'
})
export class ActionBarComponent {
    @Input() loggedUser: { id: string; name: string; email: string; profileImage?: string } | null = null;
    @Output() action = new EventEmitter<string>();

    showUserMenu = false;

    toggleUserMenu() {
        this.showUserMenu = !this.showUserMenu;
    }

    onMenuAction(actionName: string) {
        this.action.emit(actionName);
        if (actionName === 'logout' || actionName === 'account' || actionName === 'events') {
            this.showUserMenu = false;
        }
        // For 'change-photo', we might want to keep it open or close it depending on UX. 
        // Usually clicking an action closes the menu.
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
