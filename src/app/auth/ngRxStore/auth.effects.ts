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
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStartAction) => {
            return this.http
                .post<AuthPayloadResponse>(
                    AUTH_END_POINT + SIGN_IN + FIREBASE_API_KEY,
                    { email: authData.payload.email, password: authData.payload.password, returnSecureToken: true }
                ).pipe(
                    // map auto wrap the returned data in a new Observable
                    map(respData => {
                        const expirationDate = new Date(new Date().getTime() + (+respData.expiresIn * 1000));
                        return new AuthActions.LoginAction({
                            email: respData.email,
                            userId: respData.localId,
                            token: respData.idToken,
                            expirationDate: expirationDate})
                            
                    }),
                    catchError(errorResponse => {
                        let errorMessage = 'An unknown error occurred!';
                        if (!errorResponse.error || !errorResponse.error.error) {
                            // we must create a new Observable with of()
                            return of(new AuthActions.LoginFailAction(errorMessage));
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
                        return of(new AuthActions.LoginFailAction(errorMessage));
                    })
                );
        })
    );

    // Common use cases for no-dispatch effects are when you want to just console.log() the action,
    // or when you want to trigger router navigation.
    @Effect({dispatch: false})
    authSuccess = this.actions$.pipe(
         // Watch the stream for a LOGIN successful action
        ofType(AuthActions.LOGIN),
        tap(() => {
            // Navigate to the the root
            this.router.navigate(['/']);
        })
        // Do not dispatch any further actions
    );

    constructor(private actions$: Actions, private http: HttpClient, private router: Router) {}
}
