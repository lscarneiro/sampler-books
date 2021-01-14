import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './templates/main/header/header.component';
import { MainComponent } from './templates/main/main.component';

@NgModule({
  declarations: [MainComponent, HeaderComponent],
  imports: [CommonModule],
  exports: [MainComponent],
})
export class SharedModule {}
