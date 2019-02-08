import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RouteGuardService } from './app-route-guard.service';
import { SongsComponent } from './songs/songs.component';

const routes: Routes = [
  { path: '', component: SongsComponent, canActivate: [RouteGuardService]},
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
