import { AbstractControl, ValidationErrors } from '@angular/forms';

// Solo lettere (nome)
export function onlyLettersValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value?.trim();
  return /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value) ? null : { onlyLetters: true };
}

// Data valida + maggiore di 18
export function adultValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return { invalidDate: true };

  const date = new Date(value);
  if (isNaN(date.getTime())) return { invalidDate: true };

  const today = new Date();
  const age = today.getFullYear() - date.getFullYear();
  const isAdult =
    age > 18 || (age === 18 &&
      (today.getMonth() > date.getMonth() ||
        (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate())));

  return isAdult ? null : { notAdult: true };
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
