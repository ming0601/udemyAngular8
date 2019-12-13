import { User } from './../../shared/user.model';
import { Action } from '@ngrx/store';

export const LOGIN = '[Auth] Login';
export const LOGOUT = '[Auth] Logout';

export class LoginAction implements Action {
    readonly type = LOGIN;

    constructor(public payload: {email: string, userId: string, token: string, expirationDate: Date}) {}
}

export class LogoutAction implements Action {
    readonly type = LOGOUT;
}

export type AuthActions = LoginAction | LogoutAction;
