import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfilesComponent } from './profiles/profiles.component';
import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  { path: 'profiles', component: ProfilesComponent, canActivate: [MsalGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
