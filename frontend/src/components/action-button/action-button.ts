import { Component, input } from '@angular/core';

@Component({
  selector: 'ActionButton',
  imports: [],
  templateUrl: './action-button.html',
  styleUrl: './action-button.css',
})
export class ActionButton {
  text = input(''); //testo del bottone
  type = input('action'); //se action, lo mette col colore di accento, sennò bianco
}
