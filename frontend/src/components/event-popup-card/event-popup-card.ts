import { Component, Input, Output, EventEmitter, AfterViewInit, OnChanges, SimpleChanges, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from '../../models/event';

import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user-service/user-service';

@Component({
    selector: 'event-popup-card',
    standalone: true,
    imports: [CommonModule, MatIconModule],
    templateUrl: './event-popup-card.html',
    styleUrl: './event-popup-card.css'
})
export class EventPopupCard implements AfterViewInit, OnChanges {
    @Input() event!: Event;
    @Input() organizerName: string = 'Event Organizer';
    @Input() organizerImage?: string;
    @Input() eventPosition?: { x: number, y: number }; // Screen coordinates for positioning
    @Input() currentUserId: string | null = null;
    @Input() creatorId?: number;

    @Output() close = new EventEmitter<void>();
    @Output() participate = new EventEmitter<Event>();
    @Output() toggleFavorite = new EventEmitter<void>();

    isFollowing = false;

    constructor(private elementRef: ElementRef, private userService: UserService) { }

    ngAfterViewInit(): void {
        this.positionCard();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['eventPosition']) {
            this.positionCard();
        }
    }

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent) {
        event.stopPropagation();
    }

    private positionCard() {
        if (!this.eventPosition) return;

        const cardContainer = this.elementRef.nativeElement.querySelector('.card-container') as HTMLElement;
        if (cardContainer) {
            // Position card above marker with offset
            const offsetY = -20; // px above marker
            cardContainer.style.left = `${this.eventPosition.x}px`;
            cardContainer.style.top = `${this.eventPosition.y + offsetY}px`;
            cardContainer.style.transform = 'translate(-50%, -100%)'; // Center horizontally, position above
        }
    }

    onClose() {
        this.close.emit();
    }

    onParticipate() {
        this.participate.emit(this.event);
    }

    formatDateTime(): string {
        const date = this.event.date ? new Date(`${this.event.date}T00:00:00`) : null;
        const start = this.event.startTime ? this.event.startTime.slice(0, 5) : null;
        const end = this.event.endTime ? this.event.endTime.slice(0, 5) : null;

        const datePart = date
            ? date.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })
            : '';
        const timePart = end ? `${start} — ${end}` : start;

        return [datePart, timePart].filter(Boolean).join(' / ');
    }

    formatCost(): string {
        if (this.event.costPerPerson !== undefined && this.event.costPerPerson !== null) {
            return `€${this.event.costPerPerson} per persona`;
        }
        return 'Gratuito';
    }

    getInitials(name: string): string {
        if (!name) return 'OR';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }

    isSaved(): boolean | undefined {
        return this.event.isSaved;
    }

    followOrganizer() {
        if (!this.currentUserId || !this.creatorId) return;

        this.userService.followUser(this.currentUserId, this.creatorId.toString()).subscribe({
            next: () => {
                this.isFollowing = true;
            },
            error: (err) => console.error('Error following', err)
        });
    }

    unfollowOrganizer() {
        if (!this.currentUserId || !this.creatorId) return;

        this.userService.unfollowUser(this.currentUserId, this.creatorId.toString()).subscribe({
            next: () => {
                this.isFollowing = false;
            },
            error: (err) => console.error('Error unfollowing', err)
        });
    }
}
