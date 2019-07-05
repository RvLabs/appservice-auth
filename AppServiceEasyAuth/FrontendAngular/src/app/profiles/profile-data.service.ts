import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileDataService {

  httpHeaders = new HttpHeaders({
    'Accept':  'application/json'
  });

  constructor(private http: HttpClient) { }

  getProfiles(token): Observable<any> {
    return this.http.get('https://allmat-backend-api.azurewebsites.net/api/profiles', {headers: { 'Authorization': 'Bearer ' + token}, observe: 'response'});
  }

  getMe(): Observable<any> {
    return this.http.get('/.auth/me', {observe: 'response'});
  }
}
