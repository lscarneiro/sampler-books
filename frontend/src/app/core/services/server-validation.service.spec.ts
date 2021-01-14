import { TestBed } from '@angular/core/testing';
import { ValidationErrorBag } from 'src/app/shared/models';
import { ServerValidationService } from './server-validation.service';

describe('ServerValidationService', () => {
  let service: ServerValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should propagate server validation error via OnServerError', (done) => {
    service.OnServerError.subscribe((result) => {
      expect(result).toBeTruthy();
      expect(result.message).toBe('error message');
      expect(Object.keys(result.errors).length).toBe(1);

      done();
    });

    const exampleBag = {
      message: 'error message',
      errors: {
        field1: ['invalid data'],
      },
    } as ValidationErrorBag;
    service.PropagateServerValidationError(exampleBag);
  });
});
