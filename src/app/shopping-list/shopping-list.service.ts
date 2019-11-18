import { EventEmitter } from '@angular/core';
import { Ingredient } from './../shared/ingredient.model';

export class ShoppingListService {
    ingredientsChanged = new EventEmitter<Ingredient[]>();

    private ingredients: Ingredient[] = [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10)
      ];

    addNewIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
        this.ingredientsChanged.emit(this.ingredients.slice());
    }

    getIngredients(): Ingredient[] {
        return this.ingredients.slice();
    }

    addIngredients(ingredients: Ingredient[]) {
        // for (const ingredient of ingredients) {
        //     this.addNewIngredient(ingredient);
        // }
        this.ingredients.push(...ingredients);
        this.ingredientsChanged.emit(this.ingredients.slice());
    }
}
