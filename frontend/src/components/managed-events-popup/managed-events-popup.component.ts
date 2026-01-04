import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Event } from '../../models/event';
import { EventCardComponent } from '../event-card/event-card.component';

@Component({
    selector: 'app-managed-events-popup',
    standalone: true,
    imports: [CommonModule, MatIconModule, EventCardComponent],
    templateUrl: './managed-events-popup.html',
    styleUrl: './managed-events-popup.css'
})
export class ManagedEventsPopup {
    @Input() title: string = '';
    @Input() events: Event[] = [];
    @Input() userId: string | null = null;
    @Output() close = new EventEmitter<void>();
    @Output() focusEvent = new EventEmitter<Event>();
    @Output() toggleFavorite = new EventEmitter<Event>();

    onClose() {
        this.close.emit();
    }

    onFocusEvent(event: Event) {
        this.focusEvent.emit(event);
        this.onClose();
    }

    formatDateTime(event: Event): string {
        const date = event.date ? new Date(`${event.date}T00:00:00`) : null;
        const start = event.startTime ? event.startTime.slice(0, 5) : '';
        const end = event.endTime ? event.endTime.slice(0, 5) : '';
        const datePart = date ? date.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }) : '';
        const timePart = start && end ? `${start} - ${end}` : start || end;
        return [datePart, timePart].filter(Boolean).join(' | ');
    }

    formatDistance(distanceKm?: number): string {
        if (distanceKm == null) return '';
        if (distanceKm < 1) return `${(distanceKm * 1000).toFixed(0)} m`;
        return `${distanceKm.toFixed(1)} km`;
    }
}
