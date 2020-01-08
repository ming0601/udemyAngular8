import { RecipeService } from './recipe.service';
import { Recipe } from './recipe.model';
import { DataStorageService } from './../shared/data-storage-service';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class RecipeResolverService implements Resolve<Recipe[]> {

    constructor(private dataStorageService: DataStorageService, private recipeService: RecipeService) {}

    // resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    resolve() {
        const recipes = this.recipeService.getRecipes();

        if (recipes.length === 0) {
            return this.dataStorageService.fetchRecipes();
        } else {
            return recipes;
        }
    }
}
