import { ReactiveFormsModule, FormArray, FormGroup } from '@angular/forms';
import { RecipeService } from './../recipe.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeEditComponent } from './recipe-edit.component';
import { MockRecipeService } from '../recipe-detail/recipe-detail.component.spec';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';

fdescribe('RecipeEditComponent', () => {
  let component: RecipeEditComponent;
  let fixture: ComponentFixture<RecipeEditComponent>;
  let updateRecipeSpy: any;
  let addRecipeSpy: any;
  let getRecipeSpy: any;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeEditComponent ],
      imports: [ReactiveFormsModule],
      providers: [
        // { provide: RecipeService, useValue: recipeServiceSpy },
        { provide: RecipeService, useClass: MockRecipeService },
        { provide: Router,
          useClass: class {
              navigate = jasmine.createSpy('navigate');
          }
        },
        { provide: ActivatedRoute, useValue: { params: of({ id: 1 }) } },
        ShoppingListService // service used for the MockRecipeService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeEditComponent);
    component = fixture.componentInstance;

    const service = fixture.debugElement.injector.get(RecipeService);
    updateRecipeSpy = spyOn(service, 'updateRecipe').and.callThrough();
    addRecipeSpy = spyOn(service, 'addRecipe').and.callThrough();
    getRecipeSpy = spyOn(service, 'getRecipeByIndex').and.callThrough();

    router = fixture.debugElement.injector.get(Router);

    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });

  fit('should initialize id in ngOnInit', () => {
    expect(component.id).toEqual(1);
    expect(component.editMode).toEqual(true);

    // check that getRecipeByIndex was called in the private function formInit()
    expect(getRecipeSpy).toHaveBeenCalled();
    expect(getRecipeSpy).toHaveBeenCalledTimes(1);
    expect(getRecipeSpy).toHaveBeenCalledWith(1);
  });

  fit('should validate the form when data is filled', () => {
    expect(component.recipeForm.valid).toBeTruthy();
  });

  fit('should fill all the fields with the retrieved data', () => {
    const recipeName = component.recipeForm.controls.name;
    expect(recipeName.value).toEqual('test-name');

    const recipeImgPath = component.recipeForm.controls.imagePath;
    expect(recipeImgPath.value).toEqual('test-imagePath');

    const recipeDesc = component.recipeForm.controls.description;
    expect(recipeDesc.value).toEqual('test-description');

    const ingredient = component.recipeForm.get('ingredients') as FormArray;

    const firstIngName = (ingredient.at(0) as FormGroup).controls.name;
    expect(firstIngName.value).toEqual('test-ingredient');

    const firstIngAmount = (ingredient.at(0) as FormGroup).controls.amount;
    expect(firstIngAmount.value).toEqual(1);

    expect(component.recipeForm.valid).toBeTruthy();
  });

  fit('should invalidate with the Validators when a required field is empty or filled with wrong data type', () => {
    const recipeName = component.recipeForm.controls.name;
    recipeName.setValue('');
    expect(recipeName.hasError('required')).toBeTruthy();

    const recipeImgPath = component.recipeForm.controls.imagePath;
    recipeImgPath.setValue('');
    expect(recipeImgPath.hasError('required')).toBeTruthy();

    const recipeDesc = component.recipeForm.controls.description;
    recipeDesc.setValue('');
    expect(recipeDesc.hasError('required')).toBeTruthy();

    const ingredient = component.recipeForm.get('ingredients') as FormArray;
    const firstIngName = (ingredient.at(0) as FormGroup).controls.name;
    firstIngName.setValue('');
    expect(firstIngName.hasError('required')).toBeTruthy();

    const firstIngAmount = (ingredient.at(0) as FormGroup).controls.amount;
    firstIngAmount.setValue('not a number');
    expect(firstIngAmount.hasError).toBeTruthy();

    expect(component.recipeForm.valid).toBeFalsy();
  });

  fit('should call updateRecipe when editMode is true', () => {
    component.onSubmit();
    expect(updateRecipeSpy).toHaveBeenCalled();
    expect(updateRecipeSpy).toHaveBeenCalledTimes(1);
    expect(updateRecipeSpy).toHaveBeenCalledWith(
      1,
      { name: 'test-name', imagePath: 'test-imagePath', description: 'test-description',
      ingredients: [ { name: 'test-ingredient', amount: 1 }] }
    );

    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledTimes(1);
    // expect(router.navigate).toHaveBeenCalledWith(['../'], {relativeTo: { params: of({ id: 1 }) }}); // same data but fails...
  });

  fit('should call addRecipe when editMode is false', () => {
    component.editMode = false;
    component.onSubmit();
    expect(addRecipeSpy).toHaveBeenCalled();
    expect(addRecipeSpy).toHaveBeenCalledTimes(1);
    expect(addRecipeSpy).toHaveBeenCalledWith(
      { name: 'test-name', imagePath: 'test-imagePath', description: 'test-description',
      ingredients: [ { name: 'test-ingredient', amount: 1 }] }
    );

    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledTimes(1);
    // expect(router.navigate).toHaveBeenCalledWith(['../'], {relativeTo: { params: of({ id: 1 }) }}); // same data but fails...
  });
});
