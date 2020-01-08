import { User } from './../shared/user.model';
import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';
import { TestBed, getTestBed, fakeAsync, tick } from '@angular/core/testing';

import { Router, UrlTree } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { AnonymousSubject } from 'rxjs/internal/Subject';

describe('AuthGuard', () => {

    let authGuard: AuthGuard;
    let authMock: AuthService;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([]),
                HttpClientTestingModule
            ]
        });
        router = getTestBed().get(Router);
        authMock = getTestBed().get(AuthService);
        authGuard = new AuthGuard(authMock, router);
    });

    it('should create', () => expect(authGuard).toBeTruthy());

    it('should return true when calling canActivate() and AuthService returns a User', fakeAsync (() => {
        authMock.user.next(new User('testUser.email', 'testUser.localId', 'testUser.idToken', new Date()));
        const result = authGuard.canActivate() as AnonymousSubject<any>;
        tick();
        result.subscribe(hasUser => {
            console.log(hasUser);
            expect(hasUser).toBeTruthy();
        });
    }));

    it('should return a UrlTree when calling canActivate() and AuthService does not return any User', fakeAsync (() => {
        authMock.user.next(null);
        const result = authGuard.canActivate() as Observable<UrlTree>;
        tick();
        result.subscribe((urlTree: UrlTree) => {
            console.log(urlTree);
            expect(urlTree).toBeTruthy();
        });
    }));
});
