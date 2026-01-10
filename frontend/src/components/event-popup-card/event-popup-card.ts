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
    @Output() openOrganizerProfile = new EventEmitter<string>();
    @Output() leave = new EventEmitter<Event>();
    @Output() deleteEvent = new EventEmitter<Event>();

    isFollowing = false;
    isLoadingFollowStatus = true; // Add loading state to prevent flicker
    notificationsEnabled = false;
    notificationsLoading = false;

    constructor(private elementRef: ElementRef, private userService: UserService) { }

    ngAfterViewInit(): void {
        this.positionCard();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['eventPosition']) {
            this.positionCard();
        }
        if (changes['event'] || changes['currentUserId'] || changes['creatorId']) {
            this.checkIfFollowing();
        }
    }

    checkIfFollowing() {
        // Use input creatorId or fallback to event.creatorId
        const targetCreatorId = this.creatorId || (this.event ? this.event.creatorId : null);

        if (!this.currentUserId || !targetCreatorId || this.currentUserId === targetCreatorId.toString()) {
            this.isFollowing = false;
            this.isLoadingFollowStatus = false;
            this.notificationsEnabled = false;
            return;
        }

        this.isLoadingFollowStatus = true; // Start loading
        this.userService.isFollowing(this.currentUserId, targetCreatorId.toString()).subscribe({
            next: (res) => {
                this.isFollowing = res.isFollowing;
                this.isLoadingFollowStatus = false; // Stop loading
                if (this.isFollowing) {
                    this.loadNotificationPreference(targetCreatorId.toString());
                } else {
                    this.notificationsEnabled = false;
                }
            },
            error: (err) => {
                console.error('Error checking follow status', err);
                this.isLoadingFollowStatus = false; // Stop loading on error
                this.notificationsEnabled = false;
            }
        });
    }

    @HostListener('click', ['$event'])
    onClick(event: MouseEvent) {
        event.stopPropagation();
    }

    @HostListener('window:resize')
    onResize() {
        this.positionCard();
    }

    private positionCard() {
        if (!this.eventPosition) return;

        const cardContainer = this.elementRef.nativeElement.querySelector('.card-container') as HTMLElement;
        if (cardContainer) {
            const sidebar = document.querySelector('.sidebar-container') as HTMLElement | null;
            const sidebarRect = sidebar?.getBoundingClientRect();
            const sidebarRight = sidebarRect && !sidebar?.classList.contains('collapsed')
                ? sidebarRect.right
                : 0;

            const baseMargin = 12;
            const leftSafeMargin = sidebarRight > 0 ? sidebarRight + baseMargin : baseMargin;
            const margin = baseMargin;
            const isMobile = window.innerWidth <= 768;
            const topSafeMargin = isMobile ? 100 : margin;
            const width = cardContainer.offsetWidth || 0;
            const height = cardContainer.offsetHeight || 0;
            const viewportW = window.innerWidth;
            const viewportH = window.innerHeight;

            const offsetY = -20; // px above marker
            let x = this.eventPosition.x;
            let y = this.eventPosition.y + offsetY;

            // Adjust horizontally to keep within viewport once translate(-50%) is applied
            const leftAfter = x - width / 2;
            const rightAfter = x + width / 2;
            if (leftAfter < leftSafeMargin) {
                x += leftSafeMargin - leftAfter;
            } else if (rightAfter > viewportW - margin) {
                x -= rightAfter - (viewportW - margin);
            }

            // Adjust vertically to avoid clipping top/bottom (translateY(-100%) pulls it up by its height)
            const topAfter = y - height;
            if (topAfter < topSafeMargin) {
                y += topSafeMargin - topAfter;
            }
            if (y > viewportH - margin) {
                y = viewportH - margin;
            }

            cardContainer.style.left = `${x}px`;
            cardContainer.style.top = `${y}px`;
            cardContainer.style.transform = 'translate(-50%, -100%)';
        }
    }

    onClose() {
        this.close.emit();
    }

    onParticipate() {
        if (this.isOrganizer()) return;
        this.participate.emit(this.event);
    }

    onLeave() {
        this.leave.emit(this.event);
    }

    onDeleteEvent() {
        if (!this.isOrganizer()) return;
        this.deleteEvent.emit(this.event);
    }

    toggleNotifications(event: MouseEvent) {
        event.stopPropagation();
        const targetCreatorId = this.creatorId || (this.event ? this.event.creatorId : null);
        if (!this.currentUserId || !targetCreatorId || !this.isFollowing) return;

        const nextValue = !this.notificationsEnabled;
        this.notificationsLoading = true;
        this.userService.setFollowNotifications(this.currentUserId, targetCreatorId.toString(), nextValue).subscribe({
            next: (res) => {
                this.notificationsEnabled = res.enabled;
                this.notificationsLoading = false;
            },
            error: (err) => {
                console.error('Error updating follow notifications', err);
                this.notificationsLoading = false;
            }
        });
    }

    isOrganizer(): boolean {
        const creatorId = this.creatorId ?? this.event?.creatorId;
        return !!this.currentUserId && !!creatorId && this.currentUserId.toString() === creatorId.toString();
    }

    private getOrganizerId(): string | null {
        const rawId =
            this.creatorId ??
            this.event?.creatorId ??
            // Fallback if backend sent embedded creator object
            (this.event as any)?.creator?.id;
        return rawId !== undefined && rawId !== null ? String(rawId) : null;
    }

    formatHeroDate(): string {
        const date = this.event.date ? new Date(`${this.event.date}T00:00:00`) : null;
        const start = this.event.startTime ? this.event.startTime.slice(0, 5) : null;
        // Use 'en-US' or default browser locale for English
        const weekday = date ? date.toLocaleDateString('en-US', { weekday: 'short' }) : '';
        const dayMonth = date ? date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }) : '';

        const datePart = [weekday, dayMonth].filter(Boolean).join(' ');
        const timePart = start ? start : '';
        return [datePart, timePart].filter(Boolean).join(', ');
    }

    getActualParticipants(): number {
        if (this.event.occupiedSpots !== undefined && this.event.occupiedSpots !== null) {
            return this.event.occupiedSpots;
        }
        return this.event.nPartecipants || 0;
    }

    getSubtitle(): string {
        if (this.event.city) return this.event.city;
        if (this.event.description) return this.event.description;
        return 'Location TBD';
    }

    hasCoordinates(): boolean {
        return !!this.event &&
            Number.isFinite(this.event.latitude) &&
            Number.isFinite(this.event.longitude);
    }

    openInMaps(event?: MouseEvent) {
        event?.stopPropagation();
        if (!this.hasCoordinates()) return;

        const url = `https://www.google.com/maps/search/?api=1&query=${this.event.latitude},${this.event.longitude}`;
        window.open(url, '_blank', 'noopener');
    }

    showDescription(): boolean {
        return !!this.event.description && this.event.description !== this.getSubtitle();
    }

    formatDateTime(): string {
        const date = this.event.date ? new Date(`${this.event.date}T00:00:00`) : null;
        const start = this.event.startTime ? this.event.startTime.slice(0, 5) : null;
        const end = this.event.endTime ? this.event.endTime.slice(0, 5) : null;

        const datePart = date
            ? date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })
            : '';
        const timePart = end ? `${start} — ${end}` : start;

        return [datePart, timePart].filter(Boolean).join(' / ');
    }

    formatCost(): string {
        if (this.event.costPerPerson !== undefined && this.event.costPerPerson !== null) {
            return `${this.event.costPerPerson} per person`;
        }
        return 'Free';
    }

    getInitials(name: string): string {
        if (!name) return 'OR';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }

    isSaved(): boolean | undefined {
        return this.event.isSaved;
    }

    followOrganizer() {
        const targetCreatorId = this.creatorId || (this.event ? this.event.creatorId : null);
        if (!this.currentUserId || !targetCreatorId) return;

        this.userService.followUser(this.currentUserId, targetCreatorId.toString()).subscribe({
            next: () => {
                this.isFollowing = true;
                this.notificationsEnabled = true;
                this.userService.notifyUserUpdate();
            },
            error: (err) => console.error('Error following', err)
        });
    }

    unfollowOrganizer() {
        const targetCreatorId = this.creatorId || (this.event ? this.event.creatorId : null);
        if (!this.currentUserId || !targetCreatorId) return;

        this.userService.unfollowUser(this.currentUserId, targetCreatorId.toString()).subscribe({
            next: () => {
                this.isFollowing = false;
                this.notificationsEnabled = false;
                this.userService.notifyUserUpdate();
            },
            error: (err) => console.error('Error unfollowing', err)
        });
    }

    onOrganizerClick() {
        const organizerId = this.getOrganizerId();
        if (!organizerId) {
            console.log('[EventPopupCard] organizer click with missing id', {
                creatorIdInput: this.creatorId,
                eventCreatorId: this.event?.creatorId,
                event: this.event
            });
            return;
        }
        console.log('[EventPopupCard] open organizer', {
            organizerId,
            creatorIdInput: this.creatorId,
            eventCreatorId: this.event?.creatorId,
            event: this.event
        });
        this.openOrganizerProfile.emit(organizerId);
    }

    private loadNotificationPreference(targetCreatorId: string) {
        if (!this.currentUserId) return;
        this.notificationsLoading = true;
        this.userService.getFollowNotifications(this.currentUserId, targetCreatorId).subscribe({
            next: (res) => {
                this.notificationsEnabled = !!res.enabled;
                this.notificationsLoading = false;
            },
            error: (err) => {
                console.error('Error fetching follow notifications preference', err);
                this.notificationsEnabled = false;
                this.notificationsLoading = false;
            }
        });
    }
}
