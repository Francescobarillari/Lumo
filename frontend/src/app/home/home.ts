import { Component } from '@angular/core';
import { MapView } from '../../components/map-view/map-view';
import { SignUpPopup } from '../../components/sign-up-popup/sign-up-popup';
import { SignInPopup } from '../../components/sign-in-popup/sign-in-popup';

@Component({
  selector: 'Home',
  standalone: true,
  imports: [MapView, SignUpPopup, SignInPopup],
  templateUrl: './home.html',
  styleUrl: './home.css',

})
export class Home {
  showSignUp = false;
  showSignIn = false;

  openSignUp() {
    this.showSignUp = true;
  }

  closeSignUp() {
    this.showSignUp = false;
  }

  openSignIn() {
    this.showSignIn = true;
  }

  closeSignIn() {
    this.showSignIn = false;
  }
  switchToSignUp() {
    this.closeSignIn();
    this.openSignUp()
  }
  switchToSignIn() {
    this.openSignIn();
    this.closeSignUp();
  }
}
