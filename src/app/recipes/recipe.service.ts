import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

// import { ShoppingListService } from './../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import * as ShoppingListActions from '../shopping-list/ngRxStore/shopping-list.actions';
import * as fromShoppingList from '../shopping-list/ngRxStore/shopping-list.reducer';

@Injectable()
export class RecipeService {
    recipeChanged = new Subject<Recipe[]>();

    // recipes: Recipe[] = [
    //     new Recipe(
    //         'Pork Ribs BBQ',
    //         'Tasty Pork Ribs BBQ and Fresh tomato salad',
    //         'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg',
    //         [
    //             new Ingredient('Pork Ribs', 1),
    //             new Ingredient('Cherry Tomatoes', 5)
    //         ]),
    //     new Recipe(
    //         'Thai Beef Steak',
    //         'Delicious spicy Thai Beef Steak',
    //         'https://cdn.pixabay.com/photo/2017/07/16/10/43/recipe-2508859_960_720.jpg',
    //         [
    //             new Ingredient('Beef Steak', 4),
    //             new Ingredient('Fresh chilli pepper', 2),
    //             new Ingredient('Fresh green chilli', 1)
    //         ])
    // ];
    private recipes: Recipe[] = [];

    constructor(
                // private shoppingListService: ShoppingListService,
                private store: Store<fromShoppingList.AppState>) {}

    getRecipes(): Recipe[] {
        return this.recipes.slice();
    }

    getRecipeByIndex(index: number): Recipe {
        return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        // this.shoppingListService.addIngredients(ingredients);
        this.store.dispatch(new ShoppingListActions.AddIngredientsAction(ingredients));
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipeChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, recipe: Recipe) {
        this.recipes[index] = recipe;
        this.recipeChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipeChanged.next(this.recipes.slice());
    }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipeChanged.next(this.recipes.slice());
    }
}
