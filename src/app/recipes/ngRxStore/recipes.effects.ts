import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { switchMap, take, map, exhaustMap, withLatestFrom } from 'rxjs/operators';

import { Recipe } from './../recipe.model';
import * as RecipesActions from './recipes.actions';
import * as fromApp from './../../ngRxStore/app.reducer';

const FIREBASE_URL = 'https://udemy-ng8-recipe-book.firebaseio.com/';
const RECIPE_DB = 'recipes.json';

@Injectable()
export class RecipesEffects {
    constructor(private actions$: Actions, private http: HttpClient, private store: Store<fromApp.AppState>) {}

    @Effect()
    fetchRecipes = this.actions$.pipe(
        ofType(RecipesActions.FETCH_RECIPES),
        switchMap(() => {
            return this.store.select('auth')
            .pipe(
                take(1), // `take` returns an Observable that emits only the first `count` values emitted
                    // by the source Observable. If the source emits fewer than `count` values then
                    // all of its values are emitted. After that, it completes, regardless if the source completes.
                map(authState => {
                return authState.user;
                }),
                // exhaustMap works on 2 Observables, it works on the first (user) to get the token, then the HTTP
                exhaustMap(user => {
                    return this.http.get<Recipe[]>(FIREBASE_URL + RECIPE_DB);
                })
            )
        }),
        map(recipes => {
            return recipes.map(recipe => {
                return {
                ...recipe,
                ingredients: recipe.ingredients ? recipe.ingredients : []
                };
            });
        }),
        map(recipes => new RecipesActions.SetRecipesAction(recipes))
    );

    @Effect({dispatch: false})
    storeRecipes = this.actions$.pipe(
        ofType(RecipesActions.STORE_RECIPES),
        // withLatestFrom also provides the last value from another observable in this main one
        withLatestFrom(this.store.select('recipes')),
        // in switchMap we have two data : actionData from ofType and recipesState from withLatestFrom
        // we regroup these two data using Array destructuring
        switchMap(([actionData, recipesState]) => {
            return this.http
            .put(FIREBASE_URL + RECIPE_DB, recipesState.recipes);
        })
    );
}