import { AbstractControl, ValidationErrors } from '@angular/forms';

// Solo lettere (nome)
export function onlyLettersValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value?.trim();
  return /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value) ? null : { onlyLetters: true };
}

// Valid date + at least 18
export function adultValidator(control: AbstractControl) {
  const value = control.value; // stringa "YYYY-MM-DD"
  if (!value) return { adult: true };

  const birthDate = new Date(value);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  if (age < 18) return { adult: true };
  return null;
}


// Email
export function emailFormatValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value?.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value) ? null : { emailInvalid: true };
}

// Password forte
export function strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(value) ? null : { weakPassword: true };
}
