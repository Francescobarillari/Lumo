import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'UserMenu',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './user-menu.html',
    styleUrl: './user-menu.css'
})
export class UserMenu {
    @Output() close = new EventEmitter<void>();
    @Output() action = new EventEmitter<string>();

    onAction(actionName: string) {
        this.action.emit(actionName);
        this.close.emit();
    }
}
