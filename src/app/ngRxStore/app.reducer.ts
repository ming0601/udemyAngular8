import { ActionReducerMap } from '@ngrx/store';

import * as fromAuth from './../auth/ngRxStore/auth.reducer';
import * as fromShoppingList from './../shopping-list/ngRxStore/shopping-list.reducer';
import * as fromRecipes from '../recipes/ngRxStore/recipes.reducer';

export interface AppState {
    shoppingList: fromShoppingList.IngredientState;
    auth: fromAuth.AuthState;
    recipes: fromRecipes.RecipesState;
}

export const appReducer: ActionReducerMap<AppState> = {
    shoppingList: fromShoppingList.shoppingListReducer,
    auth: fromAuth.authReducer,
    recipes: fromRecipes.recipesReducer
};
