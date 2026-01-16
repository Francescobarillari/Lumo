import { Component, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Environment } from '../../environment/environment';
import * as mapboxgl from 'mapbox-gl';
import { MapboxService } from '../../services/mapbox.service';

@Component({
    selector: 'map-location-selector',
    standalone: true,
    imports: [CommonModule, FormsModule, MatIconModule],
    templateUrl: './map-location-selector.html',
    styleUrl: './map-location-selector.css'
})
export class MapLocationSelector implements AfterViewInit, OnDestroy {
    @Output() locationSelected = new EventEmitter<{ lat: number, lng: number }>();
    @Output() close = new EventEmitter<void>();

    private map!: mapboxgl.Map;
    selectedMarker: mapboxgl.Marker | null = null;
    selectedCoords: [number, number] | null = null;

    searchQuery: string = '';
    cityResults: { name: string, center: [number, number] }[] = [];

    constructor(private mapboxService: MapboxService) { }

    ngAfterViewInit(): void {
        this.map = new mapboxgl.Map({
            accessToken: Environment.mapboxToken,
            container: 'location-map',
            style: 'mapbox://styles/fnsbrl/cmhxy97pz004e01qx08c0gc44',
            center: [12.4964, 41.9028],
            zoom: 12,
            pitch: 0,
            bearing: 0,
        });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords: [number, number] = [
                        position.coords.longitude,
                        position.coords.latitude
                    ];

                    this.map.flyTo({
                        center: coords,
                        zoom: 17,
                        duration: 1000
                    });
                },
                (error) => console.warn('Geolocation error:', error)
            );
        }

        this.map.on('click', (e) => {
            this.selectedCoords = [e.lngLat.lng, e.lngLat.lat];

            if (this.selectedMarker) {
                this.selectedMarker.remove();
            }

            const markerEl = document.createElement('div');
            markerEl.style.width = '30px';
            markerEl.style.height = '30px';
            markerEl.style.backgroundColor = '#FCC324';
            markerEl.style.borderRadius = '50%';
            markerEl.style.border = '3px solid white';
            markerEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';

            this.selectedMarker = new mapboxgl.Marker({ element: markerEl })
                .setLngLat(this.selectedCoords)
                .addTo(this.map);
        });
    }

    onSearch() {
        if (!this.searchQuery || this.searchQuery.trim() === '') {
            this.cityResults = [];
            return;
        }

        this.mapboxService.searchCity(this.searchQuery).subscribe(features => {
            this.cityResults = features.map(f => ({
                name: f.place_name,
                center: f.center
            }));
        });
    }

    selectCity(city: { name: string, center: [number, number] }) {
        this.map.flyTo({
            center: city.center,
            zoom: 16,
            essential: true
        });
        this.searchQuery = '';
        this.cityResults = [];
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
