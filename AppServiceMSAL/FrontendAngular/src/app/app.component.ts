import { Component, OnDestroy, OnInit } from '@angular/core';
import { MsalService, BroadcastService} from "@azure/msal-angular";
import { Subscription } from 'rxjs/Subscription';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  loggedIn : boolean;
  public userInfo: any = null;
  private subscription: Subscription;
  public isIframe: boolean;

  constructor(private broadcastService: BroadcastService , private authService : MsalService)
  {
    //  This is to avoid reload during acquireTokenSilent() because of hidden iframe
    this.isIframe = window !== window.parent && !window.opener;
    if(this.authService.getUser())
      {
        this.loggedIn = true;
      }
    else {
      this.loggedIn = false;
    }
  }

  login()
  {
    this.authService.loginRedirect([
      //environment.graph.scope.consent, 
      environment.frontend.scope.consent,
      environment.backend.scope.consent
    ]);
  }

  logout()
  {
    this.authService.logout();
  }

  ngOnInit() {

    this.broadcastService.subscribe("msal:loginFailure", (payload) => {
      console.log("login failure " + JSON.stringify(payload));
      this.loggedIn = false;

    });

    this.broadcastService.subscribe("msal:loginSuccess", (payload) => {
      console.log("login success " + JSON.stringify(payload));
      this.loggedIn = true;
    });
    console.log("user info -- " + JSON.stringify(this.authService.getUser()));

  }

  ngOnDestroy() {
    this.broadcastService.getMSALSubject().next(1);
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
}
