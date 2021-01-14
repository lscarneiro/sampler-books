import { ExistingProvider, forwardRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR, InputComponent } from 'src/app/shared/components/input/input.component';
import { ServerValidationService, PseudoRandomGeneratorService } from 'src/app/core/services';

@Component({
  providers: [
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR,
    {
      provide: InputComponent,
      useExisting: forwardRef(() => DateInputComponent),
    } as ExistingProvider,
  ],
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
})
export class DateInputComponent extends InputComponent implements OnInit {
  constructor(protected pseudoRandomGenerator: PseudoRandomGeneratorService, protected serverValidationService: ServerValidationService) {
    super(pseudoRandomGenerator, serverValidationService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}
