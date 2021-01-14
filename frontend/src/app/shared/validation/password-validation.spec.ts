import { FormControl, FormGroup } from '@angular/forms';
import { PasswordValidation } from './password-validation';

describe('PasswordValidation', () => {
  it('should create an instance', () => {
    expect(new PasswordValidation()).toBeTruthy();
  });

  it('should match passwords', () => {
    const validator = PasswordValidation.matchPassword('a', 'b');
    const passwordControl = new FormControl('value a');
    const passwordConfirmationControl = new FormControl('value b');
    const baseForm = new FormGroup({
      a: passwordControl,
      b: passwordConfirmationControl,
    });

    const result = validator(baseForm);
    expect(result).toBeNull();
    expect(passwordConfirmationControl.getError('password_mismatch')).toBeTruthy();
  });
});
