import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { ProfileDataService } from './profiles/profile-data.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MsalModule, BroadcastService, MsalService, MsalInterceptor } from '@azure/msal-angular';
import { environment } from '../environments/environment';
import { LogLevel } from 'msal';

// Logger callback for MSAL
export function loggerCallback(logLevel, message, piiEnabled) {
  console.log(message);
}

export const protectedResourceMap:[string, string[]][]=[ 
  [environment.frontend.scope.endpoint,[environment.frontend.scope.consent]],
  [environment.backend.scope.endpoint, [environment.backend.scope.consent]]
];


@NgModule({
  declarations: [
    AppComponent,
    ProfilesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    HttpClientModule,
    MsalModule.forRoot ({
      clientID: environment.aad.clientID,
      authority: environment.aad.authority,
      consentScopes: [ environment.frontend.scope.consent, environment.backend.scope.consent ],
      protectedResourceMap: protectedResourceMap,
      logger: loggerCallback,
      level: LogLevel.Verbose,
      piiLoggingEnabled: true
    })
  ],
  providers: [
    ProfileDataService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
