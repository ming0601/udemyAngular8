import * as AuthActions from './auth/ngRxStore/auth.actions';
import * as fromApp from './ngRxStore/app.reducer';
import { Store } from '@ngrx/store';
import { AuthService } from './auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-8-complete';

  constructor(
    // private authService: AuthService,
    private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    // this.authService.autoLogin();
    this.store.dispatch(new AuthActions.AutoLoginAction());
  }
}
