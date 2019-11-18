import { RecipeService } from './../recipe.service';
import { Recipe } from './../recipe.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  @Input() recipeDetail: Recipe;

  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
  }

  sendIngredientToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipeDetail.ingredients);
  }
}
