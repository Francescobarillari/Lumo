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
    expandedEventId: number | null = null;

    constructor(private router: Router, private adminService: AdminService) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.adminService.getUsers().subscribe(data => {
            this.users = data.sort((a, b) => {
                const pendingA = a.pendingEvents ? a.pendingEvents.length : 0;
                const pendingB = b.pendingEvents ? b.pendingEvents.length : 0;
                return pendingB - pendingA; // Descending order
            });
        });
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
