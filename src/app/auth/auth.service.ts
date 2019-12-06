import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface AuthPayloadResponse {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
}

const AUTH_END_POINT = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
const FIREBASE_API_KEY = 'AI';

@Injectable({providedIn: 'root'})
export class AuthService {

    constructor(private http: HttpClient) {}

    signup(email: string, password: string): Observable<AuthPayloadResponse> {
        return this.http.post<AuthPayloadResponse>(
            AUTH_END_POINT + FIREBASE_API_KEY,
            { email: email, password: password, returnSecureToken: true });
    }
}
