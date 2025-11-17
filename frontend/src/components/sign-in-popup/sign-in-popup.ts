import { Component, EventEmitter, Output } from '@angular/core';
import { ResponsiveService } from '../../services/responsive-service';
import { CircleIcon } from '../circle-icon/circle-icon';
import { FormField } from '../form-field/form-field';
import { emailFormatValidator, strongPasswordValidator } from '../../validators/validators';
import { FormBuilder } from '@angular/forms';
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

  form: any;

  errors: { [key: string]: string } = {};

  constructor(private fb: FormBuilder, public responsive: ResponsiveService) {
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

    const controls = this.form.controls;

    const emailErr = emailFormatValidator(controls['email']);
    if (emailErr) this.errors['email'] = 'Email non valida.';

    const passwordErr = strongPasswordValidator(controls['password']);
    if (passwordErr) this.errors['password'] =
      'La password deve avere almeno 8 caratteri, una maiuscola, un numero e un simbolo.';

    if (Object.keys(this.errors).length === 0) {
      console.log("Form valido:", this.form.value);
      // qui puoi chiamare il backend
    }
  }

  hasError(field: string): boolean {
    return !!this.errors[field];
  }

  getFieldError(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }
}
