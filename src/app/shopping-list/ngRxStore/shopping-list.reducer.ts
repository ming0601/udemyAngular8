import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

const initialListState = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
      ]
};

/**
 * In this function, the state MUST BE immutable
 * @param state: initial state of an object
 * @param action: Action
 */
export function shoppingListReducer(state = initialListState, action: ShoppingListActions.AddIngredientAction) {
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT: return {
            // copy all the properties in the state
            // with the new spread operator in a new object -> (return {...state})
            // good practice to save old values
            ...state,
            // changing now the ingredients
            // saving all old values of ingredients
            // then adding the new Ingredients with action.payload
            ingredients: [...state.ingredients, action.payload]
        }
    }
}
