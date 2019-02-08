import { AuthService } from './auth/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';

@Injectable({ providedIn: 'root' })
export class RouteGuardService implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.auth.isAuthenticated().pipe(map(user  => {
      if (isNullOrUndefined(user)) {
        this.router.navigate(['/login'], {
          queryParams: {
            return: state.url
          }
        });
        return false;
      } else {
        return true;
      }
    }));
  }
}
