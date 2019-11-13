import { Recipe } from './../../recipe.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {
  @Input() recipeItem: Recipe;
  @Output() recipeEvent = new EventEmitter<void>();
  constructor() { }

  ngOnInit() {
  }

  onSelectedRecipe() {
    this.recipeEvent.emit();
  }
}
