import { Component, EventEmitter, Output } from '@angular/core';
import { ResponsiveService } from '../../services/responsive-service';
import { CircleIcon } from '../circle-icon/circle-icon';
import { FormField } from '../form-field/form-field';
import { emailFormatValidator, strongPasswordValidator } from '../../validators/validators';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'SignInPopup',
  standalone: true,
  imports: [CircleIcon, FormField],
  templateUrl: './sign-in-popup.html',
  styleUrls: ['./sign-in-popup.css'],  
})
export class SignInPopup {
  @Output() close = new EventEmitter<void>();
  @Output() switchToSignUp = new EventEmitter<void>();
  @Output() signInSuccess = new EventEmitter<{ id: string; name: string; email: string }>();

  form: any;

  errors: { [key: string]: string } = {};
  generalError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
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
          email: res?.data?.email || payload.email
        });
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

  hasError(field: string): boolean {
    return !!this.errors[field];
  }

  getFieldError(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}
