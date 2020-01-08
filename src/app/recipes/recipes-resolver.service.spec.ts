import { MockShoppingListService } from './../shopping-list/shopping-edit/shopping-edit.component.spec';
import { Observable, of } from 'rxjs';
import { Recipe } from './recipe.model';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { RecipeResolverService } from './recipes-resolver.service';
import { MockRecipeService } from './recipe-detail/recipe-detail.component.spec';
import { MockDataStorageService } from './../header/header.component.spec';
import { RecipeService } from './recipe.service';
import { DataStorageService } from './../shared/data-storage-service';
import { TestBed, getTestBed, fakeAsync, tick } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Ingredient } from '../shared/ingredient.model';

describe('RecipeResolverService', () => {

    let resolver: RecipeResolverService;
    let dsService: DataStorageService;
    let recipeService: RecipeService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes([]),
                HttpClientTestingModule
            ],
            providers: [
                { provide: DataStorageService, useClass: MockDataStorageService},
                { provide: RecipeService, useClass: MockRecipeService},
                { provide: ShoppingListService, useClass: MockShoppingListService}
            ]
        });
        dsService = getTestBed().get(DataStorageService);
        recipeService = getTestBed().get(RecipeService);
        resolver = new RecipeResolverService(dsService, recipeService);
    });

    it('should create', () => expect(dsService).toBeTruthy());

    it('should return recipeService data when recipeService data is available', fakeAsync (() => {
        const recipeSpy = spyOn(recipeService, 'getRecipes').and.returnValue(
            [new Recipe('test-name1', 'test-description1', 'test-imagePath1', [new Ingredient('test-ingredient', 1)])]
        );
        const dsSpy = spyOn(dsService, 'fetchRecipes');

        const result = resolver.resolve() as Recipe[];
        tick();

        console.log(result);
        expect(dsSpy).not.toHaveBeenCalled();
        expect(recipeSpy).toHaveBeenCalledTimes(1);
        expect(result).toEqual([new Recipe('test-name1', 'test-description1', 'test-imagePath1', [new Ingredient('test-ingredient', 1)])]);
    }));

    it('should return dataStorageService data when recipeService data is unavailable', fakeAsync (() => {
        const recipeSpy = spyOn(recipeService, 'getRecipes').and.returnValue([]);
        const dsSpy = spyOn(dsService, 'fetchRecipes').and.returnValue(
            of([new Recipe('test-name', 'test-description', 'test-imagePath', [new Ingredient('test-ingredient', 1)])])
        );

        const result = resolver.resolve() as Observable<Recipe[]>;
        tick();

        console.log(result);
        result.subscribe((recipes: Recipe[]) => {
            expect(recipeSpy).toHaveBeenCalledTimes(1);
            expect(dsSpy).toHaveBeenCalledTimes(1);
            expect(recipes).toEqual(
                [new Recipe('test-name', 'test-description', 'test-imagePath', [new Ingredient('test-ingredient', 1)])]);
        });
    }));
});
