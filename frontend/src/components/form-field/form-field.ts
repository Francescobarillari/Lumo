import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'FormField',
  imports: [ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './form-field.html',
  styleUrl: './form-field.css',
})
export class FormField {
  @Input() control: FormControl | null = null;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() error: boolean = false;
  @Input() customClass: string = ''; // For custom styling
  @Input() showToggle: boolean = false;

  showPassword = false;

  get inputType(): string {
    if (this.showToggle && this.type === 'password') {
      return this.showPassword ? 'text' : 'password';
    }
    return this.type;
  }

  togglePasswordVisibility(event: MouseEvent) {
    event.stopPropagation();
    if (this.showToggle && this.type === 'password') {
      this.showPassword = !this.showPassword;
    }
  }
}
