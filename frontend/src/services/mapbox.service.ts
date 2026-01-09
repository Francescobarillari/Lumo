import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '../environment/environment';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MapboxService {
    private apiUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

    constructor(private http: HttpClient) { }

    searchCity(query: string): Observable<any[]> {
        const url = `${this.apiUrl}/${encodeURIComponent(query)}.json`;
        const params = {
            access_token: Environment.mapboxToken,
            types: 'place,locality', // Restrict to cities/localities
            limit: '5', // Increase limit as requested
            language: 'it'
        };

        return this.http.get(url, { params }).pipe(
            map((response: any) => {
                if (response.features && response.features.length > 0) {
                    return response.features;
                }
                return [];
            })
        );
    }

    reverseGeocode(lat: number, lng: number): Observable<string | null> {
        const url = `${this.apiUrl}/${lng},${lat}.json`;
        const params = {
            access_token: Environment.mapboxToken,
            types: 'place,locality',
            limit: '1',
            language: 'it'
        };

        return this.http.get(url, { params }).pipe(
            map((response: any) => {
                const features = response?.features || [];
                const placeFeature = features.find((f: any) => (f.place_type || []).includes('place')) || features[0];
                return placeFeature?.text || placeFeature?.place_name || null;
            })
        );
    }
}
