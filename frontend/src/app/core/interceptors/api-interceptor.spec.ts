import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { of } from 'rxjs';
import { TokenService } from 'src/app/core/auth';
import { environment } from 'src/environments/environment';
import { ApiInterceptor } from './api-interceptor';

describe('ApiInterceptorService', () => {
  let httpMock: HttpTestingController;
  let httpClientMock: HttpClient;
  let tokenService: Partial<TokenService>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, JwtModule.forRoot({ config: { tokenGetter: () => '' } })],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ApiInterceptor,
          multi: true,
        },
        { provide: JwtHelperService },
      ],
    });
    tokenService = TestBed.inject(TokenService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClientMock = TestBed.inject(HttpClient);
  });

  it('should prepend apiUrl when route starts with "/"', () => {
    spyOn(tokenService, 'getAuthToken').and.returnValue(of('some_token'));
    httpClientMock.get('/').subscribe((response) => expect(response).toBeTruthy());
    const request = httpMock.expectOne((req) => req.url.startsWith(environment.apiUrl));

    request.flush({ data: 'test' });
    httpMock.verify();
  });

  it('should add authorization header when route starts with "/"', () => {
    spyOn(tokenService, 'getAuthToken').and.returnValue(of('some_token'));
    httpClientMock.get('/').subscribe((response) => expect(response).toBeTruthy());
    const request = httpMock.expectOne((req) => req.headers.has('authorization'));

    request.flush({ data: 'test' });
    httpMock.verify();
  });

  it('should not add authorization header when route does not start with "/"', () => {
    spyOn(tokenService, 'getAuthToken').and.returnValue(of('some_token'));
    httpClientMock.get('http://www.site.com').subscribe((response) => expect(response).toBeTruthy());
    const request = httpMock.expectOne((req) => !req.headers.has('authorization'));

    request.flush({ data: 'test' });
    httpMock.verify();
  });
});
