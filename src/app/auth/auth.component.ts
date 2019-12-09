import { PlaceholderDirective } from './../shared/placeholder/placeholder.directive';
import { AlertComponent } from './../shared/alert/alert.component';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, AuthPayloadResponse } from './auth.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, ComponentFactoryResolver, ViewChild } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  errorMessage = null;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;

  constructor(private authService: AuthService,
              private router: Router,
              private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
  }

  onChangeMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm) {
    if (!authForm.valid) {
      return;
    }

    this.isLoading = true;
    let authObservable: Observable<AuthPayloadResponse>;

    const email = authForm.value.email;
    const password = authForm.value.password;
    if (this.isLoginMode) {
      authObservable = this.authService.signIn(email, password);
    } else {
      authObservable = this.authService.signup(email, password);
    }

    authObservable.subscribe(
      responseData => {
        console.log(responseData);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error => {
        console.log(error);
        this.errorMessage = error;
        this.showErrorAlert(error);
        this.isLoading = false;
      }
    );

    authForm.reset();
  }

  resetErrorMsg() {
    this.errorMessage = null;
  }

  showErrorAlert(message: string) {
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    hostViewContainerRef.createComponent(alertCmpFactory);
  }
}
