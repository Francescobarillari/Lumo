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
}
