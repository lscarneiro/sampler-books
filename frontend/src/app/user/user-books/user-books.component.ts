import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BookService } from 'src/app/books/services/book.service';
import { Book } from 'src/app/shared/models/book';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-books',
  templateUrl: './user-books.component.html',
  styleUrls: ['./user-books.component.scss'],
})
export class UserBooksComponent implements OnInit {
  constructor(private userService: UserService, private bookService: BookService, private toastr: ToastrService) {}

  books: Book[] = [];

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.userService.books().subscribe((books) => {
      this.books = books;
    });
  }

  checkin(book: Book): void {
    this.bookService.checkin(book.id).subscribe(
      (data) => {
        this.toastr.success(data.message);
        this.loadBooks();
      },
      (err) => {
        if (err.error.errors.already_available) {
          this.toastr.error(err.error.errors.already_available);
        } else {
          this.toastr.error(err.error.message);
        }
      }
    );
  }
}
