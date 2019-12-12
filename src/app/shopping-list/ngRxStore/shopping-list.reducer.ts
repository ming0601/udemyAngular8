import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface IngredientState {
    ingredients: Ingredient[];
    selectedIngredient: Ingredient;
    selectedIngredientIndex: number;
}

const initialListState: IngredientState = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
      ],
      selectedIngredient: null,
      selectedIngredientIndex: -1
};

/**
 * In this function, the state MUST BE immutable
 * @param state: initial state of an object
 * @param action: Action
 */
export function shoppingListReducer(
    state: IngredientState = initialListState,
    action: ShoppingListActions.ShoppingListActions) {
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT: return {
            // copy all the properties in the state
            // with the new spread operator in a new object -> (return {...state})
            // good practice to save old values
            ...state,
            // changing now the ingredients
            // saving all old values of ingredients
            // then adding the new Ingredient with action.payload
            ingredients: [...state.ingredients, action.payload]
        };
        case ShoppingListActions.ADD_INGREDIENTS: return {
            ...state,
            // changing now the ingredients
            // saving all old values of ingredients
            // then adding the new Ingredients with spread operator for action.payload array
            ingredients: [...state.ingredients, ...action.payload]
        };
        case ShoppingListActions.UPDATE_INGREDIENT:
            // get the right ingredient to update according to the index
            const ingredient = state.ingredients[state.selectedIngredientIndex];
            const updatedIngredient = {
                // copying first the data
                ...ingredient,
                // then update data
                ...action.payload
            };
            // creating a new array of ingredients with all the old values -> (state)
            const updatedIngredients = [...state.ingredients];
            // updating the ingredient of this array
            updatedIngredients[state.selectedIngredientIndex] = updatedIngredient;

            return {
                ...state,
                ingredients: updatedIngredients,
                selectedIngredientIndex: -1,
                selectedIngredient: null
            };
        case ShoppingListActions.DELETE_INGREDIENT: return {
            ...state,
            ingredients: state.ingredients.filter((ing, ingIndex) => {
                return ingIndex !== state.selectedIngredientIndex;
            }),
            selectedIngredientIndex: -1,
            selectedIngredient: null
        };
        case ShoppingListActions.START_EDIT: return {
            ...state,
            // we get the index from the action
            selectedIngredientIndex: action.payload,
            // data must be copied from redux, because we're accessing by reference
            selectedIngredient: { ...state.ingredients[action.payload] }
        };
        case ShoppingListActions.STOP_EDIT: return {
            ...state,
            selectedIngredientIndex: -1,
            selectedIngredient: null
        };
        default: return state;
    }
}
