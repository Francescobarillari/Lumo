import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
  loggedUser: { id: string; name: string; email: string; profileImage?: string } | null = null;

  recentEmail = '';
  recentToken = '';

  emailVerified = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private http: HttpClient
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

  onSignInSuccess(user: { id: string; name: string; email: string; profileImage?: string }) {
    console.log('User received on sign in:', user);
    this.loggedUser = {
      id: user?.id || '',
      name: user?.name || user?.email || 'Utente',
      email: user?.email || '',
      profileImage: (user as any).profileImage
    };
    localStorage.setItem('user', JSON.stringify(this.loggedUser));
    this.closeAll();
  }

  logout() {
    this.loggedUser = null;
    localStorage.removeItem('user');
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && this.loggedUser) {
      const formData = new FormData();
      formData.append('file', file);

      this.http.post<any>(`http://localhost:8080/api/users/${this.loggedUser.id}/image`, formData).subscribe({
        next: (res) => {
          if (this.loggedUser) {
            this.loggedUser.profileImage = res.imageUrl;
            localStorage.setItem('user', JSON.stringify(this.loggedUser));
          }
        },
        error: (err) => console.error('Error uploading image', err)
      });
    }
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
