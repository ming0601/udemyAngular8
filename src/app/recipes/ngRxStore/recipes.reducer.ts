import { Recipe } from './../recipe.model';
import * as RecipesActions from './recipes.actions';

export interface RecipesState {
    recipes: Recipe[];
}

const initialState: RecipesState = {
    recipes: []
};

export function recipesReducer (state = initialState, action: RecipesActions.RecipesActions) {
    switch (action.type) {
        case RecipesActions.SET_RECIPES:
            return {
                ...state,
                recipes: [...action.payload]
            };
        case RecipesActions.ADD_RECIPE:
            return {
                ...state,
                recipes: [...state.recipes, action.payload]
            };
        case RecipesActions.UPDATE_RECIPE:

            // 1. create the recipe according to the index
            const updatedRecipe = { ...state.recipes[action.payload.index], ...action.payload.updatedRecipe };
            // 2. copy all the recipes in a new array
            const updatedRecipes = [...state.recipes];
            // 3. update the recipe in the array by the new one
            updatedRecipes[action.payload.index] = updatedRecipe;
            // 4. return the updated recipes
            return {
                ...state,
                recipes: updatedRecipes
            };
        case RecipesActions.DELETE_RECIPE:
            return {
                ...state,
                recipes: state.recipes.filter((recipe, index) => index !== action.payload)
            };
        default: return state;
    }
}
