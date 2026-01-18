import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReportService } from '../../services/report.service';
import { ReportTargetType } from '../../models/report';

@Component({
    selector: 'app-report-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, MatIconModule, MatSnackBarModule],
    templateUrl: './report-modal.component.html',
    styleUrl: './report-modal.component.css'
})
export class ReportModalComponent {
    @Input() reporterId: string | null = null;
    @Input() targetType: ReportTargetType = 'USER';
    @Input() targetId: string | null = null;
    @Input() targetLabel = '';

    @Output() close = new EventEmitter<void>();
    @Output() submitted = new EventEmitter<void>();

    reason = '';
    details = '';
    imageFile: File | null = null;
    imageName = '';
    isSubmitting = false;

    constructor(private reportService: ReportService, private snackBar: MatSnackBar) { }

    onClose() {
        this.close.emit();
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) {
            return;
        }
        const file = input.files[0];
        this.imageFile = file;
        this.imageName = file.name;
    }

    clearImage() {
        this.imageFile = null;
        this.imageName = '';
    }

    submitReport() {
        if (!this.reporterId || !this.targetId) {
            this.showToast('You must be logged in to report.', 'error');
            return;
        }
        if (!this.reason.trim()) {
            this.showToast('Please enter the main reason.', 'error');
            return;
        }

        const payload = new FormData();
        payload.append('reporterId', this.reporterId);
        payload.append('targetType', this.targetType);
        payload.append('targetId', this.targetId);
        payload.append('reason', this.reason.trim());
        if (this.details.trim()) {
            payload.append('details', this.details.trim());
        }
        if (this.imageFile) {
            payload.append('image', this.imageFile, this.imageFile.name);
        }

        this.isSubmitting = true;
        this.reportService.createReport(payload).subscribe({
            next: () => {
                this.showToast('Report submitted.');
                this.isSubmitting = false;
                this.submitted.emit();
                this.onClose();
            },
            error: (err) => {
                console.error('Error submitting report', err);
                this.showToast('Unable to submit the report.', 'error');
                this.isSubmitting = false;
            }
        });
    }

    private showToast(message: string, tone: 'default' | 'error' = 'default') {
        this.snackBar.open(message, undefined, {
            duration: 2500,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: tone === 'error' ? ['toast-snackbar', 'toast-snackbar--error'] : ['toast-snackbar']
        });
    }
}
