import { ValidationError } from './validation-error';

export class ValidationErrorBag {
  message: string;
  errors: ValidationError;
}
