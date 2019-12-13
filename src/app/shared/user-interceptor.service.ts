import * as fromApp from './../ngRxStore/app.reducer';
import { User } from './user.model';
import { take, exhaustMap, map } from 'rxjs/operators';
import { AuthService } from './../auth/auth.service';

import { Observable } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable()
export class UserInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService, private store: Store<fromApp.AppState>) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // return this.authService.user.pipe(
        return this.store.select('auth').pipe(
            take(1),
            map(authState => {
                return authState.user;
            }),
            exhaustMap((user: User) => {
                if (!user) {
                    return next.handle(req);
                }

                const modifiedReq = req.clone({ params: new HttpParams().set('auth', user.token) });
                return next.handle(modifiedReq);
            })
        );
    }
}
