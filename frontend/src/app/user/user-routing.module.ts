import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserBooksComponent } from './user-books/user-books.component';

const routes: Routes = [
  {
    path: 'books',
    component: UserBooksComponent,
  },
  { path: '**', redirectTo: 'books' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
