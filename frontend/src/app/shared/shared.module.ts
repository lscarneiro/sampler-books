import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './templates/main/header/header.component';
import { MainComponent } from './templates/main/main.component';
import { LoadingComponent } from './templates/main/loading/loading.component';

@NgModule({
  declarations: [MainComponent, HeaderComponent, LoadingComponent],
  imports: [CommonModule],
  exports: [MainComponent],
})
export class SharedModule {}
