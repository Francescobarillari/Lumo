import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';
  const ok = /[A-Z]/.test(value) && /[0-9]/.test(value) && value.length >= 8;
  return ok ? null : { weakPassword: true };
}
