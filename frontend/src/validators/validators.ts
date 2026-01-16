import { AbstractControl, ValidationErrors } from '@angular/forms';
export function onlyLettersValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value?.trim();
  return /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value) ? null : { onlyLetters: true };
}

export function adultValidator(control: AbstractControl) {
  const value = control.value; // formato atteso: YYYY-MM-DD
  if (!value) return { adult: true };

  const birthDate = new Date(value);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  if (age < 18) return { adult: true };
  return null;
}


export function emailFormatValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value?.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value) ? null : { emailInvalid: true };
}

export function strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(value) ? null : { weakPassword: true };
}
