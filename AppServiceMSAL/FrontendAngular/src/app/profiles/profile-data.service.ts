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
    return this.http.get(environment.apps.backend.url, 
                          {headers: {'Authorization': 'Bearer ' + token, 'X-ZUMO-AUTH': token}, 
                          observe: 'response'});
  }

}
