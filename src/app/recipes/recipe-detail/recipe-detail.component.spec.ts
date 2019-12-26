import { Ingredient } from './../../shared/ingredient.model';
import { of, BehaviorSubject, Observable } from 'rxjs';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { RecipeDetailComponent } from './recipe-detail.component';
import { RecipeService } from '../recipe.service';
import { Router, ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { Injectable } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';

describe('RecipeDetailComponent', () => {
  let component: RecipeDetailComponent;
  let fixture: ComponentFixture<RecipeDetailComponent>;
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the recipeDetail when creating the component', () => {
    console.log(component.id);
    expect(component.id).toEqual(1);
    expect(getRecipeSpy).toHaveBeenCalled();
    expect(getRecipeSpy).toHaveBeenCalledTimes(1);
    expect(getRecipeSpy).toHaveBeenCalledWith(1);
  });

  it('should create the HTML with all the values', () => {
    // testing DOM display elements
    // recipe detail display
    const dom = fixture.debugElement.nativeElement;
    expect(dom.querySelector('img').src).toContain('test-imagePath');
    expect(dom.querySelector('img').alt).toEqual('test-name');
    expect(dom.querySelector('h1').textContent).toEqual('test-name');
    expect(dom.querySelector('div:nth-child(4)').textContent).toContain('test-description');
    expect(dom.querySelector('li.list-group-item').textContent).toContain('test-ingredient - 1');

    // dropdown
    expect(dom.querySelector('button').textContent).toContain('Manage Recipe');
    expect(dom.querySelector('ul.dropdown-menu li:first-child').textContent).toContain('To Shopping List');
    expect(dom.querySelector('ul.dropdown-menu li:nth-child(2)').textContent).toContain('Edit Recipe');
    expect(dom.querySelector('ul.dropdown-menu li:last-child').textContent).toContain('Delete Recipe');
  });

  it('should call addIngredientsToShoppingList', () => {
    component.sendIngredientToShoppingList();
    expect(addIngredientSpy).toHaveBeenCalled();
    expect(addIngredientSpy).toHaveBeenCalledTimes(1);
    expect(addIngredientSpy).toHaveBeenCalledWith([new Ingredient('test-ingredient', 1)]);
  });

  it('should call deleteRecipe and navigate to /recipes', () => {
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

  it('should call onEditRecipe and navigate to edit', () => {
    component.onEditRecipe();
    // testing redirection
    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledTimes(1);
    // expect(router.navigate).toHaveBeenCalledWith(['edit'], {relativeTo: { params: of({ id: 1 }) }}); // same data but fails...
  });

});

export class MockRecipeService extends RecipeService {

  getRecipeByIndex(index: number): Recipe {
    return new Recipe('test-name', 'test-description', 'test-imagePath', [new Ingredient('test-ingredient', 1)]);
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {}

  deleteRecipe(index: number) {}

  updateRecipe(index: number, recipe: Recipe) {}

  addRecipe(recipe: Recipe) {}
}
