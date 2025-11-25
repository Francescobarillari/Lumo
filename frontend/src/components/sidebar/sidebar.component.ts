import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { EventCardComponent } from '../event-card/event-card.component';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [MatIconModule, EventCardComponent],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
    events = [
        { title: 'Title', location: 'Location', dateTime: 'Day / time' },
        { title: 'Title', location: 'Location', dateTime: 'Day / time' },
        { title: 'Title', location: 'Location', dateTime: 'Day / time' },
        { title: 'Title', location: 'Location', dateTime: 'Day / time' },
        { title: 'Title', location: 'Location', dateTime: 'Day / time' },
        { title: 'Title', location: 'Location', dateTime: 'Day / time' },
        { title: 'Title', location: 'Location', dateTime: 'Day / time' },
        { title: 'Title', location: 'Location', dateTime: 'Day / time' }
    ];
}
