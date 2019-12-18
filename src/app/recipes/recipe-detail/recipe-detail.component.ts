import { map, switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';

import * as fromApp from './../../ngRxStore/app.reducer';
import * as RecipesActions from './../ngRxStore/recipes.actions';
import * as ShoppingListActions from './../../shopping-list/ngRxStore/shopping-list.actions';
import { Recipe } from './../recipe.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipeDetail: Recipe;
  id: number;

  constructor(
              private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    // These observable is handled by Angular, this cannot be destroy, Angular will manage
    // In case of Custom Observable, it must be destroyed when the component is destroyed
    // OnDestroy must be implemented and unsubscribe the Observable
    this.route.params
      .pipe(
        map(params => +params['id']),
        switchMap(id => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map((recipesState) => recipesState.recipes.find((recipe, index) => index === this.id))
      )
      .subscribe(recipe => this.recipeDetail = recipe);
  }

  sendIngredientToShoppingList() {
    this.store.dispatch(new ShoppingListActions.AddIngredientsAction(this.recipeDetail.ingredients));
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  deleteRecipe() {
    this.store.dispatch(new RecipesActions.DeleteRecipeAction(this.id));
    this.router.navigate(['/recipes']);
  }
}
