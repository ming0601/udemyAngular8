import * as AuthActions from './auth.actions';
import { User } from './../../shared/user.model';

export interface AuthState {
    user: User;
}

const initialAuthState: AuthState = {
    user: null
};

export function authReducer(
    state: AuthState = initialAuthState,
    action: AuthActions.AuthActions) {
    switch (action.type) {
        case AuthActions.LOGIN:
            const newUser = new User(
                action.payload.email,
                action.payload.userId,
                action.payload.token,
                action.payload.expirationDate);
            return {
                ...state,
                user: newUser
            };
        case AuthActions.LOGOUT:
            return {
                ...state,
                user: null
            };
        default: return state;
    }

}
