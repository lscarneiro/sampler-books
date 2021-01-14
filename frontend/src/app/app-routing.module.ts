import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards';
import { BooksModule } from './books/books.module';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => LoginModule,
  },
  {
    path: 'register',
    loadChildren: () => RegisterModule,
  },
  {
    path: 'books',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    loadChildren: () => BooksModule,
  },
  { path: '**', redirectTo: 'books' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
