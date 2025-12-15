import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'FormField',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-field.html',
  styleUrl: './form-field.css',
})
export class FormField {
  @Input() control: FormControl | null = null;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() error: boolean = false;
  @Input() customClass: string = ''; // For custom styling
}
