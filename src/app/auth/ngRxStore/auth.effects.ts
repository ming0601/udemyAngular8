import { HttpClient } from '@angular/common/http';
import * as AuthActions from './auth.actions';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map } from 'rxjs/operators';
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
                    map(respData => {
                        const expirationDate = new Date(new Date().getTime() + (+respData.expiresIn * 1000));
                        return of(new AuthActions.LoginAction({
                            email: respData.email,
                            userId: respData.localId,
                            token: respData.idToken,
                            expirationDate: expirationDate})
                            )
                    }),
                    catchError(error => {
                        // ...
                        return of()
                    })
                );
        })
    );

    constructor(private actions$: Actions, private http: HttpClient) {}
}
