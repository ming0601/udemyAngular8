import { AuthService } from './../auth.service';
import { User } from './../../shared/user.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as AuthActions from './auth.actions';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';

export interface AuthPayloadResponse {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

const AUTH_END_POINT = 'https://identitytoolkit.googleapis.com/v1/accounts:';
const SIGNUP = 'signUp?key=';
const SIGN_IN = 'signInWithPassword?key=';
const FIREBASE_API_KEY = 'AI';

/**
 * NgRx Store provides us a single stream of actions where we can either dispatch or
 * subscribe any action across our whole app. This action stream is an Observable.
 * 
 * NgRx Effects allow us to listen for particular action types, and “do something”
 * when that action happens. Any effect you write is also an Observable.
 * 
 * An effect is an Observable which uses the Action Stream as its source, and also as its destination.
 * That is, an effect subscribes to the Action Stream, and it can also publish to the action stream.
 */
@Injectable()
export class AuthEffects {
    @Effect()
    userSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((authData: AuthActions.SignupStartAction) => {
            return this.http
                .post<AuthPayloadResponse>(
                    AUTH_END_POINT + SIGNUP + FIREBASE_API_KEY,
                    { email: authData.payload.email, password: authData.payload.password, returnSecureToken: true }
                ).pipe(
                    tap(respData => {
                        this.authService.setLogOutTimer(+respData.expiresIn * 1000);
                    }),
                    // map auto wrap the returned data in a new Observable
                    map(respData => {
                        return this.handleAuthentication(respData);       
                    }),
                    catchError(errorResponse => {
                        return this.handleError(errorResponse);
                    })
                );
        })
    );

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStartAction) => {
            return this.http
                .post<AuthPayloadResponse>(
                    AUTH_END_POINT + SIGN_IN + FIREBASE_API_KEY,
                    { email: authData.payload.email, password: authData.payload.password, returnSecureToken: true }
                ).pipe(
                    tap(respData => {
                        this.authService.setLogOutTimer(+respData.expiresIn * 1000);
                    }),
                    // map auto wrap the returned data in a new Observable
                    map(respData => {
                        return this.handleAuthentication(respData);       
                    }),
                    catchError(errorResponse => {
                        return this.handleError(errorResponse);
                    })
                );
        })
    );

    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
            const userData: {
                email: string;
                id: string;
                pToken: string;
                pExpirationDate: string;
            } = JSON.parse(localStorage.getItem('userData'));
    
            if (!userData) {
                return {type: 'DUMMY'};;
            }
    
            const loadedUser = new User(userData.email, userData.id, userData.pToken, new Date(userData.pExpirationDate));
            if (loadedUser.token) {
                // userData.pExpirationDate contains the future date
                const expirationTime = new Date(userData.pExpirationDate).getTime() - new Date().getTime();
                this.authService.setLogOutTimer(expirationTime);

                // this.user.next(loadedUser);
                return new AuthActions.AuthenticateSuccessAction({
                    email: userData.email,
                    userId: userData.id,
                    token: userData.pToken,
                    expirationDate: new Date(userData.pExpirationDate)
                });
                // userData.pExpirationDate contains the future date
                // const expirationTime = new Date(userData.pExpirationDate).getTime() - new Date().getTime();
                // this.autoLogOut(expirationTime);
            }
            return {type: 'DUMMY'};
        })
    );

    @Effect({dispatch: false})
    authLogout = this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
            this.authService.clearLogOutTimer();
            localStorage.removeItem('userData');
            // Navigate to the the auth page
            this.router.navigate(['/auth']);
        })

    );

    // Common use cases for no-dispatch effects are when you want to just console.log() the action,
    // or when you want to trigger router navigation.
    @Effect({dispatch: false})
    authRedirect = this.actions$.pipe(
         // Watch the stream for a LOGIN successful action
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap(() => {
            // Navigate to the the root
            this.router.navigate(['/']);
        })
        // Do not dispatch any further actions
    );

    constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) {}

    private handleAuthentication(respData: AuthPayloadResponse) {
        const expirationDate = new Date(new Date().getTime() + (+respData.expiresIn * 1000));
        const user = new User(respData.email, respData.localId, respData.idToken, expirationDate);
        localStorage.setItem('userData', JSON.stringify(user));

        return new AuthActions.AuthenticateSuccessAction({
            email: respData.email,
            userId: respData.localId,
            token: respData.idToken,
            expirationDate: expirationDate
        });
    }
    
    private handleError(errorResponse: any) {
        let errorMessage = 'An unknown error occurred!';
        if (!errorResponse.error || !errorResponse.error.error) {
            // we must create a new Observable with of()
            return of(new AuthActions.AuthenticateFailAction(errorMessage));
        }
        switch (errorResponse.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'The email address is already in use by another account.';
                break;
            case 'OPERATION_NOT_ALLOWED':
                errorMessage = 'Password sign-in is disabled.';
                break;
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                errorMessage = 'Too many requests. Please try again later.';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'Invalid email or password.';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'Invalid email or password.';
                break;
            case 'USER_DISABLED':
                errorMessage = 'Invalid email or password.';
                break;
            default: break;
        }
        // we must create a new Observable with of()
        return of(new AuthActions.AuthenticateFailAction(errorMessage));
    }
}
