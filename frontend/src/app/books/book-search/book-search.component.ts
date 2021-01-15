import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Book } from 'src/app/shared/models/book';
import { BookSearch } from 'src/app/shared/models/book-search';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss'],
})
export class BookSearchComponent implements OnInit {
  constructor(private bookService: BookService, private fb: FormBuilder, private router: Router) {
    this.formGroup = this.fb.group({
      isbn: '',
      title: '',
    });
  }

  formGroup: FormGroup;
  books: Book[] = [];
  searched = false;

  ngOnInit(): void {}

  search(): void {
    const bookSearch = this.formGroup.value as BookSearch;
    if (bookSearch.isbn) {
      delete bookSearch.title;
    } else {
      delete bookSearch.isbn;
    }

    this.bookService.search(bookSearch).subscribe((books) => {
      this.books = books;
      this.searched = true;
    });
  }

  checkout(book: Book): void {
    this.bookService.checkout(book.id).subscribe(
      (data) => {
        alert(data.message);
        this.router.navigateByUrl('/');
      },
      (err) => {
        if (err.error.errors.checked_out) {
          alert(err.error.errors.checked_out);
        } else {
          alert(err.error.message);
        }
      }
    );
  }
}
