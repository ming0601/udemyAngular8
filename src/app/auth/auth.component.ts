import { AuthService } from './auth.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  errorMessage = null;

  constructor(private authService: AuthService) { }

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
    if (this.isLoginMode) {
      console.log('In Login Mode');
      this.isLoading = false;
    } else {
      const email = authForm.value.email;
      const password = authForm.value.password;

      this.authService.signup(email, password).subscribe(
        responseData => {
          console.log(responseData);
          this.isLoading = false;
        },
        error => {
          this.errorMessage = error;
          this.isLoading = false;
        }
      );
    }
    authForm.reset();
  }

}
