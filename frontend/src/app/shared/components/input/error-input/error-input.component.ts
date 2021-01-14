import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-field-error',
  templateUrl: './error-input.component.html',
  styleUrls: ['./error-input.component.scss'],
})
export class ErrorInputComponent implements OnInit {
  constructor(private controlContainer: ControlContainer) {}

  @Input() errorName: string;
  @Input() field: string;
  formGroup: FormGroup;

  ngOnInit(): void {
    this.formGroup = this.controlContainer.control as FormGroup;
  }
}
