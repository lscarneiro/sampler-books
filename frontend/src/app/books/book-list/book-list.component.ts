import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/shared/models/book';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent implements OnInit {
  constructor(private bookService: BookService) {}

  books: Book[] = [];
  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.list().subscribe((books) => {
      this.books = books;
    });
  }

  checkin(book: Book): void {
    this.bookService.checkin(book.id).subscribe(
      (data) => {
        alert(data.message);
        this.loadBooks();
      },
      (err) => {
        if (err.error.errors.already_available) {
          alert(err.error.errors.already_available);
        } else {
          alert(err.error.message);
        }
      }
    );
  }
}
