import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ResponsiveService } from '../../services/responsive-service';
import { CircleIcon } from '../circle-icon/circle-icon';
import { FormField } from '../form-field/form-field';
import { emailFormatValidator, strongPasswordValidator } from '../../validators/validators';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { GoogleIdentityService } from '../../services/google-identity.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'SignInPopup',
  standalone: true,
  imports: [CircleIcon, FormField, MatIconModule, CommonModule, ReactiveFormsModule],
  templateUrl: './sign-in-popup.html',
  styleUrls: ['./sign-in-popup.css'],
})
export class SignInPopup {
  @Output() close = new EventEmitter<void>();
  @Output() switchToSignUp = new EventEmitter<void>();
  @Output() signInSuccess = new EventEmitter<{ id: string; name: string; email: string; profileImage?: string }>();

  form: any;

  errors: { [key: string]: string } = {};
  generalError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private googleIdentity: GoogleIdentityService,
    private router: Router,
    public responsive: ResponsiveService
  ) {
    this.form = this.fb.group({
      email: ['', [emailFormatValidator]],
      password: ['', [strongPasswordValidator]]
    });
  };

  closePopup() {
    this.close.emit();
  }
  goToSignUp() {
    this.switchToSignUp.emit();
  }

  onSubmit() {
    this.errors = {};
    this.generalError = null;

    const controls = this.form.controls;

    const emailErr = emailFormatValidator(controls['email']);
    if (emailErr) this.errors['email'] = 'Email non valida.';

    const passwordErr = strongPasswordValidator(controls['password']);
    if (passwordErr) this.errors['password'] =
      'La password deve avere almeno 8 caratteri, una maiuscola, un numero e un simbolo.';

    if (Object.keys(this.errors).length > 0) return;

    const payload = {
      email: this.form.value.email,
      password: this.form.value.password
    };

    this.auth.login(payload).subscribe({
      next: (res) => {
        this.errors = {};
        this.generalError = null;
        this.signInSuccess.emit({
          id: res?.data?.id || '',
          name: res?.data?.name || '',
          email: res?.data?.email || payload.email,
          profileImage: res?.data?.profileImage
        });
        localStorage.setItem('user', JSON.stringify({
          id: res?.data?.id || '',
          name: res?.data?.name || '',
          email: res?.data?.email || payload.email,
          profileImage: res?.data?.profileImage,
          isAdmin: res?.data?.isAdmin
        }));

        if (res?.data?.isAdmin === 'true') {
          this.router.navigate(['/admin']);
        }

        this.closePopup();
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

  async signInWithGoogle() {
    this.errors = {};
    this.generalError = null;

    try {
      const code = await this.googleIdentity.getAuthCode();
      this.auth.loginWithGoogleCode({ code }).subscribe({
        next: (res) => {
          this.signInSuccess.emit({
            id: res?.data?.id || '',
            name: res?.data?.name || '',
            email: res?.data?.email || '',
            profileImage: res?.data?.profileImage
          });
          localStorage.setItem('user', JSON.stringify(res.data));

          if (res?.data?.isAdmin === 'true') {
            this.router.navigate(['/admin']);
          }

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

  hasError(field: string): boolean {
    return !!this.errors[field];
  }
}
