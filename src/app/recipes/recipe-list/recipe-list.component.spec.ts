import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { RecipeItemComponent } from './recipe-item/recipe-item.component';
import { of } from 'rxjs';
import { MockRecipeService } from './../recipe-detail/recipe-detail.component.spec';
import { RecipeService } from './../recipe.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { RecipeListComponent } from './recipe-list.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Recipe } from '../recipe.model';
import { Ingredient } from 'src/app/shared/ingredient.model';

describe('RecipeListComponent', () => {
  let component: RecipeListComponent;
  let fixture: ComponentFixture<RecipeListComponent>;
  let recipeService: RecipeService;
  let getRecipesSpy: any;
  let routerSpy: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientModule
      ],
      declarations: [ RecipeListComponent, RecipeItemComponent ],
      providers: [
        ShoppingListService,
        { provide: RecipeService, useClass: MockRecipeService },
        { provide: ActivatedRoute, useValue: { snapshot: {}, params: of({ id: 1 }) } }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeListComponent);
    component = fixture.componentInstance;
    recipeService = fixture.debugElement.injector.get(RecipeService);
    getRecipesSpy = spyOn(recipeService, 'getRecipes').and.callThrough();

    const router = fixture.debugElement.injector.get(Router);
    routerSpy = spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize Recipe with the Subject data when creating the component and getRecipes returns empty array', async () => {
    expect(getRecipesSpy).toHaveBeenCalled();
    expect(getRecipesSpy).toHaveBeenCalledTimes(1);
    expect(component.recipes).toEqual([]);

    await recipeService.recipeChanged.next(
      [
        new Recipe('test-name1', 'test-description1', 'test-imagePath1',
              [new Ingredient('test-ingredient1', 1)]),
        new Recipe('test-name2', 'test-description2', 'test-imagePath2',
              [new Ingredient('test-ingredient2', 2), new Ingredient('test-ingredient2bis', 2)])
      ]
    );

    expect(component.recipes).toEqual(
      [
        new Recipe('test-name1', 'test-description1', 'test-imagePath1',
              [new Ingredient('test-ingredient1', 1)]),
        new Recipe('test-name2', 'test-description2', 'test-imagePath2',
              [new Ingredient('test-ingredient2', 2), new Ingredient('test-ingredient2bis', 2)])
      ]
    );
  });

  it('should not render recipes template when recipe array is empty', () => {

    recipeService.recipeChanged.next([]);

    expect(component.recipes).toEqual([]);

    fixture.detectChanges();
    const dom = fixture.debugElement.nativeElement;
    expect(dom.querySelector('button').innerText).toContain('New Recipes');
    expect(dom.querySelectorAll('app-recipe-item').length).toEqual(0);
  });

  it('should render recipes template when recipe array is set', () => {

    recipeService.recipeChanged.next(
      [
        new Recipe('test-name1', 'test-description1', 'test-imagePath1',
              [new Ingredient('test-ingredient1', 1)]),
        new Recipe('test-name2', 'test-description2', 'test-imagePath2',
              [new Ingredient('test-ingredient2', 2), new Ingredient('test-ingredient2bis', 2)])
      ]
    );

    expect(component.recipes).toEqual(
      [
        new Recipe('test-name1', 'test-description1', 'test-imagePath1',
              [new Ingredient('test-ingredient1', 1)]),
        new Recipe('test-name2', 'test-description2', 'test-imagePath2',
              [new Ingredient('test-ingredient2', 2), new Ingredient('test-ingredient2bis', 2)])
      ]
    );

    fixture.detectChanges();
    const dom = fixture.debugElement.nativeElement;
    expect(dom.querySelector('button').innerText).toContain('New Recipes');
    expect(dom.querySelectorAll('app-recipe-item').length).toEqual(2);

    expect(dom.querySelector('app-recipe-item:first-child img').src).toContain('test-imagePath1');
    expect(dom.querySelector('app-recipe-item:first-child img').alt).toEqual('test-name1');
    expect(dom.querySelector('app-recipe-item:first-child h4').textContent).toEqual('test-name1');

    expect(dom.querySelector('app-recipe-item:nth-child(2) img').src).toContain('test-imagePath2');
    expect(dom.querySelector('app-recipe-item:nth-child(2) img').alt).toEqual('test-name2');
    expect(dom.querySelector('app-recipe-item:nth-child(2) h4').textContent).toEqual('test-name2');
  });

  it('should navigate to new when onNewRecipe is called', () => {
    component.onNewRecipe();
    expect(routerSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledTimes(1);
  });

  it('should unsubscribe to subscription when ngOnDestroy is called', () => {
    component.ngOnDestroy();
    // closed is used for checking if a subscription is unsubscribed
    expect(component.subscription.closed).toBeTruthy();
  });
});
