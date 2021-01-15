import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from 'src/app/shared/models/book';
import { BookSearch } from 'src/app/shared/models/book-search';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private http: HttpClient) {}

  search(data: BookSearch): Observable<Book[]> {
    return this.http.post<Book[]>(`/books/search`, data);
  }

  checkin(id: number): Observable<{ message: string }> {
    return this.http.post<any>(`/books/${id}/checkin`, null);
  }

  checkout(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`/books/${id}/checkout`, null);
  }
}
