import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { TestBed, fakeAsync, tick, getTestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import { HTTP_INTERCEPTORS, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { UserInterceptorService } from '../shared/user-interceptor.service';
import { User } from '../shared/user.model';

const AUTH_END_POINT = 'https://identitytoolkit.googleapis.com/v1/accounts:';

describe(`AuthHttpInterceptor`, () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let interceptor: UserInterceptorService;
  let handler: HttpHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
    ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: UserInterceptorService,
          multi: true,
        }
      ],
    });

    service = getTestBed().get(AuthService);
    httpMock = getTestBed().get(HttpTestingController);
    handler = getTestBed().get(HttpHandler);

    interceptor = new UserInterceptorService(service);
  });

  it('should add an Authorization params', fakeAsync (() => {

    service.user.next(new User('testUser.email', 'testUser.localId', 'testUser.idToken', new Date()));

    const result = interceptor.intercept(new HttpRequest('GET', AUTH_END_POINT), handler) as Observable<HttpEvent<any>>;
    // tick();
    result.subscribe((userZ: HttpEvent<any>) => {
        // The request was sent out over the wire => Sent = 0.
        expect(userZ.type).toEqual(0);
    });

    // the expected URL must contain all the params (?auth=testUser.idToken HERE) otherwise the test will fail
    const httpRequest = httpMock.expectOne({url: `${AUTH_END_POINT}?auth=testUser.idToken`, method: 'GET'});
    expect(httpRequest.request.params.has('auth')).toEqual(true);
    expect(httpRequest.request.params.get('auth')).toEqual('testUser.idToken');

    httpMock.verify();
    tick();
  }));
});
