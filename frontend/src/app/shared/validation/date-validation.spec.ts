import { FormControl } from '@angular/forms';
import { DateValidation } from './date-validation';

describe('DateValidation', () => {
  it('should be created', () => {
    expect(new DateValidation()).toBeTruthy();
  });

  it('should not accept invalid date', () => {
    const pastDateControl = new FormControl('1990/01/32');

    const result = DateValidation.validDate(pastDateControl);

    expect(result).toEqual({ invalid_date: true });
  });
});
