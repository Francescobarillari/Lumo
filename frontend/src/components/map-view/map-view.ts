import { Component, AfterViewInit, ElementRef, ViewChild, Output, EventEmitter, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Environment } from '../../environment/environment';
import * as mapboxgl from 'mapbox-gl';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { interval, Subscription, switchMap } from 'rxjs';
import { MobileSearchComponent } from '../mobile-search/mobile-search.component';
import { ManagedEventsPopup } from '../managed-events-popup/managed-events-popup.component';

// crea l'elemento HTML per il marker della posizione utente
const userMarkerEl = document.createElement('div');
userMarkerEl.style.width = '20px';
userMarkerEl.style.height = '20px';
userMarkerEl.style.backgroundColor = '#4285F4';
userMarkerEl.style.border = '3px solid white';
userMarkerEl.style.borderRadius = '50%';
userMarkerEl.style.boxShadow = '0 0 3px rgba(0,0,0,0.3)';

@Component({
  selector: 'map-view',
  template: `
  <app-sidebar
    [events]="events"
    [collapsed]="sidebarCollapsed"
    [userId]="userId"
    (focusEvent)="flyToEvent($event)"
    (toggleSidebar)="toggleSidebar()"
    (toggleFavorite)="onToggleFavorite($event)"
    (foundLocation)="flyToLocation($event)"
    (openUserProfile)="openUserProfile.emit($event)">
  </app-sidebar>

  <app-mobile-search
    [userId]="userId"
    (focusEvent)="flyToEvent($event)"
    (foundLocation)="flyToLocation($event)"
    (toggleFavorite)="onToggleFavorite($event)"
    (openUserProfile)="openUserProfile.emit($event)">
  </app-mobile-search>

  <app-managed-events-popup
    *ngIf="managedPopupType"
    [title]="managedPopupType === 'saved' ? 'Eventi Salvati' : 'Eventi a cui partecipi'"
    [events]="getManagedEvents()"
    (close)="managedPopupType = null"
    (focusEvent)="flyToEvent($event)"
    (toggleFavorite)="onToggleFavorite($event)">
  </app-managed-events-popup>

  <div id="map" class="map-container"></div>
  
  <button class="locate-btn" (click)="flyToUser()">
    <mat-icon>my_location</mat-icon>
  </button>
  `,
  styles: `
  .map-container {
    width: 100%;
    height: 100vh;
  }

  .locate-btn {
    position: absolute;
    right: 20px;
    bottom: 20px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: none;
    background: var(--color-dark-gray);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: box-shadow 0.2s ease, transform 0.1s ease, background-color 0.2s;
  }

  .locate-btn:hover {
    background: #333;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .locate-btn:active {
    transform: scale(0.96);
  }

  .locate-btn mat-icon {
    color: var(--color-white);
  }

  app-mobile-search {
    display: none;
  }

  @media (max-width: 767px) {
    app-mobile-search {
      display: block;
    }
  }

  :host ::ng-deep .mapboxgl-popup.event-popup .mapboxgl-popup-content {
    background: var(--color-dark-gray);
    color: #f5f5f5;
    border: 1px solid var(--color-gray);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
    border-radius: 10px;
  }

  :host ::ng-deep .mapboxgl-popup.event-popup .mapboxgl-popup-content strong {
    color: #fbbc04;
  }

  :host ::ng-deep .mapboxgl-popup.event-popup .mapboxgl-popup-tip {
    border-top-color: var(--color-dark-gray);
  }
  `,
  standalone: true,
  imports: [SidebarComponent, MobileSearchComponent, ManagedEventsPopup, MatIconModule, MatSnackBarModule, CommonModule],
})
export class MapView implements AfterViewInit, OnDestroy, OnChanges {
  @Input() userId: string | null = null;
  @Output() eventSelected = new EventEmitter<Event>();
  @Output() mapInteract = new EventEmitter<void>();
  @Output() eventsUpdated = new EventEmitter<Event[]>(); // Emit when events list updates
  @Output() openUserProfile = new EventEmitter<string>(); // Emit when user profile requested

  private mapInstance!: mapboxgl.Map;
  private eventMarkers = new Map<number, mapboxgl.Marker>();
  events: Event[] = [];
  private userCoords: [number, number] | null = null;
  sidebarCollapsed = false;
  managedPopupType: 'saved' | 'participating' | null = null;
  @ViewChild(SidebarComponent) sidebar!: SidebarComponent;
  @ViewChild(MobileSearchComponent) mobileSearch!: MobileSearchComponent;

