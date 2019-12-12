// import { ShoppingListService } from './shopping-list.service';
import { Ingredient } from './../shared/ingredient.model';
import * as ShoppingListActions from '../shopping-list/ngRxStore/shopping-list.actions';
import * as fromApp from './../ngRxStore/app.reducer';

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

  constructor(
              // private shoppingListService: ShoppingListService,
              private store: Store<fromApp.AppState>) { }

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
    // this.shoppingListService.startedEditing.next(id);
    this.store.dispatch(new ShoppingListActions.StartEditAction(id));
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
}
