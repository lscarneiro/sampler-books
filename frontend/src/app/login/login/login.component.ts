import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';
import { TokenService } from 'src/app/core/auth';
import { FormValidatorService } from 'src/app/core/services';
import { LoginService } from 'src/app/login/services';
import { AuthData, LoginData } from 'src/app/shared/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private tokenService: TokenService,
    private fb: FormBuilder,
    private loginService: LoginService,
    private formValidator: FormValidatorService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.formGroup = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  formGroup: FormGroup;

  ngOnInit(): void {
    this.tokenService
      .getAuthToken()
      .pipe(filter((token) => !!token))
      .subscribe((token) => {
        this.router.navigateByUrl('/');
      });
    this.formGroup = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }

  login(): void {
    this.formValidator.validate(this.formGroup);
    if (!this.formGroup.valid) {
      return;
    }
    const loginData = Object.assign({}, this.formGroup.value) as LoginData;
    this.loginService.authenticate(loginData).subscribe(
      (authData) => {
        this.processLogin(authData);
        this.router.navigateByUrl('/');
      },
      (err) => this.handleLoginError(err)
    );
  }

  processLogin(authData: AuthData): void {
    this.tokenService.clearAuthToken();
    this.tokenService.setAuthToken(authData.access_token);
  }

  handleLoginError(err): void {
    const unexpectedErrorMessage = 'An unexpected error occurred, try again later.';
    if (err instanceof HttpErrorResponse) {
      if (err.status === 401) {
        this.toastr.error('Incorrect email/password.');
      } else {
        this.toastr.error(unexpectedErrorMessage);
      }
    } else {
      this.toastr.error(unexpectedErrorMessage);
    }
  }
}
