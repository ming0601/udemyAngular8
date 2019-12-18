import * as RecipesActions from './../recipes/ngRxStore/recipes.actions';
import * as AuthActions from './../auth/ngRxStore/auth.actions';
import * as fromApp from './../ngRxStore/app.reducer';
import { AuthService } from './../auth/auth.service';
import { Subscription } from 'rxjs';
import { DataStorageService } from './../shared/data-storage-service';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { take, map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  userSub: Subscription;
  constructor(private dataStorageService: DataStorageService, private userAuthService: AuthService, private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    // this.userSub = this.userAuthService.user.subscribe(user => {
    //   this.isAuthenticated = !!user;
    // });
    // In this pipe we don't take 1 because we have to listen all changes
    // in order to update HTML li accordingly
    this.userSub = this.store.select('auth').pipe(
      map(authState => authState.user)
    ).subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  saveRecipes() {
    this.dataStorageService.storeRecipes();
  }

  fetchRecipes() {
    // this.dataStorageService.fetchRecipes().subscribe();
    this.store.dispatch(new RecipesActions.FetchRecipesAction());
  }

  logOut() {
    // this.userAuthService.logOut();
    this.store.dispatch(new AuthActions.LogoutAction());
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
