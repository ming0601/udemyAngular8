import { User } from './../shared/user.model';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, getTestBed, fakeAsync, inject, async, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([]),
                HttpClientTestingModule
            ],
            providers: [
                AuthService,
                { provide: Router,
                    useClass: class {
                    navigate = jasmine.createSpy('navigate'); }
                }
              ],
        });
        router = getTestBed().get(Router);
    });

    it('should make http POST sign up request when calling signup',
        inject([AuthService, HttpTestingController], fakeAsync ((authService: AuthService, httpMock: HttpTestingController) => {
            // We call the service
            authService.signup('test.email', 'test.pwd').subscribe((data: User) => {
                expect(data.email).toEqual('testUser.email');
                expect(data.id).toEqual('testUser.localId');
                expect(data.token).toEqual('testUser.idToken');
            });

            // We set the expectations for the HttpClient mock
            const req = httpMock.expectOne('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AI');
            expect(req.request.method).toEqual('POST');
            expect(req.request.body).toEqual({ email: 'test.email', password: 'test.pwd', returnSecureToken: true });

            expect(router.navigate).not.toHaveBeenCalled();

            // Then we set the fake data to be returned by the mock
            const expirationDate = new Date(new Date().getTime() + (1800000));
            req.flush(new User('testUser.email', 'testUser.localId', 'testUser.idToken', expirationDate));
            tick();
    })));

    it('should delete user data when calling logOut()',
        inject([AuthService, HttpTestingController], fakeAsync ((authService: AuthService, httpMock: HttpTestingController) => {
            localStorage.setItem('userData', 'test');
            authService.tokenExpirationTimer = 10000;
            // We call the service
            authService.logOut();

            authService.user.subscribe(user => expect(user).toBeNull());
            expect(localStorage.length).toEqual(0);
            expect(authService.tokenExpirationTimer).toBeNull();
            expect(router.navigate).toHaveBeenCalledTimes(1);
            tick();
    })));

    it('should emit user data from localStorage when calling autoLogin()',
        inject([AuthService, HttpTestingController], fakeAsync ((authService: AuthService, httpMock: HttpTestingController) => {
            const expirationDate = new Date(new Date().getTime() + (180));
            localStorage.setItem(
                'userData',
                JSON.stringify(new User('testUser.email', 'testUser.localId', 'testUser.idToken', expirationDate))
            );
            const spyNext = spyOn(authService.user, 'next');

            // We call the service
            authService.autoLogin();
            // check first that Subject is called, localStorage is not wiped yet and navigation is not done
            tick(1);
            expect(spyNext).toHaveBeenCalled();
            expect(localStorage.length).toEqual(1);
            expect(router.navigate).not.toHaveBeenCalled();

            // after 180 ms, check that Subject is called, localStorage is wiped yet and navigation is done
            tick(185);
            expect(spyNext).toHaveBeenCalled();
            expect(localStorage.length).toEqual(0);
            expect(router.navigate).toHaveBeenCalled();
    })));

    it('should emit user data from localStorage when calling autoLogin() SAME TEST AS PREVIOUS, OTHER MANNER',
        inject([AuthService, HttpTestingController], (authService: AuthService, httpMock: HttpTestingController) => {
            const expirationDate = new Date(new Date().getTime() + (180));
            localStorage.setItem(
                'userData',
                JSON.stringify(new User('testUser.email', 'testUser.localId', 'testUser.idToken', expirationDate))
            );
            const spyNext = spyOn(authService.user, 'next');

            jasmine.clock().install();
            // We call the service
            authService.autoLogin();
            expect(spyNext).toHaveBeenCalled();
            expect(localStorage.length).toEqual(1);
            expect(router.navigate).not.toHaveBeenCalled();

            jasmine.clock().tick(185);
            expect(spyNext).toHaveBeenCalled();
            expect(localStorage.length).toEqual(0);
            expect(router.navigate).toHaveBeenCalled();

            jasmine.clock().uninstall();
    }));

    it('should handle http POST sign in error when calling signIn()',
        inject([AuthService, HttpTestingController], async (authService: AuthService, httpMock: HttpTestingController) => {
        // We call the service
            authService.signIn('test.email', 'test.pwd').subscribe(
            errorResponse => {
                // this expect does not work with fakeAsync !!!
                expect(authService.signIn).toThrowError('Invalid email or password.');
            });
            // We set the expectations for the HttpClient mock
            const req = httpMock.expectOne('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AI');
            expect(req.request.method).toEqual('POST');
            expect(req.request.body).toEqual({ email: 'test.email', password: 'test.pwd', returnSecureToken: true });

            expect(router.navigate).not.toHaveBeenCalled();

            // Then we set the fake data to be returned by the mock
            req.flush({error: {message: 'EMAIL_NOT_FOUND'}}, {status: 400, statusText: 'test'});
    }));

    afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
        httpMock.verify();
    }));
});
