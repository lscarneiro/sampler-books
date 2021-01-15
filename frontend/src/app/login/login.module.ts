import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputModule } from '../shared/components/input/input.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, SharedModule, LoginRoutingModule, ReactiveFormsModule, InputModule],
})
export class LoginModule {}
