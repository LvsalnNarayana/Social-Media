import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthHandler } from './socket/auth-handler.service';
import { Socket } from './socket/socket.service';
import { StateVariablesService } from './socket/state-variables.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad {
  constructor(
    private router: Router,
    private state: StateVariablesService,
    private Socket: Socket,
    private AuthHandler: AuthHandler
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.AuthHandler.GET_auth_status()
    return this.Socket.listen('GET_auth_status_response').pipe(map((data: any) => {
      switch (data.auth_status) {
        case false:
          this.router.navigate(['/user/login'])
          return false
        case true:
          return true
        default:
          return false
      }
    }))
    // return this.AuthService.get_auth_status2().pipe(map((data) => {
    //   switch (data) {
    //     case false:
    //       this.router.navigate(['/user/login']);
    //       return false
    //     case true:
    //       return true
    //     default:
    //       return false
    //   }
    // }))
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
}
