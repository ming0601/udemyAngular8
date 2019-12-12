import { Ingredient } from './../../shared/ingredient.model';
import { Action } from '@ngrx/store';

export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';
export const UPDATE_INGREDIENT = 'UPDATE_INGREDIENT';
export const DELETE_INGREDIENT = 'DELETE_INGREDIENT';
export const START_EDIT = 'START_EDIT';
export const STOP_EDIT = 'STOP_EDIT';

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
