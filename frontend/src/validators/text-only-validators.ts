import { AbstractControl, ValidationErrors } from '@angular/forms';

export function textOnlyValidator(control: AbstractControl): ValidationErrors | null {
  const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
  return regex.test(control.value) ? null : { textOnly: true };
}
