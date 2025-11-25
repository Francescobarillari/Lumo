import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Environment } from '../../environment/environment';
import * as mapboxgl from 'mapbox-gl';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event';

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
    <app-sidebar [events]="events" (focusEvent)="flyToEvent($event)"></app-sidebar>
    <div id="map" class="map-container"></div>
  `,
  styles: `
  .map-container {
    width: 100%;
    height: 100vh;
  }`,
  standalone: true,
  imports: [SidebarComponent]
})

// classe del componente MapView
export class MapView implements AfterViewInit, OnDestroy {
  private map!: mapboxgl.Map;
  private eventMarkers = new Map<number, mapboxgl.Marker>();
  events: Event[] = [];

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
          const userCoords: [number, number] = [
            position.coords.longitude,
            position.coords.latitude
          ];

          // centra la mappa sulla posizione dell'utente
          this.map.setCenter(userCoords);

          // aggiungi marker sulla posizione dell'utente
          new mapboxgl.Marker({ element: userMarkerEl })
            .setLngLat(userCoords)
            .addTo(this.map);
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
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<strong>${event.title}</strong><br>${event.city || ''}<br>${this.formatDateTime(event)}`
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
      essential: true
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
}
