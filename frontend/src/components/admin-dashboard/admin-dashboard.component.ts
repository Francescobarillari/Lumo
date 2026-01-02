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
    allEvents: any[] = []; // Store all events here
    recentRequests: any[] = [];
    totalUsers: number = 0;
    totalEvents: number = 0;
    pendingEventsCount: number = 0;

    currentView: 'dashboard' | 'events' | 'users' = 'dashboard';

    searchTermEvents: string = '';
    searchTermUsers: string = '';

    expandedEventId: number | null = null;

    constructor(private router: Router, private adminService: AdminService) { }

    ngOnInit() {
        this.loadData();
    }

    setView(view: 'dashboard' | 'events' | 'users') {
        this.currentView = view;
    }

    get filteredEvents() {
        if (!this.searchTermEvents.trim()) {
            return this.allEvents;
        }
        const term = this.searchTermEvents.toLowerCase();
        return this.allEvents.filter(ev =>
            ev.title?.toLowerCase().includes(term) ||
            ev.city?.toLowerCase().includes(term) ||
            ev.organizerName?.toLowerCase().includes(term)
        );
    }

    get filteredUsers() {
        if (!this.searchTermUsers.trim()) {
            return this.users;
        }
        const term = this.searchTermUsers.toLowerCase();
        return this.users.filter(u =>
            u.name?.toLowerCase().includes(term) ||
            u.email?.toLowerCase().includes(term)
        );
    }

    loadData() {
        // Load Users
        this.adminService.getUsers().subscribe(data => {
            this.users = data;
            this.calculateStats();
        });

        // Load All Events
        this.adminService.getAllEvents().subscribe(events => {
            this.allEvents = events;
            this.calculateStats();
        });
    }

    calculateStats() {
        this.totalUsers = this.users.length;
        if (this.allEvents) {
            this.totalEvents = this.allEvents.length;
            // Recalculate pending from allEvents if possible, or stick to user-based if accurate
            // Ideally allEvents contains everything. Let's filter pending from allEvents for accuracy
            // Assuming 'isApproved' is boolean.
            const pending = this.allEvents.filter(e => e.isApproved === false);
            this.pendingEventsCount = pending.length;

            // Re-map recentRequests from allEvents pending list to have consistency
            // We need organizer info. Event object has organizerName/Image or creator relation?
            // Backend sends 'creator' or 'organizerName'.
            this.recentRequests = pending.map(e => ({
                ...e,
                organizer: e.organizerName || 'Unknown',
                organizerImg: e.organizerImage
            }));
        }
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
