import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProfileDataService } from './profile-data.service';
import { Observable, Subscription } from 'rxjs';
import { MsalService, BroadcastService } from '@azure/msal-angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {

  constructor(private ProfileDataService: ProfileDataService, private broadcastService : BroadcastService, private msalService: MsalService) { }

  profileData$: Observable<any>;
  private subscription: Subscription;

  ngOnInit() {

    this.msalService.acquireTokenSilent([environment.apps.backend.scope.consent]).then( (tok) => { 
        console.log("rb-token: " + tok);
        this.getProfiles(tok);
      }, (error) => {
        console.log("rv-error: " + error);
    });
    
    
    this.subscription = this.broadcastService.subscribe("msal:acquireTokenFailure", (payload) => {
      console.log("acquire token failure - First try: " + JSON.stringify(payload));

    });

    this.subscription = this.broadcastService.subscribe("msal:acquireTokenSuccess", (payload) => {
      console.log("acquire token success");
      console.log("payload: " + JSON.stringify(payload));
    });
  }

  public getProfiles(token)
  {
    this.profileData$ = this.ProfileDataService.getProfiles(token);
    this.profileData$.subscribe( res => {
      console.log(res);
    });
  }

  ngOnDestroy() 
  {
    this.broadcastService.getMSALSubject().next(1);
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
