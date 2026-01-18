import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormField } from '../form-field/form-field';
import { HttpClient } from '@angular/common/http';

import { MatIconModule } from '@angular/material/icon';
import { MapboxService } from '../../services/mapbox.service';

@Component({
    selector: 'create-event-popup',
    standalone: true,
    imports: [CommonModule, FormField, ReactiveFormsModule, MatIconModule],
    templateUrl: './create-event-popup.html',
    styleUrl: './create-event-popup.css'
})
export class CreateEventPopup {
    @Output() close = new EventEmitter<void>();
    @Output() eventCreated = new EventEmitter<any>();
    @Output() openLocationSelector = new EventEmitter<void>();

    form: FormGroup;
    generalError = '';
    errors: any = {};

    latitude: number | null = null;
    longitude: number | null = null;
    locationText = 'Select position on map';
    selectedCity: string | null = null;

    constructor(private fb: FormBuilder, private http: HttpClient, private mapboxService: MapboxService) {
        this.form = this.fb.group({
            title: ['', Validators.required],
            description: ['', Validators.required],
            date: ['', Validators.required],
            endDate: [''],
            startTime: ['', Validators.required],
            endTime: [''],
            nPartecipants: ['', [Validators.required, Validators.min(1)]],
            costPerPerson: ['', [Validators.min(0)]]
        }, { validators: this.timeRangeValidator });
    }

    private timeRangeValidator(group: FormGroup) {
        const startDateValue = group.get('date')?.value;
        const endDateValue = group.get('endDate')?.value;
        const startTimeValue = group.get('startTime')?.value;
        const endTimeValue = group.get('endTime')?.value;

        if (startDateValue && startTimeValue && endTimeValue) {
            // Use startDate for end if endDate is not provided
            const endD = endDateValue || startDateValue;

            const startStr = `${startDateValue}T${startTimeValue}`;
            const endStr = `${endD}T${endTimeValue}`;

            const start = new Date(startStr);
            const end = new Date(endStr);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

            const diffMs = end.getTime() - start.getTime();

            if (diffMs <= 0) {
                return { timeOrder: true };
            }

            // Minimum 1 hour duration
            if (diffMs < 60 * 60 * 1000) {
                return { minDuration: true };
            }
        }
        return null;
    }

    onClose() {
        this.close.emit();
    }

    submitAttempted = false;

    hasError(field: string): boolean {
        const control = this.form.get(field);
        const isTimeField = field === 'startTime' || field === 'endTime';
        const hasTimeError = this.form.errors?.['timeOrder'] || this.form.errors?.['minDuration'];

        return !!(this.submitAttempted && (control?.invalid || (isTimeField && hasTimeError)));
    }

    selectLocationOnMap() {
        this.openLocationSelector.emit();
    }

    setLocation(lat: number, lng: number) {
        this.latitude = lat;
        this.longitude = lng;
        this.selectedCity = null;
        this.locationText = 'Location selected';

        this.mapboxService.reverseGeocode(lat, lng).subscribe({
            next: (city) => {
                if (!city) return;
                this.selectedCity = city;
                this.locationText = `Location: ${city}`;
            },
            error: (err) => console.error('Error reverse geocoding city', err)
        });
    }

    onSubmit() {
        this.submitAttempted = true;
        this.errors = {};
        this.generalError = '';

        Object.keys(this.form.controls).forEach(key => {
            this.form.get(key)?.markAsTouched();
        });

        const controls = this.form.controls;
        if (controls['title'].invalid) this.errors.title = 'Title is required.';
        if (controls['description'].invalid) this.errors.description = 'Description is required.';
        if (controls['date'].invalid) this.errors.date = 'Date is required.';
        if (controls['startTime'].invalid) this.errors.startTime = 'Start time is required.';
        if (controls['nPartecipants'].invalid) {
            if (controls['nPartecipants'].errors?.['required']) {
                this.errors.nPartecipants = 'Number of participants is required.';
            } else if (controls['nPartecipants'].errors?.['min']) {
                this.errors.nPartecipants = 'Number of participants must be at least 1.';
            }
        }
        if (controls['costPerPerson'].invalid) {
            if (controls['costPerPerson'].errors?.['min']) {
                this.errors.costPerPerson = 'Cost cannot be negative.';
            } else {
                this.errors.costPerPerson = 'Invalid cost.';
            }
        }

        if (this.form.errors?.['timeOrder']) {
            this.errors.time = 'End must be after start (check both date and time).';
        } else if (this.form.errors?.['minDuration']) {
            this.errors.time = 'Event must last at least one hour.';
        }

        if (this.latitude === null || this.longitude === null) {
            this.errors.location = 'Select a location on the map.';
        } else if (!this.selectedCity) {
            this.errors.location = 'Unable to detect city from selected location.';
        }

        if (Object.keys(this.errors).length > 0) {
            return;
        }

        const formValue = this.form.value;
        const eventData = {
            title: formValue.title,
            description: formValue.description,
            city: this.selectedCity,
            date: formValue.date,
            endDate: formValue.endDate || null,
            startTime: formValue.startTime,
            endTime: formValue.endTime,
            nPartecipants: parseInt(formValue.nPartecipants),
            costPerPerson: formValue.costPerPerson !== null && formValue.costPerPerson !== ''
                ? Math.max(0, parseFloat(formValue.costPerPerson))
                : null,
            latitude: this.latitude,
            longitude: this.longitude
        };

        const userJson = localStorage.getItem('user');
        const userId = userJson ? JSON.parse(userJson).id : null;

        this.http.post(`http://localhost:8080/api/events?userId=${userId}`, eventData).subscribe({
            next: (response) => {
                this.eventCreated.emit(response);
                this.onClose();
            },
            error: (err) => {
                console.error('Error creating event:', err);
                this.generalError = 'Error creating event';
            }
        });
    }
}
