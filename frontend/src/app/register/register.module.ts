import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register/register.component';
import { InputModule } from 'src/app/shared/components/input/input.module';

@NgModule({
  declarations: [RegisterComponent],
  imports: [CommonModule, SharedModule, RegisterRoutingModule, ReactiveFormsModule, InputModule],
})
export class RegisterModule {}
