import { Ingredient } from './../../shared/ingredient.model';
import { of, BehaviorSubject, Observable } from 'rxjs';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { RecipeDetailComponent } from './recipe-detail.component';
import { RecipeService } from '../recipe.service';
import { Router, ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { Injectable } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';

fdescribe('RecipeDetailComponent', () => {
  let component: RecipeDetailComponent;
  let fixture: ComponentFixture<RecipeDetailComponent>;
  const recipeServiceSpy: RecipeService =
    jasmine.createSpyObj('RecipeService', ['getRecipeByIndex', 'addIngredientsToShoppingList', 'deleteRecipe']);
//   const fakeActivatedRoute = {
//     route: {
//       params: {
//             id: 1
//         }
//     }
// };
  let addIngredientSpy: any;
  let deleteIngredientSpy: any;
  let getRecipeSpy: any;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipeDetailComponent ],
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
    fixture = TestBed.createComponent(RecipeDetailComponent);
    component = fixture.componentInstance;

    const service = fixture.debugElement.injector.get(RecipeService);
    addIngredientSpy = spyOn(service, 'addIngredientsToShoppingList').and.callThrough();
    deleteIngredientSpy = spyOn(service, 'deleteRecipe').and.callThrough();
    getRecipeSpy = spyOn(service, 'getRecipeByIndex').and.callThrough();

    router = fixture.debugElement.injector.get(Router);

    fixture.detectChanges();
  });

  fit('should initialize the recipeDetail in ngOnInit', () => {
    component.ngOnInit();
    console.log(component.id);
    expect(component.id).toEqual(1);
    expect(getRecipeSpy).toHaveBeenCalled();
    // expect(getRecipeSpy).toHaveBeenCalledTimes(1); // 2 times
    expect(getRecipeSpy).toHaveBeenCalledWith(1);
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });

  fit('should call addIngredientsToShoppingList', () => {
    component.sendIngredientToShoppingList();
    expect(addIngredientSpy).toHaveBeenCalled();
    expect(addIngredientSpy).toHaveBeenCalledTimes(1);
    expect(addIngredientSpy).toHaveBeenCalledWith([new Ingredient('test-ingredient', 1)]);
  });

  fit('should call deleteRecipe and navigate to /recipes', () => {
    component.id = 21;
    component.deleteRecipe();
    expect(deleteIngredientSpy).toHaveBeenCalled();
    expect(deleteIngredientSpy).toHaveBeenCalledTimes(1);
    expect(deleteIngredientSpy).toHaveBeenCalledWith(21);

    // testing redirection
    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['/recipes']);
  });

  fit('should call onEditRecipe and navigate to edit', () => {
    component.onEditRecipe();
    // testing redirection
    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledTimes(1);
    // expect(router.navigate).toHaveBeenCalledWith(['edit'], {relativeTo: { params: of({ id: 1 }) }}); // same data but fails...
  });

});

class MockRecipeService extends RecipeService {

  getRecipeByIndex(index: number): Recipe {
    return new Recipe('test-name', 'test-description', 'test-imagePath', [new Ingredient('test-ingredient', 1)]);
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {}

  deleteRecipe(index: number) {}
}
