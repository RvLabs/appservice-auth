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

  /*
    Ideally, we would use HTTP interceptors to add the headers below to all API calls.
    MSAL for angular should add the access token to the request header automatically, this is for experimentation
  */
  getProfiles(token): Observable<any> {
    return this.http.get(environment.apps.backend.url, 
                          {headers: {'Authorization': 'Bearer ' + token, 'X-ZUMO-AUTH': token}, 
                          observe: 'response'});
  }

}
