import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidatorService {
  constructor() {}

  validate(control: AbstractControl): void {
    if (control.hasOwnProperty('controls')) {
      control.markAsTouched();
      const ctrl = control as FormGroup;
      for (const inner of Object.keys(ctrl.controls)) {
        this.validate(ctrl.controls[inner]);

        control.updateValueAndValidity();
      }
    } else {
      control.updateValueAndValidity();
      control.markAsTouched();
    }
  }
}
