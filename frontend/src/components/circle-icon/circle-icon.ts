import { Component, input } from '@angular/core';
import { ResponsiveService } from '../../services/responsive-service';

@Component({
  selector: 'CircleIcon',
  imports: [],
  templateUrl: './circle-icon.html',
  styleUrl: './circle-icon.css',
})
export class CircleIcon {
  constructor(public responsive: ResponsiveService) {}

  path = input(''); // percorso di default dell'icona
  iconAlt = input('icon'); // alt di default per l'icona
}
