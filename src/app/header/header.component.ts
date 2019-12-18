import * as RecipesActions from './../recipes/ngRxStore/recipes.actions';
import * as AuthActions from './../auth/ngRxStore/auth.actions';
import * as fromApp from './../ngRxStore/app.reducer';
import { AuthService } from './../auth/auth.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  userSub: Subscription;
  constructor(
    private userAuthService: AuthService,
    private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    // In this pipe we don't take 1 because we have to listen all changes
    // in order to update HTML li accordingly
    this.userSub = this.store.select('auth').pipe(
      map(authState => authState.user)
    ).subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  saveRecipes() {
    this.store.dispatch(new RecipesActions.StoreRecipesAction());
  }

  fetchRecipes() {
    this.store.dispatch(new RecipesActions.FetchRecipesAction());
  }

  logOut() {
    this.store.dispatch(new AuthActions.LogoutAction());
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
