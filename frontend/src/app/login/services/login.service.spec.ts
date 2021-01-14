import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;
  let httpClientMock: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(LoginService);

    httpMock = TestBed.inject(HttpTestingController);
    httpClientMock = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should retrieve auth data', (done) => {
    service
      .authenticate({ email: 'test', password: 'password' })
      .subscribe((authData) => {
        expect(authData).not.toBeNull();
        expect(authData.access_token).not.toBeNull();
        expect(authData.expires_in).not.toBeNull();
        expect(authData.token_type).not.toBeNull();
        done();
      });
    httpMock
      .expectOne((req) => req.url.endsWith('/auth/login'))
      .flush({ access_token: 'token', expires_in: 3600, token_type: 'bearer' });
  });
  it('should throw error with bad login data', (done) => {
    service.authenticate({ email: 'test', password: 'password' }).subscribe(
      () => {},
      (err) => {
        expect(err).not.toBeNull();
        done();
      }
    );

    httpMock
      .expectOne((req) => req.url.endsWith('/auth/login'))
      .flush(null, { status: 401, statusText: 'Unauthorized' });
  });
});
