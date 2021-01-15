import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookListComponent } from './book-list/book-list.component';
import { BookSearchComponent } from './book-search/book-search.component';

const routes: Routes = [
  {
    path: 'search',
    component: BookSearchComponent,
  },
  {
    path: 'newest',
    component: BookListComponent,
  },
  { path: '**', redirectTo: 'newest' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BooksRoutingModule {}
