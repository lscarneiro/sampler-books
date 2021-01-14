import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BookService } from './book.service';

describe('BookService', () => {
  let service: BookService;
  let httpMock: HttpTestingController;
  let httpClientMock: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(BookService);

    httpMock = TestBed.inject(HttpTestingController);
    httpClientMock = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve searched books', (done) => {
    const sampleBook = {
      id: 1,
      title: 'Title',
      isbn: '0005534186',
      published_at: '2020-01-01',
      status: 'AVAILABLE',
    };

    service.search({ isbn: 'test' }).subscribe((books) => {
      expect(books).not.toBeNull();
      expect(books.length).toBe(1);
      expect(books).toContain(sampleBook);

      done();
    });

    httpMock.expectOne((req) => req.url.endsWith('/books/search')).flush([sampleBook]);
  });

  it('should checkin book', (done) => {
    service.checkin(1).subscribe(({ message }) => {
      expect(message).not.toBeNull();

      done();
    });

    httpMock
      .expectOne((req) => req.url.endsWith('/books/1/checkin'))
      .flush({
        message: 'Book checkin successful, combe back later!',
      });
  });

  it('should checkout book', (done) => {
    service.checkout(1).subscribe(({ message }) => {
      expect(message).not.toBeNull();

      done();
    });

    httpMock
      .expectOne((req) => req.url.endsWith('/books/1/checkout'))
      .flush({
        message: 'Book checkout successful, enjoy your reading!',
      });
  });
});
