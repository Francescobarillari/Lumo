import { Component, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Environment } from '../../environment/environment';
import * as mapboxgl from 'mapbox-gl';

@Component({
    selector: 'map-location-selector',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './map-location-selector.html',
    styleUrl: './map-location-selector.css'
})
export class MapLocationSelector implements AfterViewInit, OnDestroy {
    @Output() locationSelected = new EventEmitter<{ lat: number, lng: number }>();
    @Output() close = new EventEmitter<void>();

    private map!: mapboxgl.Map;
    selectedMarker: mapboxgl.Marker | null = null;
    selectedCoords: [number, number] | null = null;

    ngAfterViewInit(): void {
        this.map = new mapboxgl.Map({
            accessToken: Environment.mapboxToken,
            container: 'location-map',
            style: 'mapbox://styles/fnsbrl/cmhxy97pz004e01qx08c0gc44',
            center: [12.4964, 41.9028], // Rome as default
            zoom: 16,
            pitch: 0,
            bearing: 0,
        });

        // Get user location if available
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords: [number, number] = [
                        position.coords.longitude,
                        position.coords.latitude
                    ];

                    // Add user position marker
                    const userMarkerEl = document.createElement('div');
                    userMarkerEl.style.width = '20px';
                    userMarkerEl.style.height = '20px';
                    userMarkerEl.style.backgroundColor = '#4285F4';
                    userMarkerEl.style.border = '3px solid white';
                    userMarkerEl.style.borderRadius = '50%';
                    userMarkerEl.style.boxShadow = '0 0 6px rgba(0,0,0,0.4)';

                    new mapboxgl.Marker({ element: userMarkerEl })
                        .setLngLat(coords)
                        .addTo(this.map);

                    this.map.flyTo({
                        center: coords,
                        zoom: 16,
                        duration: 1000
                    });
                },
                (error) => console.warn('Geolocation error:', error)
            );
        }

        // Handle map clicks
        this.map.on('click', (e) => {
            this.selectedCoords = [e.lngLat.lng, e.lngLat.lat];

            // Remove previous marker if exists
            if (this.selectedMarker) {
                this.selectedMarker.remove();
            }

            // Create marker element
            const markerEl = document.createElement('div');
            markerEl.style.width = '30px';
            markerEl.style.height = '30px';
            markerEl.style.backgroundColor = '#FCC324';
            markerEl.style.borderRadius = '50%';
            markerEl.style.border = '3px solid white';
            markerEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';

            // Add marker to map
            this.selectedMarker = new mapboxgl.Marker({ element: markerEl })
                .setLngLat(this.selectedCoords)
                .addTo(this.map);
        });
    }

    ngOnDestroy(): void {
        if (this.map) this.map.remove();
    }

    onConfirm() {
        if (this.selectedCoords) {
            this.locationSelected.emit({
                lat: this.selectedCoords[1],
                lng: this.selectedCoords[0]
            });
        }
    }

    onClose() {
        this.close.emit();
    }
}
