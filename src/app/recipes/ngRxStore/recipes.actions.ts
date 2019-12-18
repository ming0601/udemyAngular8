import { Recipe } from './../recipe.model';
import { Action } from '@ngrx/store';

export const SET_RECIPES = '[Recipe] Set Recipes';
export const FETCH_RECIPES = '[Recipes] Fetch Recipes';

export class SetRecipesAction implements Action {
    readonly type = SET_RECIPES;

    constructor(public payload: Recipe[]) {}
}

export class FetchRecipesAction implements Action {
    readonly type = FETCH_RECIPES;
}

export type RecipesActions = SetRecipesAction | FetchRecipesAction;
