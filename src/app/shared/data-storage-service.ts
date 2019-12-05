import { Recipe } from './../recipes/recipe.model';
import { RecipeService } from './../recipes/recipe.service';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


const FIREBASE_URL = 'https://udemy-ng8-recipe-book.firebaseio.com/';
const RECIPE_DB = 'recipes.json';

// @Injectable is needed because we inject
// another service (http) into our service
@Injectable({providedIn: 'root'})
export class DataStorageService {
    constructor(private http: HttpClient, private recipeService: RecipeService) {}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        this.http
            .put(FIREBASE_URL + RECIPE_DB, recipes)
            .subscribe(response => { console.log(response); });
    }

    fetchRecipes() {
        this.http
        .get<Recipe[]>(FIREBASE_URL + RECIPE_DB)
        .subscribe(recipes => {
            recipes.forEach(recipe => {
                this.recipeService.addRecipe(recipe);
            });
        });
    }
}
