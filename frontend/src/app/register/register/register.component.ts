import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';
import { TokenService } from 'src/app/core/auth';
import { FormValidatorService } from 'src/app/core/services';
import { RegisterService } from 'src/app/register/services';
import { AuthData, User } from 'src/app/shared/models';
import { PasswordValidation, DateValidation } from 'src/app/shared/validation';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private tokenService: TokenService,
    private fb: FormBuilder,
    private registerService: RegisterService,
    private formValidator: FormValidatorService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  formGroup: FormGroup;

  ngOnInit(): void {
    this.tokenService
      .getAuthToken()
      .pipe(filter((token) => !!token))
      .subscribe(() => {
        this.router.navigateByUrl('/');
      });
    this.formGroup = this.fb.group(
      {
        name: [null, Validators.required],
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(8)]],
        password_confirmation: [null, Validators.required],
        date_of_birth: [null, [Validators.required, DateValidation.validDate]],
      },
      {
        validator: [PasswordValidation.matchPassword('password', 'password_confirmation')],
      }
    );
  }

  register(): void {
    this.formValidator.validate(this.formGroup);
    if (!this.formGroup.valid) {
      return;
    }
    const userData = this.formGroup.value as User;
    this.registerService.register(userData).subscribe(
      (authData) => {
        this.processRegistration(authData);
        this.router.navigateByUrl('/');
      },
      (err) => this.handleRegisterError(err)
    );
  }

  processRegistration(authData: AuthData): void {
    this.tokenService.clearAuthToken();
    this.tokenService.setAuthToken(authData.access_token);
  }

  handleRegisterError(err): void {
    if (err instanceof HttpErrorResponse && err.status !== 422) {
      this.toastr.error('An unexpected error occurred, try again later.');
    }
  }
}
