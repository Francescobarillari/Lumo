import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Environment } from '../../environment/environment';
import * as mapboxgl from 'mapbox-gl';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event';
import { MatIconModule } from '@angular/material/icon';

// crea l'elemento HTML per il marker della posizione utente
const userMarkerEl = document.createElement('div');
userMarkerEl.style.width = '20px';
userMarkerEl.style.height = '20px';
userMarkerEl.style.backgroundColor = '#4285F4';
userMarkerEl.style.border = '3px solid white';
userMarkerEl.style.borderRadius = '50%';
userMarkerEl.style.boxShadow = '0 0 3px rgba(0,0,0,0.3)';

import { SidebarComponent } from '../sidebar/sidebar.component';

// componente per la visualizzazione della mappa
@Component({
  selector: 'MapView',
  template: `
    <app-sidebar
      [events]="events"
      [collapsed]="sidebarCollapsed"
      (focusEvent)="flyToEvent($event)"
      (toggleSidebar)="toggleSidebar()"
    ></app-sidebar>
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
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: box-shadow 0.2s ease, transform 0.1s ease;
    z-index: 1100;
  }

  .locate-btn:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }

  .locate-btn:active {
    transform: scale(0.96);
  }

  .locate-btn mat-icon {
    color: #1a1a1a;
  }

  :host ::ng-deep .mapboxgl-popup.event-popup .mapboxgl-popup-content {
    background: #1a1a1a;
    color: #f5f5f5;
    border: 1px solid #2c2c2c;
    box-shadow: 0 4px 12px rgba(0,0,0,0.35);
    border-radius: 10px;
  }

  :host ::ng-deep .mapboxgl-popup.event-popup .mapboxgl-popup-content strong {
    color: #fbbc04;
  }

  :host ::ng-deep .mapboxgl-popup.event-popup .mapboxgl-popup-tip {
    border-top-color: #1a1a1a;
  }
  `,
  standalone: true,
  imports: [SidebarComponent, MatIconModule]
})

// classe del componente MapView
export class MapView implements AfterViewInit, OnDestroy {
  private map!: mapboxgl.Map;
  private eventMarkers = new Map<number, mapboxgl.Marker>();
  events: Event[] = [];
  private userCoords: [number, number] | null = null;
  sidebarCollapsed = false;

  constructor(private eventService: EventService) {}

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      accessToken: Environment.mapboxToken,
      container: 'map',
      style: 'mapbox://styles/fnsbrl/cmhxy97pz004e01qx08c0gc44',
      center: [12.4964, 41.9028],
      zoom: 18,
      pitch: 60,
      bearing: -20,
      antialias: true,
    });

    //modifiche alle gesture con il trackpad per la mappa
    this.map.dragPan.enable();

    this.map.touchZoomRotate.enable({ around: 'center' });

    this.map.touchZoomRotate.disableRotation();

    this.map.touchZoomRotate.enable();

    // Richiedi la posizione dell'utente
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userCoords = [
            position.coords.longitude,
            position.coords.latitude
          ];

          // centra la mappa sulla posizione dell'utente
          this.map.setCenter(this.userCoords);

          // aggiungi marker sulla posizione dell'utente
          new mapboxgl.Marker({ element: userMarkerEl })
            .setLngLat(this.userCoords)
            .addTo(this.map);

          this.updateDistancesAndSort();
          this.placeEventMarkers();
        },
        //nel caso di errore nella geolocalizzazione
        (error) => {
          console.warn('Geolocation error:', error);
        },
        { enableHighAccuracy: true }
      );
    }

    this.loadEvents();
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
    this.eventMarkers.forEach((marker) => marker.remove());
  }

  private loadEvents() {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
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

      const marker = new mapboxgl.Marker({ color: '#fbbc04' })
        .setLngLat([event.longitude, event.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25, className: 'event-popup' }).setHTML(
            `<strong>${event.title}</strong><br>${event.city || ''}<br>${this.formatDateTime(event)}${this.buildDistanceRow(event)}`
          )
        )
        .addTo(this.map);

      if (typeof event.id === 'number') {
        this.eventMarkers.set(event.id, marker);
      }
    });
  }

  flyToEvent(event: Event) {
    if (!this.map || event.longitude == null || event.latitude == null) return;

    this.map.flyTo({
      center: [event.longitude, event.latitude],
      zoom: 15,
      essential: true,
      duration: 800 // render the fly-to quicker
    });

    if (typeof event.id === 'number') {
      const marker = this.eventMarkers.get(event.id);
      marker?.togglePopup();
    }
  }

  private formatDateTime(event: Event): string {
    const date = event.date ? new Date(`${event.date}T00:00:00`) : null;
    const start = event.startTime ? event.startTime.slice(0, 5) : '';
    const end = event.endTime ? event.endTime.slice(0, 5) : '';

    const datePart = date
      ? date.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })
      : '';
    const timePart = start && end ? `${start} - ${end}` : start || end;

    return [datePart, timePart].filter(Boolean).join(' | ');
  }

  flyToUser() {
    if (!this.map) return;

    if (this.userCoords) {
      this.map.flyTo({
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
          this.map.flyTo({
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

  private buildDistanceRow(event: Event): string {
    const distance = this.formatDistance(event.distanceKm);
    return distance ? `<br><em>${distance}</em>` : '';
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
