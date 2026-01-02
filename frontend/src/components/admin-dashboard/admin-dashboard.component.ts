import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, MatIconModule, FormsModule],
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
    users: any[] = [];
    recentRequests: any[] = [];
    totalUsers: number = 0;
    totalEvents: number = 0;
    pendingEventsCount: number = 0;

    expandedEventId: number | null = null;

    constructor(private router: Router, private adminService: AdminService) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.adminService.getUsers().subscribe(data => {
            this.users = data;
            this.calculateStats();
        });
    }

    calculateStats() {
        this.totalUsers = this.users.length;
        this.recentRequests = [];
        this.totalEvents = 0;

        this.users.forEach(user => {
            // Assuming user has 'events' or we count pending + approved if available.
            // Based on current code, we only see 'pendingEvents'.
            // If the API only returns users with pending events, this might be partial.
            // But relying on what we have:
            if (user.pendingEvents) {
                user.pendingEvents.forEach((ev: any) => {
                    this.recentRequests.push({
                        ...ev,
                        organizer: user.name,
                        organizerImg: user.profileImage
                    });
                });
            }
            // If we had a total events count per user, we'd add it here.
            // For now, let's assume filtering logic or extend later.
            // Let's count pending as part of total for now or just pending.
            // Placeholder for total events if not available
        });

        // sort recent requests by date if possible, or just take them all
        this.pendingEventsCount = this.recentRequests.length;
        // Approximation for total events if we don't have full history:
        this.totalEvents = this.pendingEventsCount + (this.totalUsers * 2); // FAKE DATA for "Total Events" to match design vibes if real data missing, OR better:
        // Actually, let's just use pending count for now, or if users have an 'events' array:
        // Let's assume the user object might have more info or we just sum pending.
        // For the design "11 Total Events", I'll just use a placeholder text or sum pending if that's all I have.
        // Let's try to be as real as possible.

        this.totalEvents = this.users.reduce((acc, curr) => acc + (curr.events?.length || 0) + (curr.pendingEvents?.length || 0), 0);
    }

    toggleDetails(id: number) {
        if (this.expandedEventId === id) {
            this.expandedEventId = null;
        } else {
            this.expandedEventId = id;
        }
    }

    approveEvent(event: any) {
        this.adminService.approveEvent(event.id).subscribe(() => {
            this.loadData();
        });
    }

    eventsCurrentlyRejecting: number[] = []; // Track IDs of events being rejected

    rejectEvent(event: any) {
        if (!this.eventsCurrentlyRejecting.includes(event.id)) {
            this.eventsCurrentlyRejecting.push(event.id);
        }
    }

    cancelReject(eventId: number) {
        this.eventsCurrentlyRejecting = this.eventsCurrentlyRejecting.filter(id => id !== eventId);
    }

    confirmReject(event: any, reason: string) {
        console.log('Confirming reject for event:', event.id, 'Reason:', reason);
        this.adminService.rejectEvent(event.id, reason).subscribe({
            next: () => {
                console.log('Rejection successful');
                this.cancelReject(event.id);
                this.loadData();
            },
            error: (err) => {
                console.error('Rejection failed:', err);
                alert('Errore durante il rifiuto dell\'evento.');
            }
        });
    }

    signOut() {
        localStorage.removeItem('user');
        this.router.navigate(['/']);
    }
}
