import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Book } from 'src/app/shared/models/book';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent implements OnInit {
  constructor(private bookService: BookService, private router: Router, private toastr: ToastrService) {}

  books: Book[] = [];

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.newest().subscribe((books) => {
      this.books = books;
    });
  }

  checkout(book: Book): void {
    this.bookService.checkout(book.id).subscribe(
      (data) => {
        this.toastr.success(data.message);
        this.router.navigateByUrl('/');
      },
      (err) => {
        if (err.error.errors.checked_out) {
          this.toastr.error(err.error.errors.checked_out);
        } else {
          this.toastr.error(err.error.message);
        }
      }
    );
  }
}
