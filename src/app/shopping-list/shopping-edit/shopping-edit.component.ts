import { Subscription } from 'rxjs';
import { ShoppingListService } from './../shopping-list.service';
import { Ingredient } from './../../shared/ingredient.model';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

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

  constructor(private shoppingListService: ShoppingListService) { }

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
      this.shoppingListService.addNewIngredient(newIngredient);
    }
    this.clearForm();
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
