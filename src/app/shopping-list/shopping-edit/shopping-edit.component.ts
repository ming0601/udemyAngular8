import { element } from 'protractor';
import { Ingredient } from './../../shared/ingredient.model';
import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('nameInput', {static: false}) ingredientName: ElementRef;
  @ViewChild('amountInput', {static: false}) ingredientAmount: ElementRef;
  @Output() newAddedIngredient = new EventEmitter<Ingredient>();

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    this.newAddedIngredient.emit(
      new Ingredient(this.ingredientName.nativeElement.value,
                    this.ingredientAmount.nativeElement.value));
  }
}
