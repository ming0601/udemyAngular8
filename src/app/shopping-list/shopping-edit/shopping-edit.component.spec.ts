import { ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { ShoppingEditComponent } from './shopping-edit.component';
import { Subject } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';

describe('ShoppingEditComponent', () => {
  let component: ShoppingEditComponent;
  let fixture: ComponentFixture<ShoppingEditComponent>;
  let slService: ShoppingListService;
  let getIngSpy: any;
  let updateIngSpy: any;
  let addNewIngSpy: any;
  let deleteIngSpy: any;
  let formSetValSpy: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule
      ],
      declarations: [ ShoppingEditComponent ],
      providers: [
        { provide: ShoppingListService, useClass: MockShoppingListService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingEditComponent);
    component = fixture.componentInstance;

    slService = fixture.debugElement.injector.get(ShoppingListService);
    getIngSpy = spyOn(slService, 'getIngredient').and.callThrough();
    updateIngSpy = spyOn(slService, 'updateIngredient').and.callThrough();
    addNewIngSpy = spyOn(slService, 'addNewIngredient').and.callThrough();
    deleteIngSpy = spyOn(slService, 'deleteIngredientByIndex').and.callThrough();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize data when initializing the component', () => {
    formSetValSpy = spyOn(component.shoppingListForm, 'setValue').and.callThrough();
    slService.startedEditing.next(1);
    expect(component.itemIndexNumber).toEqual(1);
    expect(component.isEditMode).toBeTruthy();
    expect(component.editedItem).toEqual(new Ingredient('test-name', 1));
    expect(component.shoppingListForm).toBeTruthy();
    expect(component.shoppingListForm).toBeDefined();
    expect(formSetValSpy).toHaveBeenCalled();
  });

  it('should unsubscribe to subscription when ngOnDestroy is called', () => {
    component.ngOnDestroy();
    // closed is used for checking if a subscription is unsubscribed
    expect(component.subscription.closed).toBeTruthy();
  });

  it('should call shoppingListService.deleteIngredient when deleteIngredient is called and clear the form', () => {
    const testForm =
      { value: { name: 'test-name', amount: 0 },
        valid: true, reset: () => { testForm.value.name = ''; testForm.value.amount = undefined; } } as NgForm;

    component.shoppingListForm = testForm;
    component.itemIndexNumber = 0;
    component.deleteIngredient();

    expect(deleteIngSpy).toHaveBeenCalled();
    expect(deleteIngSpy).toHaveBeenCalledWith(0);
    expect(deleteIngSpy).toHaveBeenCalledTimes(1);
    expect(component.isEditMode).toBeFalsy();
    expect(testForm.value.name).toEqual('');
    expect(testForm.value.amount).toBeUndefined();
  });

  it('should reset the form and set isEditMode to false when clearForm is called', () => {
    const testForm =
      { value: { name: 'test-name', amount: 0 },
        valid: true, reset: () => { testForm.value.name = ''; testForm.value.amount = undefined; } } as NgForm;

    component.shoppingListForm = testForm;
    component.clearForm();

    expect(component.isEditMode).toBeFalsy();
    expect(testForm.value.name).toEqual('');
    expect(testForm.value.amount).toBeUndefined();
  });

  it('should call updateIngredient when isEditMode is truthy on Submit', () => {
    const testForm =
      { value: { name: 'test-name', amount: 1 },
        valid: true, reset: () => { testForm.value.name = ''; testForm.value.amount = undefined; } } as NgForm;

    component.shoppingListForm = testForm;
    component.isEditMode = true;
    component.onSubmit(testForm);

    expect(updateIngSpy).toHaveBeenCalled();
    expect(updateIngSpy).toHaveBeenCalledTimes(1);
    expect(component.isEditMode).toBeFalsy();
    expect(testForm.value.name).toEqual('');
    expect(testForm.value.amount).toBeUndefined();
  });

  it('should call addNewIngredient when isEditMode is falsy on Submit', () => {
    const testForm =
      { value: { name: 'test-name', amount: 1 },
        valid: true, reset: () => { testForm.value.name = ''; testForm.value.amount = undefined; } } as NgForm;

    component.shoppingListForm = testForm;
    component.isEditMode = false;
    component.onSubmit(testForm);

    expect(addNewIngSpy).toHaveBeenCalled();
    expect(addNewIngSpy).toHaveBeenCalledTimes(1);
    expect(component.isEditMode).toBeFalsy();
    expect(testForm.value.name).toEqual('');
    expect(testForm.value.amount).toBeUndefined();
  });

  it('should display new data when shoppingListForm is set with new values', async () => {
    component.isEditMode = true;
    await slService.startedEditing.next(1);
    component.shoppingListForm.setValue({
      name: 'test-name',
      amount: 2
    });
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.shoppingListForm.controls.name.value).toEqual('test-name');
      expect(component.shoppingListForm.controls.amount.value).toEqual(2);
    });
    const dom = fixture.debugElement.nativeElement;
    expect(dom.querySelector('div.col-sm-5 label').innerText).toEqual('Name');
    expect(dom.querySelector('input#name').value).toEqual('test-name');

    expect(dom.querySelector('div.col-sm-2 label').innerText).toEqual('Amount');
    expect(dom.querySelector('input#amount').value).toEqual('2');

    expect(dom.querySelector('button.btn-success').innerText).toEqual('Update');
    expect(dom.querySelector('button.btn-success').innerText).not.toEqual('Add');
    expect(dom.querySelector('button.btn-danger').innerText).toEqual('Delete');
    expect(dom.querySelector('button.btn-primary').innerText).toEqual('Clear');
  });
});

export class MockShoppingListService extends ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  addNewIngredient(ingredient: Ingredient) { }

  getIngredients(): Ingredient[] {
    return [];
  }

  getIngredient(index: number): Ingredient {
    return new Ingredient('test-name', 1);
  }

  addIngredients(ingredients: Ingredient[]) { }

  updateIngredient(index: number, ingredient: Ingredient) { }

  deleteIngredientByIndex(index: number) { }
}
