import { Injectable } from '@angular/core';
import { User, AuthData } from 'src/app/shared/models';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  register(userData: User): Observable<AuthData> {
    return this.http.post<AuthData>(`/auth/register`, userData);
  }
}
