import { AfterContentInit, Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PseudoRandomGeneratorService, ServerValidationService } from 'src/app/core/services';
import { ValidationError } from 'src/app/shared/models';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR = {
  multi: true,
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputComponent),
};

@Component({
  selector: 'app-base',
  template: '',
})
export class InputComponent implements AfterContentInit, OnInit, ControlValueAccessor {
  constructor(protected pseudoRandomGenerator: PseudoRandomGeneratorService, protected serverValidationService: ServerValidationService) {}

  @Input() placeholder: string;
  @Input() label: string;
  @ViewChild('inputElement', { static: true }) inputElement!: ElementRef;
  @Input() formControlName: string;

  fieldId: string = this.pseudoRandomGenerator.generate();
  internalValue: any;
  onChangeCallback: (_: any) => void;
  onTouchedCallback: () => void;
  validationErrors: string[];

  get value(): any {
    return this.internalValue;
  }

  set value(v: any) {
    v = v === '' ? null : v;
    this.internalValue = v;
    if (this.onChangeCallback) {
      this.onChangeCallback(v);
    }
    this.validationErrors = null;
  }

  ngAfterContentInit(): void {
    this.serverValidationService.OnServerError.subscribe((errorBag) => {
      const errorList = errorBag.errors[this.formControlName];
      this.validationErrors = errorList;
    });
  }

  ngOnInit(): void {
    if (this.placeholder) {
      this.inputElement.nativeElement.placeholder = this.placeholder;
    }
  }

  writeValue(value: any): void {
    this.internalValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  onTouched($event): void {
    if (this.onTouchedCallback) {
      this.onTouchedCallback();
    }
  }
}
