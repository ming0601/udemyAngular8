import { Action } from '@ngrx/store';

export const AUTHENTICATE_SUCCESS = '[Auth] Login';
export const LOGOUT = '[Auth] Logout';
export const LOGIN_START = '[Auth] Login Start';
export const AUTHENTICATE_FAIL = '[Auth] Login Fail';
export const SIGNUP_START = '[Auth] Signup Start';
export const CLEAR_ERROR = '[Auth] Clear Error';
export const AUTO_LOGIN = '[Auth] Auto Login';

export class AuthenticateSuccessAction implements Action {
    readonly type = AUTHENTICATE_SUCCESS;

    constructor(public payload: {email: string, userId: string, token: string, expirationDate: Date}) {}
}

export class LogoutAction implements Action {
    readonly type = LOGOUT;
}

export class LoginStartAction implements Action {
    readonly type = LOGIN_START;

    constructor(public payload: {email: string, password: string}) {}
}

export class AuthenticateFailAction implements Action {
    readonly type = AUTHENTICATE_FAIL;

    constructor(public payload: string) {}
}

export class SignupStartAction implements Action {
    readonly type = SIGNUP_START;

    constructor(public payload: {email: string, password: string}) {}
}

export class ClearErrorAction implements Action {
    readonly type = CLEAR_ERROR;
}

export class AutoLoginAction implements Action {
    readonly type = AUTO_LOGIN;
}

export type AuthActions = AuthenticateSuccessAction | LogoutAction | LoginStartAction | AuthenticateFailAction | SignupStartAction | ClearErrorAction | AutoLoginAction;
