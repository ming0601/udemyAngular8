import { MockShoppingListService } from './shopping-edit/shopping-edit.component.spec';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Ingredient } from '../shared/ingredient.model';

describe('ShoppingListComponent', () => {
  let component: ShoppingListComponent;
  let fixture: ComponentFixture<ShoppingListComponent>;
  let slService: ShoppingListService;
  let getIngSpy: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule
      ],
      declarations: [ ShoppingListComponent, ShoppingEditComponent ],
      providers: [
        { provide: ShoppingListService, useClass: MockShoppingListService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingListComponent);
    component = fixture.componentInstance;
    slService = fixture.debugElement.injector.get(ShoppingListService);
    getIngSpy = spyOn(slService, 'getIngredients').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should unsubscribe to subscription when ngOnDestroy is called', () => {
    component.ngOnDestroy();
    // closed is used for checking if a subscription is unsubscribed
    expect(component.subscription.closed).toBeTruthy();
  });

  it('should emit a new item id when editItem is called', () => {
    const nextSpy = spyOn(slService.startedEditing, 'next').and.callThrough();
    component.editItem(1);

    expect(nextSpy).toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalledWith(1);
    expect(nextSpy).toHaveBeenCalledTimes(1);
  });

  it('should set ingredients and subscription when initializing the component', async () => {
    await slService.ingredientsChanged.next(
      [
        new Ingredient('test-1', 1),
        new Ingredient('test-2', 2)
      ]
      );
    expect(getIngSpy).toHaveBeenCalled();
    expect(getIngSpy).toHaveBeenCalledTimes(1);
    expect(component.ingredients).toEqual(
      [
        new Ingredient('test-1', 1),
        new Ingredient('test-2', 2)
      ]
    );

    fixture.detectChanges();
    const dom = fixture.debugElement.nativeElement;
    // testing that ingredients are well rendered
    expect(dom.querySelectorAll('a.list-group-item').length).toEqual(2);
    expect(dom.querySelector('a.list-group-item:first-child').innerText).toEqual('test-1 (1) ');
    expect(dom.querySelector('a.list-group-item:nth-child(2)').innerText).toEqual('test-2 (2)');

    // testing that shopping edit component is well rendered
    expect(dom.querySelector('div.col-sm-5 label').innerText).toEqual('Name');
    expect(dom.querySelector('input#name').value).toEqual('');

    expect(dom.querySelector('div.col-sm-2 label').innerText).toEqual('Amount');
    expect(dom.querySelector('input#amount').value).toEqual('');

    expect(dom.querySelector('button.btn-success').innerText).not.toEqual('Update');
    expect(dom.querySelector('button.btn-success').innerText).toEqual('Add');
    expect(dom.querySelector('button.btn-primary').innerText).toEqual('Clear');
  });
});
