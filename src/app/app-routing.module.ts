import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RouteGuardService } from './app-route-guard.service';
import { SongsComponent } from './songs/songs.component';
import { AddUserComponent } from './user/add-user.component';

const routes: Routes = [
  { path: '', component: SongsComponent, canActivate: [RouteGuardService]},
  { path: 'login', component: LoginComponent },
  { path: 'add', component: AddUserComponent, canActivate: [RouteGuardService]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
