import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { UserProfileModalComponent } from '../../../components/user-profile-modal/user-profile-modal.component';
import { Event as LumoEvent } from '../../../models/event';
import { EventService } from '../../../services/event.service';
import { UserService } from '../../../services/user-service/user-service';

@Component({
  selector: 'Home',
  standalone: true,
  imports: [MapView, SignUpPopup, SignInPopup, VerifyEmailPopup, ActionBarComponent, CropImagePopup, CreateEventPopup, EventPopupCard, MapLocationSelector, UserProfileModalComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, AfterViewInit {

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

  // User Profile Popup State
  showUserProfile = false;
  selectedUserProfileId: string | null = null;

  loggedUser: { id: string; name: string; email: string; profileImage?: string; isAdmin?: boolean } | null = null;

  recentEmail = '';
  recentToken = '';

  emailVerified = false;
  private pendingSharedEventId: number | null = null;
  private sharedEventRetryCount = 0;
  private sharedEventLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private eventService: EventService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.refreshLocalUser();
    this.checkAdminRedirect();

    // Subscribe to global user updates
    this.userService.userUpdates$.subscribe(() => {
      this.refreshUserFromBackend();
    });

    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const email = params['email'];
      const userId = params['user'];
      const eventId = params['event'];

      if (userId) {
        // Handle Deep Link for User Profile
        // Ensure user is loaded or just open the modal with ID
        this.openUserProfile(userId);

        // Remove query param to clean URL (Optional but good UX)
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { user: null },
          queryParamsHandling: 'merge', // remove to replace all with null
          replaceUrl: true
        });
      }

      if (eventId) {
        const parsed = Number(eventId);
        if (!Number.isNaN(parsed)) {
          this.pendingSharedEventId = parsed;
          this.loadSharedEvent();
        }

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { event: null },
          queryParamsHandling: 'merge',
          replaceUrl: true
        });
      }

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

  ngAfterViewInit() {
    this.loadSharedEvent();
  }

  checkAdminRedirect() {
    if (this.loggedUser && this.loggedUser.isAdmin) {
      this.router.navigate(['/admin']);
    }
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
          description: user.description,
          profileImage: (user as any).profileImage,
          followersCount: user.followersCount,
          followingCount: user.followingCount,
          isAdmin: user.isAdmin
        } as any;

        if (this.loggedUser?.isAdmin) {
          this.router.navigate(['/admin']);
          return;
        }

        localStorage.setItem('user', JSON.stringify(this.loggedUser));
        console.log('User refreshed:', this.loggedUser);
      },
      error: (err) => console.error('Error refreshing user', err)
    });
  }

  private loadSharedEvent() {
    if (!this.pendingSharedEventId || this.sharedEventLoading) return;

    const eventId = this.pendingSharedEventId;
    const currentUserId = this.loggedUser ? this.loggedUser.id : undefined;

    this.sharedEventLoading = true;
    this.eventService.getEventById(eventId, currentUserId).subscribe({
      next: (event) => {
        this.sharedEventLoading = false;
        this.openSharedEventOnMap(event);
      },
      error: (err) => {
        this.sharedEventLoading = false;
        this.pendingSharedEventId = null;
        console.error('Error loading shared event', err);
      }
    });
  }

  private openSharedEventOnMap(event: LumoEvent) {
    if (!this.mapView?.map) {
      if (this.sharedEventRetryCount < 12) {
        this.sharedEventRetryCount += 1;
        setTimeout(() => this.openSharedEventOnMap(event), 250);
      }
      return;
    }

    this.sharedEventRetryCount = 0;
    this.pendingSharedEventId = null;
    this.mapView.flyToEvent(event);
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
    this.closeEventPopup();
    if (this.mapView) this.mapView.managedPopupType = null;
    this.showUserProfile = false;
    this.selectedUserProfileId = null;
  }

  openUserProfile(userId: string) {
    console.log('[Home] openUserProfile', userId);
    this.closeAll();
    this.selectedUserProfileId = userId;
    this.showUserProfile = true;
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

    // Creating context for potential fetch
    const currentUserId = this.loggedUser ? this.loggedUser.id : undefined;

    // Fetch fresh data for the event to ensure status (participating/saved) is up to date
    this.eventService.getEventById(event.id, currentUserId).subscribe({
      next: (freshEvent) => {
        // Update selected event with fresh data, preserving some map props if needed
        // but freshEvent should have everything.
        this.selectedEvent = freshEvent;
        // Re-position because maybe initial position was based on stale object?
        // Actually coords shouldn't change, but good to trigger update.
        // We need to ensure latitude/longitude are present in freshEvent.
        // If backend sends them, good.
        this.updateCardPosition();
      },
      error: (err) => console.error('Error fetching fresh event data', err)
    });

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

  onLeaveEvent(event: LumoEvent) {
    if (!this.loggedUser) {
      this.openSignIn();
      return;
    }

    const confirmed = confirm('Sei sicuro di voler lasciare l\'evento?');
    if (!confirmed) return;

    this.eventService.leaveEvent(event.id, this.loggedUser.id).subscribe({
      next: () => {
        if (this.selectedEvent && this.selectedEvent.id === event.id) {
          this.selectedEvent.participationStatus = 'NONE';
          this.selectedEvent.isParticipating = false;
          if (typeof this.selectedEvent.occupiedSpots === 'number' && this.selectedEvent.occupiedSpots > 0) {
            this.selectedEvent.occupiedSpots -= 1;
          }
        }

        if (this.mapView) {
          const target = this.mapView.events.find(e => e.id === event.id);
          if (target) {
            target.participationStatus = 'NONE';
            target.isParticipating = false;
            if (typeof target.occupiedSpots === 'number' && target.occupiedSpots > 0) {
              target.occupiedSpots -= 1;
            }
          }
        }
      },
      error: (err) => console.error('Error leaving event', err)
    });
  }

  onDeleteEvent(event: LumoEvent) {
    if (!this.loggedUser) {
      this.openSignIn();
      return;
    }

    if (event.creatorId && event.creatorId.toString() !== this.loggedUser.id.toString()) {
      console.warn('Non sei l\'organizzatore di questo evento');
      return;
    }

    const confirmed = confirm('Sei sicuro di voler cancellare questo evento? Questa azione non può essere annullata.');
    if (!confirmed) return;

    this.eventService.deleteEvent(event.id).subscribe({
      next: () => {
        // Remove from local state
        if (this.mapView) {
          this.mapView.events = this.mapView.events.filter(e => e.id !== event.id);
          this.mapView.loadEvents?.();
        }
        this.closeEventPopup();
      },
      error: (err) => console.error('Errore nella cancellazione dell\'evento', err)
    });
  }

  onToggleFavorite() {
    if (this.selectedEvent && this.mapView) {
      // Delegate to MapView which holds the list and logic
      this.mapView.onToggleFavorite(this.selectedEvent);
    }
  }

  openShare(event: LumoEvent) {
    if (!this.mapView) return;
    this.mapView.openShare(event);
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
      profileImage: (user as any).profileImage,
      isAdmin: (user as any).isAdmin
    };

    if (this.loggedUser.isAdmin) {
      this.router.navigate(['/admin']);
      return;
    }

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
