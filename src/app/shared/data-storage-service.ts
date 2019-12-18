// import * as RecipesActions from './../recipes/ngRxStore/recipes.actions';
// import * as fromApp from './../ngRxStore/app.reducer';
// import { AuthService } from './../auth/auth.service';
// import { Recipe } from './../recipes/recipe.model';
// import { RecipeService } from './../recipes/recipe.service';

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { map, tap, take, exhaustMap } from 'rxjs/operators';
// import { Observable } from 'rxjs';
// import { Store } from '@ngrx/store';


// const FIREBASE_URL = 'https://udemy-ng8-recipe-book.firebaseio.com/';
// const RECIPE_DB = 'recipes.json';

// // @Injectable is needed because we inject
// // another service (http) into our service
// @Injectable({providedIn: 'root'})
// export class DataStorageService {
//     constructor(private http: HttpClient,
//                 private recipeService: RecipeService,
//                 private authService: AuthService,
//                 private store: Store<fromApp.AppState>) {}

//     storeRecipes() {
//         const recipes = this.recipeService.getRecipes();
//         this.http
//             .put(FIREBASE_URL + RECIPE_DB, recipes)
//             .subscribe(response => { console.log(response); });
//     }

//     fetchRecipes(): Observable<Recipe[]> {
//     //    return this.authService.user
//     return this.store.select('auth')
//         .pipe(
//             take(1), // `take` returns an Observable that emits only the first `count` values emitted
//                     // by the source Observable. If the source emits fewer than `count` values then
//                     // all of its values are emitted. After that, it completes, regardless if the source completes.
//             map(authState => {
//                 return authState.user;
//             }),
//             // exhaustMap works on 2 Observables, it works on the first (user) to get the token, then the HTTP
//             exhaustMap(user => {
//                 return this.http.get<Recipe[]>(FIREBASE_URL + RECIPE_DB);
//             }),
//             map(recipes => {
//                 return recipes.map(recipe => {
//                     return {
//                     ...recipe,
//                     ingredients: recipe.ingredients ? recipe.ingredients : []
//                     };
//                 });
//             }),
//             tap(recipes => {
//                 // this.recipeService.setRecipes(recipes);
//                 this.store.dispatch(new RecipesActions.SetRecipesAction(recipes));
//             })
//         );
//     }
// }
