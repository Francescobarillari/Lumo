import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { MapView } from '../../../components/map-view/map-view';
import { SignUpPopup } from '../../../components/sign-up-popup/sign-up-popup';
import { SignInPopup } from '../../../components/sign-in-popup/sign-in-popup';
import { VerifyEmailPopup } from '../../../components/verify-email-popup/verify-email-popup';

import { ActionBarComponent } from '../../../components/action-bar/action-bar';
import { CropImagePopup } from '../../../components/crop-image-popup/crop-image-popup';

@Component({
  selector: 'Home',
  standalone: true,
  imports: [MapView, SignUpPopup, SignInPopup, VerifyEmailPopup, ActionBarComponent, CropImagePopup],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  showSignUp = false;
  showSignIn = false;
  showVerifyPopup = false;

  // New states
  showCropPopup = false;
  selectedImageFile: File | null = null;

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
    this.showCropPopup = false;
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
    this.closeAll();
  }

  // Menu Actions
  onMenuAction(action: string) {
    console.log('Menu action:', action);
    if (action === 'logout') {
      this.logout();
    } else if (action === 'change-photo') {
      // Trigger file input programmatically
      const fileInput = document.getElementById('hiddenFileInput') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    } else if (action === 'account') {
      // TODO: Navigate to account page
      console.log('Navigate to Account');
    } else if (action === 'events') {
      // TODO: Navigate to events page
      console.log('Navigate to Events');
    } else if (action === 'add-event') {
      console.log('Add Event clicked');
    }
  }

  // File Selection & Cropping
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
      this.showCropPopup = true;
      // Reset input value so same file can be selected again if needed
      event.target.value = '';
    }
  }

  onImageCropped(blob: Blob) {
    if (this.loggedUser) {
      const formData = new FormData();
      formData.append('file', blob, 'profile.jpg');

      this.http.post<any>(`http://localhost:8080/api/users/${this.loggedUser.id}/image`, formData).subscribe({
        next: (res) => {
          if (this.loggedUser) {
            // Aggiungiamo un timestamp per evitare il caching del browser
            this.loggedUser.profileImage = res.imageUrl + '?t=' + new Date().getTime();
            localStorage.setItem('user', JSON.stringify(this.loggedUser));
            this.closeAll();
          }
        },
        error: (err) => console.error('Error uploading image', err)
      });
    }
  }
}
