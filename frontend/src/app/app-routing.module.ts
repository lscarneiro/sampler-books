import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { HomeModule } from './home/home.module';

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
    path: 'home',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    loadChildren: () => HomeModule,
  },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
