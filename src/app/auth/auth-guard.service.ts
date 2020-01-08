import { User } from './../shared/user.model';
import { take, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router, UrlTree } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {

        return this.authService.user.pipe(
            take(1),
            map((user: User) => {
                const hasUser = !!user;
                if (hasUser) {
                    return true;
                }
                return this.router.createUrlTree(['/auth']);
            })
        );
    }
}
