import { Action } from '@ngrx/store';

export const LOGIN = '[Auth] Login';
export const LOGOUT = '[Auth] Logout';
export const LOGIN_START = '[Auth] Login Start';
export const LOGIN_FAIL = '[Auth] Login Fail';

export class LoginAction implements Action {
    readonly type = LOGIN;

    constructor(public payload: {email: string, userId: string, token: string, expirationDate: Date}) {}
}

export class LogoutAction implements Action {
    readonly type = LOGOUT;
}

export class LoginStartAction implements Action {
    readonly type = LOGIN_START;

    constructor(public payload: {email: string, password: string}) {}
}

export class LoginFailAction implements Action {
    readonly type = LOGIN_FAIL;

    constructor(public payload: string) {}
}

export type AuthActions = LoginAction | LogoutAction | LoginStartAction | LoginFailAction;
