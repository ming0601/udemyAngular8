import { Recipe } from './../recipes/recipe.model';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { RecipeService } from './../recipes/recipe.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { DataStorageService } from './../shared/data-storage-service';
import { User } from './../shared/user.model';
import { AuthService } from './../auth/auth.service';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let logOutSpy: any;
  let authService: AuthService;
  let dsService: DataStorageService;
  let saveRecipesSpy: any;
  let fetchRecipesSpy: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientModule
      ],
      declarations: [ HeaderComponent ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: DataStorageService, useClass: MockDataStorageService },
        RecipeService,
        ShoppingListService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;

    authService = fixture.debugElement.injector.get(AuthService);
    logOutSpy = spyOn(authService, 'logOut');

    dsService = fixture.debugElement.injector.get(DataStorageService);
    saveRecipesSpy = spyOn(dsService, 'storeRecipes');
    fetchRecipesSpy = spyOn(dsService, 'fetchRecipes').and.returnValue(
      of([new Recipe('test-name', 'test-description', 'test-imagePath', [new Ingredient('test-ingredient', 1)])]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    const dom = fixture.debugElement.nativeElement;
    expect(dom.querySelector('div.container-fluid').innerText).toContain('Recipe Book');
  });

  it('should initialize userSub when calling ngOnInit and the template should only display Authenticate and Shopping List elements',
  () => {
    // first init, isAuthenticated should be falsy
    component.ngOnInit();
    expect(component.userSub).toBeDefined();
    expect(component.isAuthenticated).toBeFalsy();

    const dom = fixture.debugElement.nativeElement;
    expect(dom.querySelector('ul.navbar-nav li:first-child a').innerText).not.toContain('Recipes');
    expect(dom.querySelector('ul.navbar-nav li:first-child a').innerText).toContain('Authenticate');
    expect(dom.querySelector('ul.navbar-nav li:last-child a').innerText).toContain('Shopping list');

    expect(dom.querySelector('ul.navbar-nav ml-auto li:first-child')).toBeFalsy();
  });

  it('should initialize userSub when calling ngOnInit and the template should only display isAuthenticated view', () => {
    // first init, isAuthenticated should be truthy when a user exists
    component.ngOnDestroy();
    component.ngOnInit();
    authService.user.next(new User('testUser.email', 'testUser.localId', 'testUser.idToken', new Date()));
    expect(component.userSub).toBeDefined();
    expect(component.isAuthenticated).toBeTruthy();

    // this is mandatory to detect changes for the template rendering
    fixture.detectChanges();

    const dom = fixture.debugElement.nativeElement;
    expect(dom.querySelector('ul.navbar-nav li:first-child a').innerText).not.toContain('Authenticate');
    expect(dom.querySelector('ul.navbar-nav li:first-child a').innerText).toContain('Recipes');
    expect(dom.querySelector('ul.navbar-nav li:last-child a').innerText).toContain('Shopping list');

    expect(dom.querySelector('ul.ml-auto li:first-child a').innerText).toContain('Log Out');
    expect(dom.querySelector('li.dropdown a').innerText).toContain('Manage');

    expect(dom.querySelector('div.dropdown-menu li:first-child a').innerText).toContain('Save Data');
    expect(dom.querySelector('div.dropdown-menu li:last-child a').innerText).toContain('Fetch Data');
  });

  it('should call userAuthService.logOut when logOut is called', () => {
    component.logOut();
    expect(logOutSpy).toHaveBeenCalled();
    expect(logOutSpy).toHaveBeenCalledTimes(1);
  });

  it('should unsubscribe to userSub when ngOnDestroy is called', () => {
    component.ngOnDestroy();
    // closed is used for checking if a subscription is unsubscribed
    expect(component.userSub.closed).toBeTruthy();
  });

  it('should call dataStorageService.storeRecipes when saveRecipes is called', () => {
    component.saveRecipes();
    expect(saveRecipesSpy).toHaveBeenCalled();
    expect(saveRecipesSpy).toHaveBeenCalledTimes(1);
  });

  it('should call dataStorageService.fetchRecipes when fetchRecipes is called', () => {
    component.fetchRecipes();
    expect(fetchRecipesSpy).toHaveBeenCalled();
    expect(fetchRecipesSpy).toHaveBeenCalledTimes(1);
  });
});

export class MockAuthService extends AuthService {
  user = new BehaviorSubject<User>(null);

  signup(email: string, password: string): Observable<any> {
    return of(new User('testUser.email', 'testUser.localId', 'testUser.idToken', new Date()));
  }

  signIn(email: string, password: string): Observable<any> {
    return of(new User('testUser.email', 'testUser.localId', 'testUser.idToken', new Date()));
  }

  logOut() {}
}

export class MockDataStorageService extends DataStorageService {

  storeRecipes() {}

  fetchRecipes(): Observable<Recipe[]> {
    return of([new Recipe('test-name', 'test-description', 'test-imagePath', [new Ingredient('test-ingredient', 1)])]);
  }
}
