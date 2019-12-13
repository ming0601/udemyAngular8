import { Ingredient } from './../../shared/ingredient.model';
import { Action } from '@ngrx/store';

export const ADD_INGREDIENT = '[Shopping List] Add Ingredient';
export const ADD_INGREDIENTS = '[Shopping List] Add Ingredients';
export const UPDATE_INGREDIENT = '[Shopping List] Update Ingredient';
export const DELETE_INGREDIENT = '[Shopping List] Delete Ingredient';
export const START_EDIT = '[Shopping List] Start Editing';
export const STOP_EDIT = '[Shopping List] Stop Editing';

export class AddIngredientAction implements Action {
    readonly type = ADD_INGREDIENT;

    constructor(public payload: Ingredient) {}
}

export class AddIngredientsAction implements Action {
    readonly type = ADD_INGREDIENTS;

    constructor(public payload: Ingredient[]) {}
}

export class UpdateIngredientAction implements Action {
    readonly type = UPDATE_INGREDIENT;

    constructor(public payload: Ingredient) {}
}

export class DeleteIngredientAction implements Action {
    readonly type = DELETE_INGREDIENT;
}

export class StartEditAction implements Action {
    readonly type = START_EDIT;

    constructor(public payload: number) {}
}

export class StopEditAction implements Action {
    readonly type = STOP_EDIT;
}

export type ShoppingListActions =
    AddIngredientAction | AddIngredientsAction | UpdateIngredientAction | DeleteIngredientAction | StartEditAction | StopEditAction;
