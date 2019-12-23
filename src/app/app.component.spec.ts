import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth/auth.service';
import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';

describe('AppComponent', () => {
  const authServiceSpy: AuthService = jasmine.createSpyObj('AuthService', ['autoLogin']);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [
        AppComponent,
        DummyHeaderComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should use the AuthService', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(authServiceSpy.autoLogin).toBeTruthy();
    expect(authServiceSpy.autoLogin).toHaveBeenCalled();
    expect(authServiceSpy.autoLogin).toHaveBeenCalledTimes(1);
  });
});


@Component({
  selector: 'app-header',
  template: '<p id="mock-app-header"></p>',
})
export class DummyHeaderComponent {
}
