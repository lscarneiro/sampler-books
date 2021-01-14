import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let httpClientMock: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UserService);

    httpMock = TestBed.inject(HttpTestingController);
    httpClientMock = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should list user books', (done) => {
    const sampleBook = {
      id: 1,
      title: 'Title',
      isbn: '0005534186',
      published_at: '2020-01-01',
      status: 'CHECKED_OUT',
    };
    service.books().subscribe((books) => {
      expect(books).not.toBeNull();
      expect(books.length).toBe(1);
      expect(books).toContain(sampleBook);

      done();
    });

    httpMock.expectOne((req) => req.url.endsWith('/user/books')).flush([sampleBook]);
  });
});
