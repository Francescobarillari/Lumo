import { Component, input } from '@angular/core';
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
}
