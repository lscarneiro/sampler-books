import { Component, ExistingProvider, forwardRef, OnInit } from '@angular/core';
import { PseudoRandomGeneratorService, ServerValidationService } from 'src/app/core/services';
import { CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR, InputComponent } from 'src/app/shared/components/input/input.component';

@Component({
  providers: [
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR,
    {
      provide: InputComponent,
      useExisting: forwardRef(() => TextInputComponent),
    } as ExistingProvider,
  ],
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
})
export class TextInputComponent extends InputComponent implements OnInit {
  constructor(protected pseudoRandomGenerator: PseudoRandomGeneratorService, protected serverValidationService: ServerValidationService) {
    super(pseudoRandomGenerator, serverValidationService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}
