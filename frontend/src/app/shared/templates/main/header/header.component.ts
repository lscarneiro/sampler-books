import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/core/auth';
import { LoginService } from 'src/app/login/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private tokenService: TokenService, private router: Router, private loginService: LoginService) {}

  apiDocsUrl = `${environment.apiUrl}/documentation`;

  ngOnInit(): void {}
  logout(): void {
    this.loginService.logout().subscribe(() => {
      this.tokenService.clearAuthToken();
      this.router.navigateByUrl('/login');
    });
  }
}
