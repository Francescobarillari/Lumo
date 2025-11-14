import { Component } from '@angular/core';
import { MapView } from '../../components/map-view/map-view';
import { RouterLink  } from '@angular/router';

@Component({
  selector: 'Home',
  imports: [MapView, RouterLink ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
