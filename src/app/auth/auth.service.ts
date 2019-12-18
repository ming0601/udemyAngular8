import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as AuthActions from './ngRxStore/auth.actions';
import * as fromApp from '../ngRxStore/app.reducer';

@Injectable({providedIn: 'root'})
export class AuthService {
    tokenExpirationTimer: any;
    
    constructor(private store: Store<fromApp.AppState>) {}
    
    /**
     * function to auto logout based on the expiration time
     * the set time out is set to a var in order to modify it if
     * the user manually logs out
     * @param expirationTime : number
     */
    setLogOutTimer(expirationTime: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.store.dispatch(new AuthActions.LogoutAction());
        }, expirationTime);
    }
    
    clearLogOutTimer() {
        if (this.tokenExpirationTimer) {
            this.setLogOutTimer(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
        }
    }
}
