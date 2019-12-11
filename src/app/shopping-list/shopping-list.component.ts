import { ShoppingListService } from './shopping-list.service';
import { Ingredient } from './../shared/ingredient.model';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  // ingredients: Ingredient[];
  ingredients = new Observable<{ ingredients: Ingredient[] }>();
  // private subscription: Subscription;

  constructor(private shoppingListService: ShoppingListService,
              private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>) { }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
    // this.ingredients = this.shoppingListService.getIngredients();
    // this.subscription = this.shoppingListService.ingredientsChanged.subscribe(
    //   (ings: Ingredient[]) => {
    //     this.ingredients = ings;
    //   }
    // );
  }

  editItem(id: number) {
    this.shoppingListService.startedEditing.next(id);
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}
