import { ReactiveFormsModule } from '@angular/forms';
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
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });
});
