import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PasswordValidation {
  static matchPassword(
    passwordFieldName: string,
    passwordConfirmationFieldName: string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordFieldName).value;
      const confirmPassword = control.get(passwordConfirmationFieldName).value;
      if (password !== confirmPassword) {
        control
          .get(passwordConfirmationFieldName)
          .setErrors({ password_mismatch: true });
      }
      return null;
    };
  }
}
