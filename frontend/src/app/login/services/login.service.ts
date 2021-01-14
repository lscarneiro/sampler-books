import { Injectable } from '@angular/core';
import { LoginData, AuthData } from 'src/app/shared/models';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  authenticate(data: LoginData): Observable<AuthData> {
    return this.http.post<AuthData>(`/auth/login`, data);
  }
}
