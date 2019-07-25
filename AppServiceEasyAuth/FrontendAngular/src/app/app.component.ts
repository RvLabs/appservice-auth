import { Component, OnInit } from '@angular/core';
import { ProfileDataService } from './profiles/profile-data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(private ProfileDataService: ProfileDataService) { };

  userData$: Observable<any>;
  tokRefresh$: Observable<any>;

  ngOnInit() {

    this.userData$ = this.ProfileDataService.getMe();
    this.userData$.subscribe( res => {
      console.log(res);
    });
  }

  tokenRefresh() {
    this.tokRefresh$ = this.ProfileDataService.getRefresh();
    this.tokRefresh$.subscribe( res => {
      console.log("REFRESH: " = res );
    })

  }
}
