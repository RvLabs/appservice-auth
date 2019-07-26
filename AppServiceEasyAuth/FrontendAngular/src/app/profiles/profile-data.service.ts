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
    return this.http.get('https://ea-backapi.azurewebsites.net/api/profiles', {headers: { 'Authorization': 'Bearer ' + token}, observe: 'response'});
  }

  getMe(): Observable<any> {
    return this.http.get('/.auth/me', {observe: 'response'});
  }

  getRefresh(): Observable<any> {
    return this.http.get('/.auth/refresh', {observe: 'response'});
  }

  logOut(): Observable<any> {
    return this.http.get('/.auth/logout?post_logout_redirect_uri=/', {observe: 'response'});
  }
}
