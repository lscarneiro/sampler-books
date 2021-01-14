import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookSearchComponent } from './book-search/book-search.component';

const routes: Routes = [
  {
    path: 'search',
    component: BookSearchComponent,
  },
  { path: '**', redirectTo: 'search' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BooksRoutingModule {}
