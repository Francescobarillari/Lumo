import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'FormField',
  imports: [ReactiveFormsModule],
  templateUrl: './form-field.html',
  styleUrl: './form-field.css',
})
export class FormField {
  @Input() placeholder = 'template'; //sarebbe il placeholder, di default è 'template'
  @Input() type = 'text';  //tipo di dato dentro
  @Input() control!: FormControl; //validazione associata
  @Input() error: boolean = false; //se c'è un errore di validazione
}
