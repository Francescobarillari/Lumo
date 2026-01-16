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
import { EventChatModalComponent } from '../../../components/event-chat-modal/event-chat-modal';
import { MapLocationSelector } from '../../../components/map-location-selector/map-location-selector';
import { UserProfileModalComponent } from '../../../components/user-profile-modal/user-profile-modal.component';
import { Event as LumoEvent } from '../../../models/event';
import { EventService } from '../../../services/event.service';
import { UserService } from '../../../services/user-service/user-service';
import { ConfirmationService } from '../../../services/confirmation.service';

@Component({
  selector: 'Home',
  standalone: true,
  imports: [MapView, SignUpPopup, SignInPopup, VerifyEmailPopup, ActionBarComponent, CropImagePopup, CreateEventPopup, EventPopupCard, MapLocationSelector, UserProfileModalComponent, EventChatModalComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, AfterViewInit {

  @ViewChild(MapView) mapView!: MapView;

  showSignUp = false;
  showSignIn = false;
  showVerifyPopup = false;

  showCropPopup = false;
  selectedImageFile: File | null = null;

  showCreateEventPopup = false;
  showChatModal = false;
  showChatBackArrow = true;
  showLocationSelector = false;
  selectedEvent: LumoEvent | null = null;
  chatEvent: LumoEvent | null = null;
  private previousSelectedEvent: LumoEvent | null = null;
  eventScreenPosition: { x: number, y: number } | null = null;

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
    private userService: UserService,
    private confirmation: ConfirmationService
  ) { }

  ngOnInit() {
    this.refreshLocalUser();
    this.checkAdminRedirect();

    this.userService.userUpdates$.subscribe(() => {
      this.refreshUserFromBackend();
    });

    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const email = params['email'];
      const userId = params['user'];
      const eventId = params['event'];

      if (userId) {
        this.openUserProfile(userId);

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { user: null },
          queryParamsHandling: 'merge',
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
        console.error('Error parsing local user', e);
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
          name: user.name || user.email || 'User',
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
        console.error('Error resending verification email', err);
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
    this.showChatModal = false;
    this.showChatBackArrow = true;
    this.chatEvent = null;
    this.previousSelectedEvent = null;
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
    this.selectedEvent = event;

    this.updateCardPosition();

    if (this.mapView && this.mapView.map) {
      this.mapView.map.off('move', this.updateCardPosition.bind(this));
      this.mapView.map.on('move', this.updateCardPosition.bind(this));

      this.mapView.map.off('click', this.onMapClick.bind(this));
      this.mapView.map.on('click', this.onMapClick.bind(this));
    }

    const currentUserId = this.loggedUser ? this.loggedUser.id : undefined;

    this.eventService.getEventById(event.id, currentUserId).subscribe({
      next: (freshEvent) => {
        this.selectedEvent = freshEvent;
        this.updateCardPosition();
      },
      error: (err) => console.error('Error fetching fresh event data', err)
    });

    setTimeout(() => {
      document.addEventListener('click', this.onDocumentClick);
    }, 0);
  }

  openChat(event: LumoEvent, showBackArrow = false) {
    if (!this.loggedUser) {
      this.openSignIn();
      return;
    }
    if (this.selectedEvent) {
      this.previousSelectedEvent = this.selectedEvent;
      this.closeEventPopup();
    }
    this.chatEvent = event;
    this.showChatBackArrow = showBackArrow;
    this.showChatModal = true;
  }

  onChatNotification(eventId: number) {
    if (!this.loggedUser) {
      this.openSignIn();
      return;
    }
    this.eventService.getEventById(eventId, this.loggedUser.id).subscribe({
      next: (event) => {
        this.closeAll();
        this.openChat(event, true);
      },
      error: (err) => console.error('Error opening chat from notification', err)
    });
  }

  onUpcomingEventNotification(eventId: number) {
    const currentUserId = this.loggedUser ? this.loggedUser.id : undefined;
    this.eventService.getEventById(eventId, currentUserId).subscribe({
      next: (event) => {
        this.closeAll();
        if (this.mapView) {
          this.mapView.flyToEvent(event);
        }
      },
      error: (err) => console.error('Error opening event from notification', err)
    });
  }

  closeChat() {
    this.showChatModal = false;
    this.chatEvent = null;
    this.showChatBackArrow = true;
    if (this.previousSelectedEvent) {
      const eventToRestore = this.previousSelectedEvent;
      this.previousSelectedEvent = null;
      this.openEventPopup(eventToRestore);
    }
  }

  onEventsUpdated(newEvents: LumoEvent[]) {
    if (this.selectedEvent) {
      const updatedEvent = newEvents.find(e => e.id === this.selectedEvent!.id);
      if (updatedEvent) {
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
    if (e.defaultPrevented) return;
    this.closeEventPopup();
  }

  onDocumentClick = (event: MouseEvent) => {
    this.closeEventPopup();
  }

  closeEventPopup() {
    this.selectedEvent = null;
    this.eventScreenPosition = null;

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
      this.openSignIn();
      return;
    }

    console.log('Sending request for user:', this.loggedUser.id, 'event:', event.id);
    this.eventService.requestParticipation(event.id, this.loggedUser.id).subscribe({
      next: () => {
        console.log('Request success');
        if (this.selectedEvent && this.selectedEvent.id === event.id) {
          console.log('Updating local state to PENDING');
          this.selectedEvent.participationStatus = 'PENDING';
        }
      },
      error: (err) => console.error('Error requesting participation', err)
    });
  }

  async onLeaveEvent(event: LumoEvent) {
    if (!this.loggedUser) {
      this.openSignIn();
      return;
    }

    const confirmed = await this.confirmation.confirm({
      title: 'Leave event',
      message: 'Are you sure you want to leave the event?',
      confirmText: 'Leave',
      cancelText: 'Cancel'
    });
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

  async onDeleteEvent(event: LumoEvent) {
    if (!this.loggedUser) {
      this.openSignIn();
      return;
    }

    if (event.creatorId && event.creatorId.toString() !== this.loggedUser.id.toString()) {
      console.warn('You are not the eventer of this event');
      return;
    }

    const confirmed = await this.confirmation.confirm({
      title: 'Delete event',
      message: 'Are you sure you want to delete this event? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      tone: 'danger'
    });
    if (!confirmed) return;

    this.eventService.deleteEvent(event.id).subscribe({
      next: () => {
        if (this.mapView) {
          this.mapView.events = this.mapView.events.filter(e => e.id !== event.id);
          this.mapView.loadEvents?.();
        }
        this.closeEventPopup();
      },
      error: (err) => console.error('Error deleting event', err)
    });
  }

  onToggleFavorite() {
    if (this.selectedEvent && this.mapView) {
      this.mapView.onToggleFavorite(this.selectedEvent);
    }
  }

  openShare(event: LumoEvent) {
    if (!this.mapView) return;
    this.mapView.openShare(event);
  }

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
      name: user?.name || user?.email || 'User',
      email: user?.email || '',
      profileImage: (user as any).profileImage,
      isAdmin: (user as any).isAdmin
    };

    if (this.loggedUser.isAdmin) {
      this.router.navigate(['/admin']);
      return;
    }

    this.refreshUserFromBackend();

    this.closeAll();
  }

  logout() {
    this.loggedUser = null;
    localStorage.removeItem('user');
    this.closeAll();
  }

  onMenuAction(action: string) {
    console.log('Menu action:', action);
    if (action === 'logout') {
      this.logout();
    } else if (action === 'change-photo') {
      const fileInput = document.getElementById('hiddenFileInput') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    } else if (action === 'account') {
      console.log('Navigate to Account');
    } else if (action === 'events') {
      console.log('Navigate to Events');
    } else if (action === 'add-event') {
      console.log('Create Event clicked');
      this.showCreateEventPopup = true;
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
      this.showCropPopup = true;
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

  onFocusEventFromMenu(event: LumoEvent) {
    if (this.mapView) {
      this.mapView.flyToEvent(event);
    }
  }

  onFocusEventFromProfile(event: LumoEvent) {
    this.closeAll();
    if (this.mapView) {
      this.mapView.flyToEvent(event);
    }
  }
}
