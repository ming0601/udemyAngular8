import { RouterTestingModule } from '@angular/router/testing';
import { LoadingSpinnerComponent } from './../../../shared/loading-spinner/loading-spinner.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeItemComponent } from './recipe-item.component';
import { Recipe } from '../../recipe.model';
import { Ingredient } from 'src/app/shared/ingredient.model';

describe('RecipeItemComponent', () => {
  let component: RecipeItemComponent;
  let fixture: ComponentFixture<RecipeItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [ RecipeItemComponent, LoadingSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeItemComponent);
    component = fixture.componentInstance;
    component.recipeItem = new Recipe('test-name', 'test-description', 'test-imagePath', [new Ingredient('test-ingredient-name', 2)]);
    component.index = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should feed HTML with preset values', () => {
    const dom = fixture.debugElement.nativeElement;
    expect(dom.querySelector('h4').textContent).toContain('test-name');
    expect(dom.querySelector('p').textContent).toContain('test-description');
    expect(dom.querySelector('img').alt).toContain('test-name');
  });
});
