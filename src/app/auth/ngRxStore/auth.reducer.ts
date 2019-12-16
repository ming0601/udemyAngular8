import * as AuthActions from './auth.actions';
import { User } from './../../shared/user.model';

export interface AuthState {
    user: User;
    authErrorMsg: string;
    loading: boolean;
}

const initialAuthState: AuthState = {
    user: null,
    authErrorMsg: null,
    loading: false
};

export function authReducer(
    state: AuthState = initialAuthState,
    action: AuthActions.AuthActions) {
    switch (action.type) {
        case AuthActions.AUTHENTICATE_SUCCESS:
            const newUser = new User(
                action.payload.email,
                action.payload.userId,
                action.payload.token,
                action.payload.expirationDate);
            return {
                ...state,
                user: newUser,
                authErrorMsg: null,
                loading: false
            };
        case AuthActions.LOGOUT:
            return {
                ...state,
                user: null,
                authErrorMsg: null
            };
        case AuthActions.LOGIN_START:
            return {
                ...state,
                authErrorMsg: null,
                loading: true
            };
        case AuthActions.AUTHENTICATE_FAIL:
            return {
                ...state,
                user: null,
                authErrorMsg: action.payload,
                loading: false
            };
        default: return state;
    }

}
