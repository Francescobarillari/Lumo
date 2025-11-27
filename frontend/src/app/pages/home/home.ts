import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MapView } from '../../../components/map-view/map-view';
import { SignUpPopup } from '../../../components/sign-up-popup/sign-up-popup';
import { SignInPopup } from '../../../components/sign-in-popup/sign-in-popup';
import { VerifyEmailPopup } from '../../../components/verify-email-popup/verify-email-popup';

@Component({
  selector: 'Home',
  standalone: true,
  imports: [MapView, SignUpPopup, SignInPopup, VerifyEmailPopup],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  showSignUp = false;
  showSignIn = false;
  showVerifyPopup = false;
  loggedUser: { id: string; name: string; email: string } | null = null;

  recentEmail = '';
  recentToken = '';

  emailVerified = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        this.loggedUser = JSON.parse(storedUser);
      } catch (e) {
        console.error('Errore parsing utente locale', e);
        localStorage.removeItem('user');
      }
    }

    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const email = params['email'];

      if (token) {
        this.recentToken = token;
        this.recentEmail = email || '';

        this.openVerifyPopup();

        this.authService.verifyEmail(token).subscribe({
          next: (res) => {
            this.emailVerified = true;
            // Se la verifica ha successo qui (popup), potremmo anche loggare l'utente
            // ma per ora manteniamo il comportamento del popup
          },
          error: () => this.emailVerified = false
        });
      }
    });
  }


  openVerifyPopup(email?: string, token?: string) {
    if (email !== undefined) this.recentEmail = email;
    if (token !== undefined) this.recentToken = token;

    this.closeAll();
    this.showVerifyPopup = true;
  }

  resendEmail() {
    if (!this.recentToken && !this.recentEmail) {
      return;
    }

    this.authService.resendEmail({ oldToken: this.recentToken, email: this.recentEmail }).subscribe({
      next: (res) => {
        if (res?.data?.token) {
          this.recentToken = res.data.token;
        }
        this.emailVerified = false;
      },
      error: (err) => {
        console.error('Errore nel reinvio della mail di verifica', err);
      }
    });
  }

  openSignUp() {
    this.closeAll();
    this.showSignUp = true;
  }

  openSignIn() {
    this.closeAll();
    this.showSignIn = true;
  }

  closeAll() {
    this.showSignUp = false;
    this.showSignIn = false;
    this.showVerifyPopup = false;
  }

  switchToSignUp() {
    this.openSignUp();
  }

  switchToSignIn() {
    this.openSignIn();
  }

  onSignInSuccess(user: { id: string; name: string; email: string }) {
    this.loggedUser = {
      id: user?.id || '',
      name: user?.name || user?.email || 'Utente',
      email: user?.email || ''
    };
    localStorage.setItem('user', JSON.stringify(this.loggedUser));
    this.closeAll();
  }

  logout() {
    this.loggedUser = null;
    localStorage.removeItem('user');
  }
}
