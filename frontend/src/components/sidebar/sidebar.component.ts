import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { EventCardComponent } from '../event-card/event-card.component';
import { Event } from '../../models/event';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [MatIconModule, EventCardComponent],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
    @Input() events: Event[] = [];
    @Output() focusEvent = new EventEmitter<Event>();

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

    goToEvent(event: Event) {
        this.focusEvent.emit(event);
    }
}
