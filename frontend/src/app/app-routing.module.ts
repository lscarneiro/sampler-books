import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards';
import { BooksModule } from './books/books.module';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { UserModule } from './user/user.module';

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
  {
    path: 'user',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    loadChildren: () => UserModule,
  },
  { path: '**', redirectTo: 'user' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
