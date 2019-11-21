import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { ShoppingListService } from './../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';

@Injectable()
export class RecipeService {

    recipes: Recipe[] = [
        new Recipe(
            'Pork Ribs BBQ',
            'Tasty Pork Ribs BBQ and Fresh tomato salad',
            'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg',
            [
                new Ingredient('Pork Ribs', 1),
                new Ingredient('Cherry Tomatoes', 5)
            ]),
        new Recipe(
            'Thai Beef Steak',
            'Delicious spicy Thai Beef Steak',
            'https://cdn.pixabay.com/photo/2017/07/16/10/43/recipe-2508859_960_720.jpg',
            [
                new Ingredient('Beef Steak', 4),
                new Ingredient('Fresh chilli pepper', 2),
                new Ingredient('Fresh green chilli', 1)
            ])
    ];

    constructor(private shoppingListService: ShoppingListService) {}

    getRecipes(): Recipe[] {
        return this.recipes.slice();
    }

    getRecipeByIndex(index: number): Recipe {
        return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.shoppingListService.addIngredients(ingredients);
    }
}
