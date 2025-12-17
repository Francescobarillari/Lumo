import { Component, EventEmitter, Output } from '@angular/core';
import { ResponsiveService } from '../../services/responsive-service';
import { CircleIcon } from '../circle-icon/circle-icon';
import { FormField } from '../../components/form-field/form-field';
import { FormBuilder } from '@angular/forms';
import { onlyLettersValidator, adultValidator, emailFormatValidator, strongPasswordValidator } from '../../validators/validators';
import { AuthService } from '../../services/auth.service';
import { GoogleIdentityService } from '../../services/google-identity.service';

import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'SignUpPopup',
  standalone: true,
  imports: [CircleIcon, FormField, MatIconModule, CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up-popup.html',
  styleUrls: ['./sign-up-popup.css'],
})
export class SignUpPopup {
  @Output() close = new EventEmitter<void>();
  @Output() switchToSignIn = new EventEmitter<void>();
  @Output() signUpSuccess = new EventEmitter<{ email: string; token: string }>();
  @Output() signInSuccess = new EventEmitter<{ id: string; name: string; email: string }>();

  form: any;
  errors: { [key: string]: string } = {};
  generalError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private googleIdentity: GoogleIdentityService,
    public responsive: ResponsiveService
  ) {
    this.form = this.fb.group({
      name: ['', [onlyLettersValidator]],
      birthdate: ['', [adultValidator]],
      email: ['', [emailFormatValidator]],
      password: ['', [strongPasswordValidator]]
    });
  }

  onSubmit() {
    this.errors = {};
    this.generalError = null;

    const controls = this.form.controls;

    // Validazioni frontend
    const nameErr = onlyLettersValidator(controls['name']);
    if (nameErr) this.errors['name'] = 'Il nome deve contenere solo lettere.';

    const birthErr = adultValidator(controls['birthdate']);
    if (birthErr) this.errors['birthdate'] = 'Devi essere maggiore di 18 anni.';

    const emailErr = emailFormatValidator(controls['email']);
    if (emailErr) this.errors['email'] = 'Email non valida.';

    const passwordErr = strongPasswordValidator(controls['password']);
    if (passwordErr) {
      this.errors['password'] = 'La password deve avere almeno 8 caratteri, una maiuscola, un numero e un simbolo.';
    }

    if (Object.keys(this.errors).length > 0) return;

    // Payload
    const payload = {
      name: this.form.value.name,
      birthdate: this.form.value.birthdate,
      email: this.form.value.email,
      password: this.form.value.password
    };

    this.auth.signUp(payload).subscribe({
      next: (res) => {
        this.errors = {};
        this.generalError = null;

        if (!res?.success) {
          this.generalError = res?.error || 'Registrazione non riuscita.';
          return;
        }

        this.signUpSuccess.emit({
          email: this.form.value.email,
          token: res?.data?.token || ''
        });
      },

      error: (err) => {
        this.errors = {};
        this.generalError = null;

        if (err && typeof err === 'object' && 'error' in err) {
          const body = err.error;

          if (body && typeof body === 'object') {
            if (body.data && typeof body.data === 'object') {
              this.errors = body.data;
              return;
            }
            if (body.error && typeof body.error === 'string') {
              this.generalError = body.error;
              return;
            }
          }

          if (typeof err.error === 'string') {
            this.generalError = err.error;
            return;
          }
        }

        if (typeof err === 'string') {
          this.generalError = err;
          return;
        }

        this.generalError = 'Errore inatteso.';
        console.warn('Unhandled error shape', err);
      }
    });
  }

  hasError(field: string): boolean {
    return !!this.errors[field];
  }

  closePopup() {
    this.close.emit();
  }

  goToSignIn() {
    this.switchToSignIn.emit();
  }

  async signUpWithGoogle() {
    this.errors = {};
    this.generalError = null;

    try {
      const code = await this.googleIdentity.getAuthCode();
      this.auth.loginWithGoogleCode({ code }).subscribe({
        next: (res) => {
          // Consideriamo l'utente autenticato con Google.
          this.signInSuccess.emit({
            id: res?.data?.id || '',
            name: res?.data?.name || '',
            email: res?.data?.email || ''
          });
          this.closePopup();
        },
        error: (err) => {
          const body = err?.error;
          if (body?.data && typeof body.data === 'object') {
            this.errors = body.data;
            return;
          }
          if (typeof body?.error === 'string') {
            this.generalError = body.error;
            return;
          }
          this.generalError = 'Accesso Google non riuscito.';
        }
      });
    } catch (e: any) {
      if (e?.code === 'google_cancelled') {
        return; // utente ha chiuso/soppresso il prompt: nessun errore, può riprovare
      }
      this.generalError = e?.message || 'Accesso Google non riuscito.';
    }
  }
}
