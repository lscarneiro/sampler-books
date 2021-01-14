import { Component, ExistingProvider, forwardRef, OnInit } from '@angular/core';
import { PseudoRandomGeneratorService, ServerValidationService } from 'src/app/core/services';
import { CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR, InputComponent } from 'src/app/shared/components/input/input.component';

@Component({
  providers: [
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR,
    {
      provide: InputComponent,
      useExisting: forwardRef(() => PasswordInputComponent),
    } as ExistingProvider,
  ],
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
})
export class PasswordInputComponent extends InputComponent implements OnInit {
  constructor(protected pseudoRandomGenerator: PseudoRandomGeneratorService, protected serverValidationService: ServerValidationService) {
    super(pseudoRandomGenerator, serverValidationService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}
