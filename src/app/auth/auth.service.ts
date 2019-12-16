import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { User } from './../shared/user.model';
import * as AuthActions from './ngRxStore/auth.actions';
import * as fromApp from '../ngRxStore/app.reducer';

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

@Injectable({providedIn: 'root'})
export class AuthService {
    // user = new BehaviorSubject<User>(null);
    tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router, private store: Store<fromApp.AppState>) {}

    signup(email: string, password: string): Observable<any> {
        return this.http
            .post<AuthPayloadResponse>(
                AUTH_END_POINT + SIGNUP + FIREBASE_API_KEY,
                { email: email, password: password, returnSecureToken: true })
            .pipe(this.handleError(), tap((authResp: AuthPayloadResponse) => this.handleUserAuth(authResp))
            );
    }

    signIn(email: string, password: string): Observable<any> {
        return this.http
            .post<AuthPayloadResponse>(
                AUTH_END_POINT + SIGN_IN + FIREBASE_API_KEY,
                { email: email, password: password, returnSecureToken: true })
            .pipe(this.handleError(), tap((authResp: AuthPayloadResponse) => this.handleUserAuth(authResp))
            );
    }

    autoLogin() {
        const userData: {
            email: string;
            id: string;
            pToken: string;
            pExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
            return;
        }

        const loadedUser = new User(userData.email, userData.id, userData.pToken, new Date(userData.pExpirationDate));
        if (loadedUser.token) {
            // this.user.next(loadedUser);
            this.store.dispatch(new AuthActions.AuthenticateSuccessAction({
                email: userData.email,
                userId: userData.id,
                token: userData.pToken,
                expirationDate: new Date(userData.pExpirationDate)
            }));
            // userData.pExpirationDate contains the future date
            const expirationTime = new Date(userData.pExpirationDate).getTime() - new Date().getTime();
            this.autoLogOut(expirationTime);
        }
    }

    logOut() {
        // this.user.next(null);
        this.store.dispatch(new AuthActions.LogoutAction());
        this.router.navigate(['/auth']);
        // function used to remove user from localStorage on manual logout click
        localStorage.removeItem('userData');

        if (this.tokenExpirationTimer) {
            // Cancels a Timeout object (tokenExpirationTimer) created by setTimeout().
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    /**
     * function to auto logout based on the expiration time
     * the set time out is set to a var in order to modify it if
     * the user manually logs out
     * @param expirationTime : number
     */
    autoLogOut(expirationTime: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logOut();
        }, expirationTime);
    }

    private handleUserAuth(authResp: AuthPayloadResponse) {
        const expirationDate = new Date(new Date().getTime() + (+authResp.expiresIn * 1000));
        const user = new User(authResp.email, authResp.localId, authResp.idToken, expirationDate);
        // this.user.next(user);
        this.store.dispatch(new AuthActions.AuthenticateSuccessAction({
            email: authResp.email,
            userId: authResp.localId,
            token: authResp.idToken,
            expirationDate: expirationDate}));
        this.autoLogOut(+authResp.expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError() {
        return catchError(errorResponse => {
            let errorMessage = 'An unknown error occurred!';
            if (!errorResponse.error || !errorResponse.error.error) {
                return throwError(errorMessage);
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
            return throwError(errorMessage);
        });
    }
}
