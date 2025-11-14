import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { Environment } from '../../environment/environment';
import * as mapboxgl from 'mapbox-gl';

// crea l'elemento HTML per il marker della posizione utente
const userMarkerEl = document.createElement('div');
userMarkerEl.style.width = '20px'; 
userMarkerEl.style.height = '20px';
userMarkerEl.style.backgroundColor = '#4285F4'; 
userMarkerEl.style.border = '3px solid white'; 
userMarkerEl.style.borderRadius = '50%'; 
userMarkerEl.style.boxShadow = '0 0 3px rgba(0,0,0,0.3)';

// componente per la visualizzazione della mappa
@Component({
  selector: 'MapView',
  template: `<div id="map" class="map-container"></div>`,
  styles: `
  .map-container {
    width: 100%;
    height: 100vh;
  }`,
  standalone: true
})

// classe del componente MapView
export class MapView implements AfterViewInit, OnDestroy {
  private map!: mapboxgl.Map;

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
        accessToken: Environment.mapboxToken,
        container: 'map',
        style: 'mapbox://styles/fnsbrl/cmhxy97pz004e01qx08c0gc44',
        center: [12.4964, 41.9028],
        zoom: 13,
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
  }

  ngOnDestroy(): void {
    if (this.map) this.map.remove();
  }
}

