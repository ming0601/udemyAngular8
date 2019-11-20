import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from './../recipe.service';
import { Recipe } from './../recipe.model';
import { Component, OnInit, Input } from '@angular/core';

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
              private router: Router) { }

  ngOnInit() {
    // These observable is handled by Angular, this cannot be destroy, Angular will manage
    // In case of Custom Observable, it must be destroyed when the component is destroyed
    // OnDestroy must be implemented and unsubscribe the Observable
    const id = this.route.params.subscribe(
      (params: Params) => {
        this.id = +params.id;
        this.recipeDetail = this.recipeService.getRecipeByIndex(this.id);
      }
    );
  }

  sendIngredientToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipeDetail.ingredients);
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }
}
