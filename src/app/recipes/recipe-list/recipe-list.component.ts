import { map } from 'rxjs/operators';
import * as fromApp from './../../ngRxStore/app.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { RecipeService } from './../recipe.service';
import { Recipe } from './../recipe.model';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  subscription: Subscription;

  constructor(private recipeService: RecipeService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    // this.subscription = this.recipeService.recipeChanged.subscribe(
    this.subscription = this.store.select('recipes')
    .pipe(map(recipeState => recipeState.recipes))
    .subscribe(
      (recipes: Recipe[]) => {
        this.recipes = recipes;
      });
    // this.recipes = this.recipeService.getRecipes();
  }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.activatedRoute});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
