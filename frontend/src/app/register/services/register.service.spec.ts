import { TestBed } from '@angular/core/testing';

import { RegisterService } from './register.service';
import { User } from 'src/app/shared/models';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

describe('RegisterService', () => {
  let service: RegisterService;
  let httpMock: HttpTestingController;
  let httpClientMock: HttpClient;

  const REGISTER_DATA = {
    name: 'Joe Bernard',
    email: 'test@test.com',
    password: 'password',
    date_of_birth: '2000-01-01',
  } as User;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(RegisterService);

    httpMock = TestBed.inject(HttpTestingController);
    httpClientMock = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve auth data', (done) => {
    service.register(REGISTER_DATA).subscribe((authData) => {
      expect(authData).not.toBeNull();
      expect(authData.access_token).not.toBeNull();
      expect(authData.expires_in).not.toBeNull();
      expect(authData.token_type).not.toBeNull();
      done();
    });
    httpMock.expectOne((req) => req.url.endsWith('/auth/register')).flush({ access_token: 'token', expires_in: 3600, token_type: 'bearer' });
  });

  it('should throw error with bad register data', (done) => {
    service.register({} as User).subscribe(
      () => {},
      (err) => {
        expect(err).not.toBeNull();
        done();
      }
    );

    httpMock.expectOne((req) => req.url.endsWith('/auth/register')).flush(null, { status: 422, statusText: 'Unprocessable Entity' });
  });
});
