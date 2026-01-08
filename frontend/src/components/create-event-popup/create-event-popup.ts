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
            endTime: [''],
            nPartecipants: ['', [Validators.required, Validators.min(1)]],
            costPerPerson: ['', [Validators.min(0)]]
        }, { validators: this.timeRangeValidator });
    }

    private timeRangeValidator(group: FormGroup) {
        const start = group.get('startTime')?.value;
        const end = group.get('endTime')?.value;

        if (start && end) {
            const [h1, m1] = start.split(':').map(Number);
            const [h2, m2] = end.split(':').map(Number);

            const startMinutes = h1 * 60 + m1;
            const endMinutes = h2 * 60 + m2;

            if (endMinutes <= startMinutes) {
                return { timeOrder: true };
            }

            if (endMinutes - startMinutes < 60) {
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
        this.locationText = 'Posizione selezionata';
    }

    onSubmit() {
        this.submitAttempted = true;
        this.errors = {}; // Clear previous errors
        this.generalError = '';

        Object.keys(this.form.controls).forEach(key => {
            this.form.get(key)?.markAsTouched();
        });

        // Collect all field errors
        const controls = this.form.controls;
        if (controls['title'].invalid) this.errors.title = 'Il titolo è obbligatorio.';
        if (controls['city'].invalid) this.errors.city = 'La città è obbligatoria.';
        if (controls['description'].invalid) this.errors.description = 'La descrizione è obbligatoria.';
        if (controls['date'].invalid) this.errors.date = 'La data è obbligatoria.';
        if (controls['startTime'].invalid) this.errors.startTime = 'L\'orario di inizio è obbligatorio.';
        // endTime is optional
        if (controls['nPartecipants'].invalid) {
            if (controls['nPartecipants'].errors?.['required']) {
                this.errors.nPartecipants = 'Il numero di partecipanti è obbligatorio.';
            } else if (controls['nPartecipants'].errors?.['min']) {
                this.errors.nPartecipants = 'Il numero di partecipanti deve essere almeno 1.';
            }
        }
        if (controls['costPerPerson'].invalid) {
            if (controls['costPerPerson'].errors?.['min']) {
                this.errors.costPerPerson = 'Il costo non può essere negativo.';
            } else {
                this.errors.costPerPerson = 'Costo non valido.';
            }
        }

        // Check cross-field validation
        if (this.form.errors?.['timeOrder']) {
            this.errors.time = 'L\'orario di inizio deve essere prima dell\'orario di fine.';
        } else if (this.form.errors?.['minDuration']) {
            this.errors.time = 'L\'evento deve durare almeno un\'ora.';
        }

        if (this.latitude === null || this.longitude === null) {
            this.errors.location = 'Seleziona una posizione sulla mappa.';
        }

        if (Object.keys(this.errors).length > 0) {
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
                this.generalError = 'Errore nella creazione dell\'evento';
            }
        });
    }
}
