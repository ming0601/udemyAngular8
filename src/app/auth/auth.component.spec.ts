import { User } from './../shared/user.model';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';
import { LoadingSpinnerComponent } from './../shared/loading-spinner/loading-spinner.component';
import { MockAuthService } from './../header/header.component.spec';
import { AuthService } from './auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed, flush, fakeAsync, tick } from '@angular/core/testing';

import { AuthComponent } from './auth.component';
import { Router } from '@angular/router';
import { ComponentFactoryResolver } from '@angular/core';
import { of, throwError, Subscription } from 'rxjs';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let router: Router;
  let authService: AuthService;
  let authServiceSignUpSpy: any;
  let authServiceSignInSpy: any;
  let componentFactoryResolver: ComponentFactoryResolver;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule
      ],
      declarations: [
        AuthComponent,
        LoadingSpinnerComponent
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router,
          useClass: class {
              navigate = jasmine.createSpy('navigate');
          }
        },
        { provide: ComponentFactoryResolver,
          useClass: class {
            resolveComponentFactory = jasmine.createSpy('resolveComponentFactory');
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    router = fixture.debugElement.injector.get(Router);
    authService = fixture.debugElement.injector.get(AuthService);
    componentFactoryResolver = fixture.debugElement.injector.get(ComponentFactoryResolver);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change isLoginMode when onChangeMode is called', () => {
    expect(component.isLoginMode).toBeTruthy();
    component.onChangeMode();
    expect(component.isLoginMode).toBeFalsy();
  });

  it('should reset errorMsg when resetErrorMsg is called', () => {
    component.errorMessage = 'test-error-message';
    expect(component.errorMessage).toContain('test-error-message');

    component.resetErrorMsg();
    expect(component.errorMessage).toBeNull();
  });

  it('should unsubscribe to userSub when ngOnDestroy is called', () => {
    component.closeAlertSub = new Subscription();
    expect(component.closeAlertSub).toBeTruthy();
    component.ngOnDestroy();
    // closed is used for checking if a subscription is unsubscribed
    expect(component.closeAlertSub.closed).toBeTruthy();
  });

  it('should return undefined when onSubmit is called with an invalid form', () => {
    const testForm = {} as NgForm;
    component.onSubmit(testForm);
    expect(testForm.valid).toBeFalsy();
    expect(component.onSubmit(testForm)).toBe(undefined);
  });

  it('should call signIn and navigate to /recipes when isLoginMode is true and form is valid', () => {
    authServiceSignInSpy =
      spyOn(authService, 'signIn')
        .and
        .returnValue(
          of(new User('testUser.email', 'testUser.localId', 'testUser.idToken', new Date()))
        );

    const testForm =
    { value: { email: 'test-email', password: 'test-password' },
      valid: true, reset: () => { testForm.value.email = ''; testForm.value.password = ''; } } as NgForm;

    component.isLoginMode = true;
    expect(testForm.valid).toBeTruthy();
    expect(testForm.value.email).toContain('test-email');
    expect(testForm.value.password).toContain('test-password');
    component.onSubmit(testForm);

    expect(authServiceSignInSpy).toHaveBeenCalled();
    expect(authServiceSignInSpy).toHaveBeenCalledTimes(1);
    expect(component.isLoading).toBeFalsy();

    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['/recipes']);

    expect(testForm.value.email).toEqual('');
    expect(testForm.value.password).toEqual('');
  });

  it('should call signUp and navigate to /recipes when isLoginMode is false  and form is valid', () => {
    authServiceSignUpSpy =
      spyOn(authService, 'signup')
        .and
        .returnValue(
          of(new User('testUser.email', 'testUser.localId', 'testUser.idToken', new Date()))
        );

    const testForm =
    { value: { email: 'test-email', password: 'test-password' },
      valid: true, reset: () => { testForm.value.email = ''; testForm.value.password = ''; } } as NgForm;

    component.isLoginMode = false;

    expect(testForm.valid).toBeTruthy();
    expect(testForm.value.email).toContain('test-email');
    expect(testForm.value.password).toContain('test-password');

    component.onSubmit(testForm);

    expect(authServiceSignUpSpy).toHaveBeenCalled();
    expect(authServiceSignUpSpy).toHaveBeenCalledTimes(1);
    expect(component.isLoading).toBeFalsy();

    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['/recipes']);

    expect(testForm.value.email).toEqual('');
    expect(testForm.value.password).toEqual('');
  });

  it('should call signIn when isLoginMode is true and form is valid but fails in error', () => {
    authServiceSignInSpy =
      spyOn(authService, 'signIn')
        .and
        .returnValue(throwError(new Error('test-error'))
        );

    const testForm =
    { value: { email: 'test-email', password: 'test-password' },
      valid: true, reset: () => { testForm.value.email = ''; testForm.value.password = ''; } } as NgForm;

    component.isLoginMode = true;

    expect(testForm.valid).toBeTruthy();
    expect(testForm.value.email).toContain('test-email');
    expect(testForm.value.password).toContain('test-password');

    component.onSubmit(testForm);
    expect(component.isLoading).toBeTruthy();

    expect(authServiceSignInSpy).toHaveBeenCalled();
    expect(authServiceSignInSpy).toHaveBeenCalledTimes(1);
    expect(component.errorMessage.message).toContain('test-error');

    expect(componentFactoryResolver.resolveComponentFactory).toHaveBeenCalled();
    expect(componentFactoryResolver.resolveComponentFactory).toHaveBeenCalledTimes(1);

    expect(testForm.value.email).toEqual('');
    expect(testForm.value.password).toEqual('');

    // should make a test with fakeasync to see isLoading changing value
    // but this.alertHost.viewContainerRef is undefined and ViewContainerRef is an abstract class which cannot be instantiated
    // flush(); cannot be done here to check isLoading has changed to false due to previous error
    // expect(component.isLoading).toBeFalsy();
  });

  it('should call signUp when isLoginMode is true and form is valid but fails in error', () => {
    authServiceSignUpSpy =
      spyOn(authService, 'signup')
        .and
        .returnValue(throwError(new Error('test-error'))
        );

    const testForm =
    { value: { email: 'test-email', password: 'test-password' },
      valid: true, reset: () => { testForm.value.email = ''; testForm.value.password = ''; } } as NgForm;

    component.isLoginMode = false;
    expect(testForm.valid).toBeTruthy();
    expect(testForm.value.email).toContain('test-email');
    expect(testForm.value.password).toContain('test-password');

    component.onSubmit(testForm);

    expect(component.isLoading).toBeTruthy();

    expect(authServiceSignUpSpy).toHaveBeenCalled();
    expect(authServiceSignUpSpy).toHaveBeenCalledTimes(1);
    expect(component.errorMessage.message).toContain('test-error');

    expect(componentFactoryResolver.resolveComponentFactory).toHaveBeenCalled();
    expect(componentFactoryResolver.resolveComponentFactory).toHaveBeenCalledTimes(1);

    expect(testForm.value.email).toEqual('');
    expect(testForm.value.password).toEqual('');

    // should make a test with fakeasync to see isLoading changing value
    // but this.alertHost.viewContainerRef is undefined and ViewContainerRef is an abstract class which cannot be instantiated
    // flush(); cannot be done here to check isLoading has changed to false due to previous error
    // expect(component.isLoading).toBeFalsy();
  });
});
