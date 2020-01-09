import { User } from './user.model';
import { take, exhaustMap } from 'rxjs/operators';
import { AuthService } from './../auth/auth.service';
import { Observable } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class UserInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.user.pipe(
            take(1),
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
