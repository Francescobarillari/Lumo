import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { EventCardComponent } from '../event-card/event-card.component';
import { Event } from '../../models/event';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, MatIconModule, EventCardComponent],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
    @Input() events: Event[] = [];
    @Output() focusEvent = new EventEmitter<Event>();
    @Input() collapsed = false;
    @Output() toggleSidebar = new EventEmitter<void>();

    formatDateTime(event: Event): string {
        const date = event.date ? new Date(`${event.date}T00:00:00`) : null;
        const start = event.startTime ? event.startTime.slice(0, 5) : '';
        const end = event.endTime ? event.endTime.slice(0, 5) : '';

        const datePart = date
            ? date.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })
            : '';
        const timePart = start && end ? `${start} - ${end}` : start || end;

        return [datePart, timePart].filter(Boolean).join(' | ');
    }

    formatDistance(distanceKm?: number): string {
        if (distanceKm == null) return '';
        if (distanceKm < 1) return `${(distanceKm * 1000).toFixed(0)} m`;
        return `${distanceKm.toFixed(1)} km`;
    }

    goToEvent(event: Event) {
        this.focusEvent.emit(event);
    }

    toggle() {
        this.toggleSidebar.emit();
    }
}
