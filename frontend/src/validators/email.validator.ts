import { AbstractControl, ValidationErrors } from '@angular/forms';

export function EmailValidator(control: AbstractControl): ValidationErrors | null {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(control.value) ? null : { invalidEmail: true };
}
