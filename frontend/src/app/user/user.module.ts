import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserBooksComponent } from './user-books/user-books.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [UserBooksComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule
  ]
})
export class UserModule { }
