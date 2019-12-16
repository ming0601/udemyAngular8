import * as AuthActions from './ngRxStore/auth.actions';
import * as fromApp from './../ngRxStore/app.reducer';
import { PlaceholderDirective } from './../shared/placeholder/placeholder.directive';
import { AlertComponent } from './../shared/alert/alert.component';
import { AuthService, AuthPayloadResponse } from './auth.service';

import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  errorMessage = null;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
  private closeAlertSub: Subscription;
  private storeSub: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private componentFactoryResolver: ComponentFactoryResolver,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = false;
      this.errorMessage = authState.authErrorMsg;
      if (this.errorMessage) {
        this.showErrorAlert(this.errorMessage);
      }
    });
  }

  onChangeMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm) {
    if (!authForm.valid) {
      return;
    }

    this.isLoading = true;
    // let authObservable: Observable<AuthPayloadResponse>;

    const email = authForm.value.email;
    const password = authForm.value.password;
    if (this.isLoginMode) {
      // authObservable = this.authService.signIn(email, password);
      this.store.dispatch(new AuthActions.LoginStartAction({
        email: email,
        password: password
      }));
    } else {
      // authObservable = this.authService.signup(email, password);
      this.store.dispatch(new AuthActions.SignupStartAction({
        email: email,
        password: password
      }));
    }

    // authObservable.subscribe(
    //   responseData => {
    //     console.log(responseData);
    //     this.isLoading = false;
    //     this.router.navigate(['/recipes']);
    //   },
    //   error => {
    //     console.log(error);
    //     this.errorMessage = error;
    //     this.showErrorAlert(error);
    //     this.isLoading = false;
    //   }
    // );

    authForm.reset();
  }

  resetErrorMsg() {
    // this.errorMessage = null;
    this.store.dispatch(new AuthActions.ClearErrorAction());
  }

  showErrorAlert(message: string) {
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const alertCmpRef = hostViewContainerRef.createComponent(alertCmpFactory);
    alertCmpRef.instance.message = message;

    this.closeAlertSub = alertCmpRef.instance.closeAlert.subscribe(() => {
      this.closeAlertSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  ngOnDestroy() {
    if (this.closeAlertSub) {
      this.closeAlertSub.unsubscribe();
    }
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
}
