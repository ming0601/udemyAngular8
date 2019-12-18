import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { take, map, switchMap } from 'rxjs/operators';

import { DataStorageService } from './../shared/data-storage-service';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';
import * as fromApp from '../ngRxStore/app.reducer';
import * as RecipesActions from './ngRxStore/recipes.actions';
import { of } from 'rxjs';

@Injectable({providedIn: 'root'})
export class RecipeResolverService implements Resolve<Recipe[]> {

    constructor(
        private dataStorageService: DataStorageService,
        private recipeService: RecipeService,
        private store: Store<fromApp.AppState>,
        private actions$: Actions) {}

    // resolve returns an Observable
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // const recipes = this.recipeService.getRecipes();
        return this.store.select('recipes').pipe(
            take(1),
            map(recipesState => recipesState.recipes),
            switchMap(recipes => {
                if (recipes.length === 0) {
                    // return this.dataStorageService.fetchRecipes();
                    this.store.dispatch(new RecipesActions.FetchRecipesAction());
                    // listening to SET_RECIPES, we know that when this action is finished, all recipes are loaded
                    // we're interested only on 1 time
                    return this.actions$.pipe(
                        ofType(RecipesActions.SET_RECIPES),
                        take(1)
                    );
                } else {
                    return of(recipes);
                }
            })
        )
    }
}
