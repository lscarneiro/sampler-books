import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ValidationErrorBag } from 'src/app/shared/models';

@Injectable({
  providedIn: 'root',
})
export class ServerValidationService {
  constructor() {}

  private errorBagObervable = new Subject<ValidationErrorBag>();

  OnServerError: Observable<ValidationErrorBag> = this.errorBagObervable;

  PropagateServerValidationError(errorBag: ValidationErrorBag): void {
    this.errorBagObervable.next(errorBag);
  }
}
