import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { MapView } from '../../../components/map-view/map-view';
import { SignUpPopup } from '../../../components/sign-up-popup/sign-up-popup';
import { SignInPopup } from '../../../components/sign-in-popup/sign-in-popup';
import { VerifyEmailPopup } from '../../../components/verify-email-popup/verify-email-popup';

import { ActionBarComponent } from '../../../components/action-bar/action-bar';
import { CropImagePopup } from '../../../components/crop-image-popup/crop-image-popup';
import { CreateEventPopup } from '../../../components/create-event-popup/create-event-popup';
import { EventPopupCard } from '../../../components/event-popup-card/event-popup-card';
import { MapLocationSelector } from '../../../components/map-location-selector/map-location-selector';
import { Event as LumoEvent } from '../../../models/event';
import { EventService } from '../../../services/event.service';
import { UserService } from '../../../services/user-service/user-service';

@Component({
  selector: 'Home',
  standalone: true,
  imports: [MapView, SignUpPopup, SignInPopup, VerifyEmailPopup, ActionBarComponent, CropImagePopup, CreateEventPopup, EventPopupCard, MapLocationSelector],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  @ViewChild(MapView) mapView!: MapView;

  showSignUp = false;
  showSignIn = false;
  showVerifyPopup = false;

  // New states
  showCropPopup = false;
  selectedImageFile: File | null = null;

  // Event popup states
  showCreateEventPopup = false;
  showLocationSelector = false;
  selectedEvent: LumoEvent | null = null;
  eventScreenPosition: { x: number, y: number } | null = null;

  loggedUser: { id: string; name: string; email: string; profileImage?: string } | null = null;

  recentEmail = '';
  recentToken = '';

  emailVerified = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private http: HttpClient,
    private eventService: EventService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.refreshLocalUser();

    // Subscribe to global user updates
    this.userService.userUpdates$.subscribe(() => {
      this.refreshUserFromBackend();
    });

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

  refreshLocalUser() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        this.loggedUser = JSON.parse(storedUser);
      } catch (e) {
        console.error('Errore parsing utente locale', e);
        localStorage.removeItem('user');
      }
    }
  }

  refreshUserFromBackend() {
    if (!this.loggedUser) return;

    this.userService.getUserById(this.loggedUser.id).subscribe({
      next: (user) => {
        this.loggedUser = {
          id: user.id || '',
          name: user.name || user.email || 'Utente',
          email: user.email || '',
          profileImage: (user as any).profileImage,
          followersCount: user.followersCount,
          followingCount: user.followingCount
        } as any;

        localStorage.setItem('user', JSON.stringify(this.loggedUser));
        console.log('User refreshed:', this.loggedUser);
      },
      error: (err) => console.error('Error refreshing user', err)
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
    this.showCreateEventPopup = false;
    this.showLocationSelector = false;
    this.selectedEvent = null;
    if (this.mapView) this.mapView.managedPopupType = null;
  }

  openEventPopup(event: LumoEvent) {
    // Close any previously open event card
    this.selectedEvent = event;

    // Initial position
    this.updateCardPosition();

    // Listen to map move events to update position
    if (this.mapView && this.mapView.map) {
      this.mapView.map.off('move', this.updateCardPosition.bind(this)); // Prevent duplicate listeners
      this.mapView.map.on('move', this.updateCardPosition.bind(this));

      // Listen to map click to close popup (if clicking on map background)
      this.mapView.map.off('click', this.onMapClick.bind(this));
      this.mapView.map.on('click', this.onMapClick.bind(this));
    }

    // Add global document click listener for UI elements (Sidebar, etc)
    // Use setTimeout to avoid catching the current click event that opened the popup (though marker stopPropagation handles it, this is safer)
    setTimeout(() => {
      document.addEventListener('click', this.onDocumentClick);
    }, 0);
  }

  onEventsUpdated(newEvents: LumoEvent[]) {
    // If we have a selected event, try to find its updated version
    if (this.selectedEvent) {
      const updatedEvent = newEvents.find(e => e.id === this.selectedEvent!.id);
      if (updatedEvent) {
        // Prevent popup closure by only updating data, not reference if possible, 
        // or just update reference. Since EventPopupCard uses OnChanges, reference update is safer.
        // We preserve properties that might not be in the map list if needed, but MapView usually has full objects.
        this.selectedEvent = updatedEvent;
      }
    }
  }

  updateCardPosition() {
    if (this.selectedEvent && this.mapView) {
      this.eventScreenPosition = this.mapView.getEventScreenPosition(this.selectedEvent);
    }
  }

  onMapClick(e: any) {
    // If we click on the map but NOT on a marker (which stops propagation usually, but we check just in case)
    // Actually MapView handles marker clicks. If this fires, it means we clicked the map background.
    if (e.defaultPrevented) return; // If marker click handled it
    this.closeEventPopup();
  }

  // Handle document clicks (outside map)
  onDocumentClick = (event: MouseEvent) => {
    // We can just close it, because:
    // 1. Clicks on the card are stopped by stopPropagation in EventPopupCard
    // 2. Clicks on markers are stopped by stopPropagation in MapView
    // 3. Clicks on Map container might be handled here OR by onMapClick. 
    //    If map click bubbles to document, this handles it. If map swallows it, onMapClick handles it.
    this.closeEventPopup();
  }

  closeEventPopup() {
    this.selectedEvent = null;
    this.eventScreenPosition = null;

    // Clean up listeners
    if (this.mapView && this.mapView.map) {
      this.mapView.map.off('move', this.updateCardPosition.bind(this));
      this.mapView.map.off('click', this.onMapClick.bind(this));
    }

    document.removeEventListener('click', this.onDocumentClick);
  }

  onParticipate(event: LumoEvent) {
    console.log('onParticipate called for event:', event.id);
    if (!this.loggedUser) {
      console.log('User not logged in, opening sign in');
      this.openSignIn(); // Prompt login if guest
      return;
    }

    console.log('Sending request for user:', this.loggedUser.id, 'event:', event.id);
    this.eventService.requestParticipation(event.id, this.loggedUser.id).subscribe({
      next: () => {
        console.log('Request success');
        // Optimistic UI update
        if (this.selectedEvent && this.selectedEvent.id === event.id) {
          console.log('Updating local state to PENDING');
          this.selectedEvent.participationStatus = 'PENDING';
        }
      },
      error: (err) => console.error('Error requesting participation', err)
    });
  }

  onToggleFavorite() {
    if (this.selectedEvent && this.mapView) {
      // Delegate to MapView which holds the list and logic
      this.mapView.onToggleFavorite(this.selectedEvent);
    }
  }

  // Handle location selector workflow
  createEventPopupRef: any = null;

  openLocationSelector() {
    this.showLocationSelector = true;
  }

  onLocationSelected(location: { lat: number, lng: number }) {
    if (this.createEventPopupRef) {
      this.createEventPopupRef.setLocation(location.lat, location.lng);
    }
    this.showLocationSelector = false;
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

    // Refresh fully to get counts
    this.refreshUserFromBackend();

    // Already setting in localStorage but refreshed one will overwrite it
    // localStorage.setItem('user', JSON.stringify(this.loggedUser));
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
      console.log('Navigate to Events');
    } else if (action === 'crea-evento' || action === 'add-event') {
      console.log('Crea Evento clicked');
      this.showCreateEventPopup = true;
    } else if (action === 'saved-events') {
      console.log('Saved Events clicked');
      if (this.mapView) this.mapView.managedPopupType = 'saved';
    } else if (action === 'participating-events') {
      console.log('Participating Events clicked');
      if (this.mapView) this.mapView.managedPopupType = 'participating';
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
