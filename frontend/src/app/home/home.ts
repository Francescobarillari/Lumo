import { Component } from '@angular/core';
import { MapView } from '../../components/map-view/map-view';
import { SignUpPopup } from '../../components/sign-up-popup/sign-up-popup';

@Component({
  selector: 'Home',
  imports: [MapView, SignUpPopup],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  showSignUp = false;

  openSignUp() {
    this.showSignUp = true;
  }

  closeSignUp() {
    this.showSignUp = false;
  }
}
