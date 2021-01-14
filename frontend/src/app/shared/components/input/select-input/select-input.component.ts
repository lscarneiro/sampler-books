import { Component, ExistingProvider, forwardRef, Input, OnInit } from '@angular/core';
import { PseudoRandomGeneratorService, ServerValidationService } from 'src/app/core/services';
import { CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR, InputComponent } from 'src/app/shared/components/input/input.component';

@Component({
  providers: [
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR,
    {
      provide: InputComponent,
      useExisting: forwardRef(() => SelectInputComponent),
    } as ExistingProvider,
  ],
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss'],
})
export class SelectInputComponent extends InputComponent implements OnInit {
  constructor(protected pseudoRandomGenerator: PseudoRandomGeneratorService, protected serverValidationService: ServerValidationService) {
    super(pseudoRandomGenerator, serverValidationService);
  }

  @Input() itemList: any[];
  @Input() selectBy: string;
  @Input() displayBy: string;

  ngOnInit(): void {
    super.ngOnInit();
  }

  getItemValue(item: any): string {
    return !!this.selectBy ? item[this.selectBy] : item;
  }

  getItemDescription(item: any): string {
    return !!this.displayBy ? item[this.displayBy] : item;
  }
}
