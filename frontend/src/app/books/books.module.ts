import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputModule } from '../shared/components/input/input.module';
import { SharedModule } from '../shared/shared.module';
import { BookSearchComponent } from './book-search/book-search.component';
import { BooksRoutingModule } from './books-routing.module';
import { BookListComponent } from './book-list/book-list.component';

@NgModule({
  declarations: [BookSearchComponent, BookListComponent],
  imports: [CommonModule, SharedModule, BooksRoutingModule, ReactiveFormsModule, InputModule],
})
export class BooksModule {}
