import { Component, EventEmitter, Input, Output, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-event-card',
    standalone: true,
    imports: [MatIconModule],
    templateUrl: './event-card.component.html',
    styleUrl: './event-card.component.css'
})
export class EventCardComponent {
    title = input.required<string>();
    location = input.required<string>();
    dateTime = input.required<string>();
    distance = input<string>();
    id = input.required<number>();
    isSaved = input<boolean>(false);

    @Output() focusLocation = new EventEmitter<void>();
    @Output() toggleFavorite = new EventEmitter<void>();
}
