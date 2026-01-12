import { Component, EventEmitter, Input, Output, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user-service/user-service';

@Component({
    selector: 'app-event-card',
    standalone: true,
    imports: [CommonModule, MatIconModule], // Add CommonModule
    templateUrl: './event-card.component.html',
    styleUrl: './event-card.component.css'
})
export class EventCardComponent implements OnInit {
    title = input.required<string>();
    location = input.required<string>();
    dateTime = input.required<string>();
    distance = input<string>();
    id = input.required<number>();
    isSaved = input<boolean>(false);
    isParticipating = input<boolean>(false);
    showDistance = input<boolean>(true);
    showActions = input<boolean>(true);
    showShare = input<boolean>(false);
    showOrganizerInfo = input<boolean>(true);

    // Organizer Info
    organizerName = input<string>();
    organizerImage = input<string>();
    creatorId = input<number>();

    // Spots Info
    occupiedSpots = input<number>();
    maxParticipants = input<number>();

    // User Context
    currentUserId = input<string | null>(null);

    isFollowing = false;

    @Output() focusLocation = new EventEmitter<void>();
    @Output() toggleFavorite = new EventEmitter<void>();
    @Output() openOrganizerProfile = new EventEmitter<void>();
    @Output() shareEvent = new EventEmitter<void>();

    constructor(private userService: UserService) { }

    ngOnInit() {
        this.checkIfFollowing();
    }

    checkIfFollowing() {
        // Logic to check if already following ?
        // Ideally we should pass 'isFollowing' as input, or check logic here.
        // For now let's assume we might need to fetch it or pass it.
        // Let's rely on basic initial state false, or maybe fetch it?
        // Optimally, backend Event should return "isOrganizerFollowed".
    }

    followOrganizer(event: Event) {
        event.stopPropagation();
        if (!this.currentUserId() || !this.creatorId()) return;

        this.userService.followUser(this.currentUserId()!, this.creatorId()!.toString()).subscribe({
            next: () => {
                this.isFollowing = true;
            },
            error: (err) => console.error('Error following', err)
        });
    }

    unfollowOrganizer(event: Event) {
        event.stopPropagation();
        if (!this.currentUserId() || !this.creatorId()) return;

        this.userService.unfollowUser(this.currentUserId()!, this.creatorId()!.toString()).subscribe({
            next: () => {
                this.isFollowing = false;
            },
            error: (err) => console.error('Error unfollowing', err)
        });
    }
}
