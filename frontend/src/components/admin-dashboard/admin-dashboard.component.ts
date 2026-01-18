import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { Subscription, interval } from 'rxjs';
import { ConfirmationService } from '../../services/confirmation.service';
import { ReportItem } from '../../models/report';
import { censorEmail } from '../../utils/utils';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatSnackBarModule, FormsModule],
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
    users: any[] = [];
    allEvents: any[] = [];
    recentRequests: any[] = [];
    totalUsers: number = 0;
    totalEvents: number = 0;
    pendingEventsCount: number = 0;

    currentView: 'dashboard' | 'events' | 'users' | 'reports' = 'dashboard';

    reports: ReportItem[] = [];
    selectedReport: ReportItem | null = null;
    loadingReports = false;
    showAllReports = false;
    reportsPreviewLimit = 6;

    searchTermEvents: string = '';
    searchTermUsers: string = '';

    expandedEventId: number | null = null;
    private pollSubscription: Subscription | null = null;

    constructor(
        private router: Router,
        private adminService: AdminService,
        private confirmation: ConfirmationService,
        private snackBar: MatSnackBar
    ) { }

    censorEmail = censorEmail;

    ngOnInit() {
        this.loadData();
        this.startPolling();
    }

    ngOnDestroy() {
        this.stopPolling();
    }

    startPolling() {
        this.pollSubscription = interval(5000).subscribe(() => {
            this.loadData();
        });
    }

    stopPolling() {
        if (this.pollSubscription) {
            this.pollSubscription.unsubscribe();
            this.pollSubscription = null;
        }
    }

    setView(view: 'dashboard' | 'events' | 'users' | 'reports') {
        this.currentView = view;
        this.expandedEventId = null;
        if (view === 'reports') {
            this.showAllReports = false;
            this.loadReports();
        }
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
        this.adminService.getUsers().subscribe(data => {
            this.users = data;
            this.calculateStats();
        });

        this.adminService.getAllEvents().subscribe(events => {
            this.allEvents = events;
            this.calculateStats();
        });

        this.loadReports();
    }

    calculateStats() {
        this.totalUsers = this.users.length;
        if (this.allEvents) {
            this.totalEvents = this.allEvents.length;
            const pending = this.allEvents.filter(e => e.isApproved === false);
            this.pendingEventsCount = pending.length;

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

    eventsCurrentlyRejecting: number[] = [];

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
                this.showToast('Error while rejecting the event.', 'error');
            }
        });
    }

    async deleteEvent(event: any) {
        const confirmed = await this.confirmation.confirm({
            title: 'Delete event',
            message: `Are you sure you want to permanently delete the event "${event.title}"? This action will remove the event from the map and all user lists. It cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            tone: 'danger'
        });
        if (!confirmed) return;

        this.adminService.deleteEvent(event.id).subscribe({
            next: () => {
                this.loadData();
            },
            error: (err) => {
                console.error('Error deleting event', err);
                this.showToast('Error deleting the event.', 'error');
            }
        });
    }

    loadReports() {
        if (this.loadingReports) return;
        this.loadingReports = true;
        this.adminService.getReports().subscribe({
            next: (reports) => {
                this.reports = reports;
                if (this.selectedReport) {
                    const updated = reports.find(r => r.id === this.selectedReport?.id) || null;
                    this.selectedReport = updated;
                }
                this.loadingReports = false;
            },
            error: (err) => {
                console.error('Error loading reports', err);
                this.loadingReports = false;
            }
        });
    }

    get visibleReports() {
        return this.showAllReports ? this.reports : this.reports.slice(0, this.reportsPreviewLimit);
    }

    get hasMoreReports() {
        return this.reports.length > this.reportsPreviewLimit;
    }

    get reportTypeCounts() {
        const counts = { USER: 0, EVENT: 0, OTHER: 0 };
        for (const report of this.reports) {
            if (report.targetType === 'USER') {
                counts.USER += 1;
            } else if (report.targetType === 'EVENT') {
                counts.EVENT += 1;
            } else {
                counts.OTHER += 1;
            }
        }
        return counts;
    }

    toggleReportsExpanded() {
        this.showAllReports = !this.showAllReports;
    }

    selectReport(report: ReportItem) {
        this.selectedReport = report;
    }

    signOut() {
        localStorage.removeItem('user');
        this.router.navigate(['/']);
    }

    private showToast(message: string, tone: 'default' | 'error' = 'default') {
        this.snackBar.open(message, undefined, {
            duration: tone === 'error' ? 1600 : 1000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: tone === 'error' ? ['toast-snackbar', 'toast-snackbar--error'] : ['toast-snackbar']
        });
    }
}
