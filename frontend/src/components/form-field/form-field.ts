import { Component, input } from '@angular/core';

@Component({
  selector: 'FormField',
  imports: [],
  templateUrl: './form-field.html',
  styleUrl: './form-field.css',
})
export class FormField {
  title = input('template'); //sarebbe il placeholder, di default è 'template'
  type = input('text');  //tipo di dato dentro
}
