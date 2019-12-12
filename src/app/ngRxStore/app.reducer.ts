import { ActionReducerMap } from '@ngrx/store';

import * as fromAuth from './../auth/ngRxStore/auth.reducer';
import * as fromShoppingList from './../shopping-list/ngRxStore/shopping-list.reducer';

export interface AppState {
    shoppingList: fromShoppingList.IngredientState;
    auth: fromAuth.AuthState;
}

export const appReducer: ActionReducerMap<AppState> = {
    shoppingList: fromShoppingList.shoppingListReducer,
    auth: fromAuth.authReducer
};
