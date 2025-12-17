import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormField } from '../form-field/form-field';
import { CircleIcon } from '../circle-icon/circle-icon';
import { HttpClient } from '@angular/common/http';

import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'create-event-popup',
    standalone: true,
    imports: [CommonModule, FormField, CircleIcon, ReactiveFormsModule, MatIconModule],
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
    locationText = 'Seleziona posizione sulla mappa';

    constructor(private fb: FormBuilder, private http: HttpClient) {
        this.form = this.fb.group({
            title: ['', Validators.required],
            description: ['', Validators.required],
            city: ['', Validators.required],
            date: ['', Validators.required],
            startTime: ['', Validators.required],
            endTime: ['', Validators.required],
            nPartecipants: ['', [Validators.required, Validators.min(1)]],
            costPerPerson: ['']
        });
    }

    onClose() {
        this.close.emit();
    }

    submitAttempted = false;

    hasError(field: string): boolean {
        const control = this.form.get(field);
        return !!(this.submitAttempted && control && control.invalid);
    }

    selectLocationOnMap() {
        this.openLocationSelector.emit();
    }

    setLocation(lat: number, lng: number) {
        this.latitude = lat;
        this.longitude = lng;
        this.locationText = 'Posizione selezionata';
    }

    onSubmit() {
        // Set flag to show validation errors
        this.submitAttempted = true;

        // Mark all as touched to show validation errors
        Object.keys(this.form.controls).forEach(key => {
            this.form.get(key)?.markAsTouched();
        });

        if (!this.form.valid) {
            this.generalError = 'Compila tutti i campi richiesti';
            return;
        }

        if (this.latitude === null || this.longitude === null) {
            this.generalError = 'Seleziona una posizione sulla mappa';
            return;
        }

        const formValue = this.form.value;
        const eventData = {
            title: formValue.title,
            description: formValue.description,
            city: formValue.city,
            date: formValue.date,
            startTime: formValue.startTime,
            endTime: formValue.endTime,
            nPartecipants: parseInt(formValue.nPartecipants),
            costPerPerson: formValue.costPerPerson ? parseFloat(formValue.costPerPerson) : null,
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
                this.generalError = 'Errore nella creazione dell\'evento';
            }
        });
    }
}
