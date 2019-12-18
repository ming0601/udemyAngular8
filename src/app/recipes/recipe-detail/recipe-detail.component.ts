import { map, switchMap } from 'rxjs/operators';
import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Params, Router } from '@angular/router';

import * as fromApp from './../../ngRxStore/app.reducer';
import { RecipeService } from './../recipe.service';
import { Recipe } from './../recipe.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipeDetail: Recipe;
  id: number;

  constructor(private recipeService: RecipeService,
              private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    // These observable is handled by Angular, this cannot be destroy, Angular will manage
    // In case of Custom Observable, it must be destroyed when the component is destroyed
    // OnDestroy must be implemented and unsubscribe the Observable
    // const id = this.route.params.subscribe(
    //   (params: Params) => {
    //     this.id = +params.id;
    //     this.recipeDetail = this.recipeService.getRecipeByIndex(this.id);
    //   }
    // );

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
    this.recipeService.addIngredientsToShoppingList(this.recipeDetail.ingredients);
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  deleteRecipe() {
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }
}
