import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { FormValidatorService } from './form-validator.service';

describe('FormValidatorService', () => {
  let service: FormValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should touch controls', () => {
    const control = new FormControl();
    expect(control.touched).toBeFalsy();
    service.validate(control);
    expect(control.touched).toBeTruthy();
  });
});