  private pollSubscription: Subscription | null = null;

  constructor(private eventService: EventService, private snackBar: MatSnackBar) { }

  get map(): mapboxgl.Map {
    return this.mapInstance;
  }

  getEventScreenPosition(event: Event): { x: number, y: number } | null {
    if (!event.latitude || !event.longitude || !this.mapInstance) return null;
    const point = this.mapInstance.project([event.longitude, event.latitude]);
    return { x: point.x, y: point.y };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && !changes['userId'].isFirstChange()) {
      this.resetSearch();
      this.loadEvents();
      this.startPolling();
    }
  }

  resetSearch() {
    if (this.sidebar) this.sidebar.clearSearch();
    if (this.mobileSearch) this.mobileSearch.clearSearch();
  }

  ngAfterViewInit(): void {
    this.mapInstance = new mapboxgl.Map({
      accessToken: Environment.mapboxToken,
      container: 'map',
      style: 'mapbox://styles/fnsbrl/cmhxy97pz004e01qx08c0gc44',
      center: [12.4964, 41.9028],
      zoom: 18,
      pitch: 60,
      bearing: -20,
      antialias: true,
    });

    this.mapInstance.dragPan.enable();
    this.mapInstance.touchZoomRotate.enable({ around: 'center' });
    this.mapInstance.touchZoomRotate.disableRotation();
    this.mapInstance.touchZoomRotate.enable();

    // Listen for interactions to verify close popups only on USER interaction
    this.mapInstance.on('move', (e) => {
      if (e.originalEvent) { // Check if movement was caused by user (mouse/touch)
        this.mapInteract.emit();
      }
    });
    this.mapInstance.on('click', (e) => {
      if (e.originalEvent) {
        this.mapInteract.emit();
      }
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userCoords = [
            position.coords.longitude,
            position.coords.latitude
          ];
          this.mapInstance.setCenter(this.userCoords);

          new mapboxgl.Marker({ element: userMarkerEl })
            .setLngLat(this.userCoords)
            .addTo(this.map);

          this.updateDistancesAndSort();
          this.placeEventMarkers();
        },
        (error) => {
          console.warn('Geolocation error:', error);
        },
        { enableHighAccuracy: true }
      );
    }

    this.loadEvents();
    this.startPolling();
  }

  ngOnDestroy(): void {
    if (this.map) this.mapInstance.remove();
    this.eventMarkers.forEach((marker) => marker.remove());
    this.stopPolling();
  }

  private startPolling() {
    this.stopPolling(); // Clear existing
    this.pollSubscription = interval(10000).pipe( // Poll every 10s
      switchMap(() => this.eventService.getEvents(this.userId || undefined))
    ).subscribe({
      next: (events) => {
        this.handleEventsUpdate(events);
      },
      error: (err) => console.error('Error polling events', err)
    });
  }

  private stopPolling() {
    if (this.pollSubscription) {
      this.pollSubscription.unsubscribe();
      this.pollSubscription = null;
    }
  }

  private isFutureEvent(event: Event): boolean {
    if (!event.date) return true;
    const end = event.endTime || event.startTime || '23:59';
    const eventDateTime = new Date(`${event.date}T${end}`);
    return eventDateTime.getTime() >= Date.now();
  }

  private handleEventsUpdate(events: Event[]) {
    const filteredEvents = events.filter((e) => this.isFutureEvent(e));

    // Check for changes (lazy check by length or deep compare if needed)
    // For now, update if length differs OR map markers check
    // To properly support "status change" (e.g. participation), we should probably deep check or just update.
    // Updating always might flicker but ensures data freshness.
    // Let's implement a simple check: if JSON stringify is different.
    const currentEventsJson = JSON.stringify(this.events.map(e => ({ id: e.id, status: e.participationStatus })));
    const newEventsJson = JSON.stringify(filteredEvents.map(e => ({ id: e.id, status: e.participationStatus })));

    // If we only care about participation status or new events:
    if (this.events.length !== filteredEvents.length || currentEventsJson !== newEventsJson) {
      this.events = filteredEvents;
      this.updateDistancesAndSort();
      this.placeEventMarkers();
      this.eventsUpdated.emit(this.events); // Emit update
    }
  }

  loadEvents() {
    this.eventService.getEvents(this.userId || undefined).subscribe({
      next: (events) => {
        this.events = events.filter((e) => this.isFutureEvent(e));

        this.updateDistancesAndSort();
        this.placeEventMarkers();
      },
      error: (err) => {
        console.error('Errore nel recupero degli eventi', err);
      }
    });
  }

  private placeEventMarkers() {
    this.eventMarkers.forEach((marker) => marker.remove());
    this.eventMarkers.clear();

    this.events.forEach((event) => {
      if (event.latitude == null || event.longitude == null) return;

      const markerEl = document.createElement('div');
      markerEl.style.width = '30px';
      markerEl.style.height = '30px';
      markerEl.style.backgroundColor = '#FCC324';
      markerEl.style.borderRadius = '50%';
      markerEl.style.cursor = 'pointer';
      markerEl.style.border = '3px solid white';
      markerEl.style.boxShadow = '0 3px 10px rgba(252, 195, 36, 0.6), 0 0 20px rgba(252, 195, 36, 0.3)';

      const marker = new mapboxgl.Marker({ element: markerEl })
        .setLngLat([event.longitude, event.latitude])
        .addTo(this.map);

      markerEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.flyToEvent(event);
      });

      if (typeof event.id === 'number') {
        this.eventMarkers.set(event.id, marker);
      }
    });
  }

  flyToEvent(event: Event) {
    if (!this.map || event.longitude == null || event.latitude == null) return;

    this.mapInstance.flyTo({
      center: [event.longitude, event.latitude],
      zoom: 18,
      essential: true,
      duration: 1000
    });

    this.eventSelected.emit(event);
  }

  flyToLocation(coords: { lat: number, lng: number }) {
    if (!this.map) return;
    this.mapInstance.flyTo({
      center: [coords.lng, coords.lat],
      zoom: 17,
      essential: true,
      duration: 1500
    });
  }

  flyToUser() {
    if (!this.map) return;

    if (this.userCoords) {
      this.mapInstance.flyTo({
        center: this.userCoords,
        zoom: 16,
        essential: true,
        duration: 800
      });
      this.updateDistancesAndSort();
      this.placeEventMarkers();
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userCoords = [
            position.coords.longitude,
            position.coords.latitude
          ];
          this.mapInstance.flyTo({
            center: this.userCoords,
            zoom: 16,
            essential: true,
            duration: 800
          });
          new mapboxgl.Marker({ element: userMarkerEl })
            .setLngLat(this.userCoords)
            .addTo(this.map);
          this.updateDistancesAndSort();
          this.placeEventMarkers();
        },
        (error) => console.warn('Geolocation error:', error),
        { enableHighAccuracy: true }
      );
    }
  }

  private updateDistancesAndSort() {
    if (!this.userCoords || !this.events.length) return;
    const [userLng, userLat] = this.userCoords;

    this.events = this.events
      .map((event) => ({
        ...event,
        distanceKm: this.computeDistanceKm(userLat, userLng, event.latitude, event.longitude)
      }))
      .sort((a, b) => (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY));
  }

  private computeDistanceKm(lat1: number, lon1: number, lat2?: number, lon2?: number): number | undefined {
    if (lat2 == null || lon2 == null) return undefined;
    const R = 6371; // km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private formatDistance(distanceKm?: number): string {
    if (distanceKm == null) return '';
    if (distanceKm < 1) return `${(distanceKm * 1000).toFixed(0)} m`;
    return `${distanceKm.toFixed(1)} km`;
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  @Output() requestLogin = new EventEmitter<void>();

  onToggleFavorite(event: Event) {
    if (!this.userId) {
      const snackBarRef = this.snackBar.open('Per salvare gli eventi devi effettuare l\'accesso.', 'ACCEDI', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['login-snackbar']
      });

      snackBarRef.onAction().subscribe(() => {
        this.requestLogin.emit();
      });
      return;
    }

    if (!event.id) return;

    this.eventService.toggleSavedEvent(this.userId, event.id).subscribe({
      next: (res) => {
        // Aggiorna lo stato locale dell'evento
        event.isSaved = res.isSaved;

        // Forza l'aggiornamento della Sidebar (che usa OnChanges) ricreando l'array
        this.events = [...this.events];

        // Se necessario, aggiorniamo anche i marker o altro (ma i marker non cambiano per 'saved')
      },
      error: (err) => console.error('Errore nel toggle preferito', err)
    });
  }

  getManagedEvents(): Event[] {
    if (this.managedPopupType === 'saved') {
      return this.events.filter(e => e.isSaved);
    } else if (this.managedPopupType === 'participating') {
      return this.events.filter(e => e.isParticipating);
    }
    return [];
  }
}
