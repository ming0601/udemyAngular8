import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

    constructor(private http: HttpClient) {}

    signup(email: string, password: string): Observable<AuthPayloadResponse> {
        return this.http
        .post<AuthPayloadResponse>(
            AUTH_END_POINT + SIGNUP + FIREBASE_API_KEY,
            { email: email, password: password, returnSecureToken: true })
        .pipe(catchError(errorResponse => {
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
                    errorMessage = 'Too many requests. Try again later.';
                    break;
                default: break;
            }
            return throwError(errorMessage);
            }));
    }

    signIn(email: string, password: string): Observable<AuthPayloadResponse> {
        return this.http
        .post<AuthPayloadResponse>(
            AUTH_END_POINT + SIGN_IN + FIREBASE_API_KEY,
            { email: email, password: password, returnSecureToken: true })
        .pipe(catchError(errorResponse => {
            let errorMessage = 'An unknown error occurred!';
            if (!errorResponse.error || !errorResponse.error.error) {
                return throwError(errorMessage);
            } else {
                errorMessage = 'Invalid email or password.';
            }
            return throwError(errorMessage);
            }));
    }
}
