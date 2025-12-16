import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, MatIconModule],
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
            this.users = data;
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

    rejectEvent(event: any) {
        if (confirm('Sei sicuro di voler rifiutare (ed eliminare) questo evento?')) {
            this.adminService.rejectEvent(event.id).subscribe(() => {
                this.loadData();
            });
        }
    }

    signOut() {
        localStorage.removeItem('user');
        this.router.navigate(['/']);
    }
}
