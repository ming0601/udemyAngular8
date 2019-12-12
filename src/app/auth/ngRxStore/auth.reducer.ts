import { User } from './../../shared/user.model';

export interface AuthState {
    user: User;
}

const initialAuthState: AuthState = {
    user: null
};

export function authReducer(
    state: AuthState = initialAuthState,
    action) {
    return state;
}
