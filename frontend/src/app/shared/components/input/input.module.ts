import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { INPUT_COMPONENTS } from './';

@NgModule({
  declarations: [...INPUT_COMPONENTS],
  imports: [CommonModule, FormsModule],
  exports: [...INPUT_COMPONENTS],
})
export class InputModule {}
