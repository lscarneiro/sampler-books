import { AbstractControl, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';
import { Moment } from 'moment';

export class DateValidation {
  static validDate(control: AbstractControl): ValidationErrors | null {
    const momentDate = control.value instanceof moment ? (control.value as Moment) : moment(control.value, 'YYYY-MM-DD');
    if (!momentDate.isValid()) {
      return { invalid_date: true };
    }
    return null;
  }
}
