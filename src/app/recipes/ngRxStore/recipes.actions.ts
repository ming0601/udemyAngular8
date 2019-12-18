import { Recipe } from './../recipe.model';
import { Action } from '@ngrx/store';

export const SET_RECIPES = '[Recipe] Set Recipes';
export const FETCH_RECIPES = '[Recipes] Fetch Recipes';
export const ADD_RECIPE = '[Recipe] Add Recipe';
export const UPDATE_RECIPE = '[Recipe] Update Recipe';
export const DELETE_RECIPE = '[Recipe] Delete Recipe';

export class SetRecipesAction implements Action {
    readonly type = SET_RECIPES;

    constructor(public payload: Recipe[]) {}
}

export class FetchRecipesAction implements Action {
    readonly type = FETCH_RECIPES;
}

export class AddRecipeAction implements Action {
    readonly type = ADD_RECIPE;

    constructor(public payload: Recipe) {}
}

export class UpdateRecipeAction implements Action {
    readonly type = UPDATE_RECIPE;

    constructor(public payload: {index: number, updatedRecipe: Recipe}) {}
}

export class DeleteRecipeAction implements Action {
    readonly type = DELETE_RECIPE;

    constructor(public payload: number) {}
}

export type RecipesActions = SetRecipesAction | FetchRecipesAction | AddRecipeAction | UpdateRecipeAction | DeleteRecipeAction;
