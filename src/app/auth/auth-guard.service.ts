import * as fromApp from './../ngRxStore/app.reducer';
import { take, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router, private store: Store<fromApp.AppState>) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
                        : boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
        // return this.authService.user.pipe(
        return this.store.select('auth').pipe(
            take(1),
            map(authState => {
                return authState.user;
            }),
            map(user => {
                const hasUser = !!user;
                if (hasUser) {
                    return true;
                }
                return this.router.createUrlTree(['/auth']);
            })
        );
    }
}
