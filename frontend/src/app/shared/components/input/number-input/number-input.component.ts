import { Component, ExistingProvider, forwardRef, OnInit } from '@angular/core';
import { PseudoRandomGeneratorService, ServerValidationService } from 'src/app/core/services';
import { CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR, InputComponent } from 'src/app/shared/components/input/input.component';

@Component({
  providers: [
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR,
    {
      provide: InputComponent,
      useExisting: forwardRef(() => NumberInputComponent),
    } as ExistingProvider,
  ],
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
})
export class NumberInputComponent extends InputComponent implements OnInit {
  constructor(protected pseudoRandomGenerator: PseudoRandomGeneratorService, protected serverValidationService: ServerValidationService) {
    super(pseudoRandomGenerator, serverValidationService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  validateInput(evt: KeyboardEvent): void {
    const validKeys = [
      'Delete',
      'Backspace',
      'Enter',
      'Escape',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0',
      '.',
      ',',
      'Tab',
      'Home',
      'End',
    ];
    if (validKeys.indexOf(evt.key) !== -1) {
      return;
    }
    const validCombinations = ['a', 'c', 'v', 'x', 'ArrowLeft', 'ArrowRight'];
    if (validCombinations.indexOf(evt.key) !== -1 && (evt.ctrlKey || evt.metaKey)) {
      return;
    }
    console.log('evt.key', evt.key);
    evt.preventDefault();
  }
}
