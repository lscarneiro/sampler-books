import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BrowserStorageService } from 'src/app/core/services';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private http: HttpClient, private jwtHelperService: JwtHelperService, private browserStorageService: BrowserStorageService) {}

  getAuthToken(): Observable<string> {
    const token = this.browserStorageService.getItem('access_token');
    if (!token) {
      return of(null);
    }
    if (!this.isTokenValid(token)) {
      return of(null);
    }
    return of(token);
  }

  setAuthToken(token: string): void {
    this.browserStorageService.setItem('access_token', token);
  }

  clearAuthToken(): void {
    this.browserStorageService.removeItem('access_token');
  }

  isTokenValid(token: string): boolean {
    return !this.jwtHelperService.isTokenExpired(token);
  }
}
