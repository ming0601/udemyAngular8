import { RecipeService } from './recipe.service';
import { Recipe } from './recipe.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  providers: [RecipeService]
})
export class RecipesComponent implements OnInit {
  recipe: Recipe;

  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
    // These observable is handled by Angular, this cannot be destroy, Angular will manage
    // In case of Custom Observable, it must be destroyed when the component is destroyed
    // OnDestroy must be implemented and unsubscribe the Observable
    this.recipeService.recipeSelected.subscribe(
      (rec: Recipe) => { this.recipe = rec; }
    );
  }
}
