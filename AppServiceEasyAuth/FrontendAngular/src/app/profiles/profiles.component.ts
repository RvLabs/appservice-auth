import { Component, OnInit } from '@angular/core';
import { ProfileDataService } from './profile-data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {

  constructor(private ProfileDataService: ProfileDataService) { }

  profileData$: Observable<any>;
  userData$: Observable<any>;

  private resBody = "";

  ngOnInit() {

    this.userData$ = this.ProfileDataService.getMe();
    this.userData$.subscribe( res => {
      console.log(res);
      this.resBody = res.body;
      console.log("toke: " + res.body[0].access_token);
      this.getProfiles(res.body[0].access_token);
    });
  }

  getProfiles(token) {
    this.profileData$ = this.ProfileDataService.getProfiles(token);
    this.profileData$.subscribe( res => {
      console.log(res);
    });
  }

}
