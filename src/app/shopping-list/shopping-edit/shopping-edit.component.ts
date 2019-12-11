import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';

import { ShoppingListService } from './../shopping-list.service';
import { Ingredient } from './../../shared/ingredient.model';
import * as ShoppingListActions from '../ngRxStore/shopping-list.actions';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('fm', {static: false}) shoppingListForm: NgForm;
  subscription: Subscription;
  isEditMode = false;
  itemIndexNumber: number;
  editedItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService,
              private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>) { }

  ngOnInit() {
    this.subscription = this.shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.itemIndexNumber = index;
        this.isEditMode = true;
        this.editedItem = this.shoppingListService.getIngredient(index);
        this.shoppingListForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
    );
  }

  onSubmit(form: NgForm) {
    const newIngredient = new Ingredient(form.value.name, form.value.amount);
    if (this.isEditMode) {
      this.shoppingListService.updateIngredient(this.itemIndexNumber, newIngredient);
    } else {
      // this.shoppingListService.addNewIngredient(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredientAction(newIngredient));
    }
    this.isEditMode = false;
    this.shoppingListForm.reset();
  }

  clearForm() {
    this.isEditMode = false;
    this.shoppingListForm.reset();
  }

  deleteIngredient() {
    this.shoppingListService.deleteIngredientByIndex(this.itemIndexNumber);
    this.clearForm();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
