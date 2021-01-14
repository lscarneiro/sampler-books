import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { BrowserStorageService } from 'src/app/core/services';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let httpMock: HttpTestingController;
  let browserStorageServiceSpy: BrowserStorageService;
  let jwtHelperServiceSpy: JwtHelperService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule, JwtModule.forRoot({ config: { tokenGetter: () => '' } })],
      providers: [{ provide: JwtHelperService }],
    });
    httpMock = TestBed.inject(HttpTestingController);
    browserStorageServiceSpy = TestBed.inject(BrowserStorageService);
    jwtHelperServiceSpy = TestBed.inject(JwtHelperService);
  });

  it('should be created', () => {
    const service: TokenService = TestBed.inject(TokenService);
    expect(service).toBeTruthy();
  });

  describe('getAuthToken()', () => {
    it('should return a valid token when saved access_token is valid', (done) => {
      const accessTokenKey = 'access_token';
      const accessTokenValue = 'foo_access_token';
      const service: TokenService = TestBed.inject(TokenService);
      spyOn(browserStorageServiceSpy, 'getItem').and.returnValue(accessTokenValue);
      spyOn(service, 'isTokenValid').and.returnValue(true);

      service.getAuthToken().subscribe((token) => {
        expect(token).toBe(accessTokenValue);
        done();
      });

      expect(browserStorageServiceSpy.getItem).toHaveBeenCalledWith(accessTokenKey);
    });

    it('should return null when saved access_token is invalid', (done) => {
      const accessTokenKey = 'access_token';
      const accessTokenValue = 'foo_access_token';
      const service: TokenService = TestBed.inject(TokenService);
      spyOn(browserStorageServiceSpy, 'getItem').and.returnValue(accessTokenValue);
      spyOn(service, 'isTokenValid').and.returnValue(false);

      service.getAuthToken().subscribe((token) => {
        expect(token).toBeNull();
        done();
      });

      expect(browserStorageServiceSpy.getItem).toHaveBeenCalledWith(accessTokenKey);
    });

    it('should return null when no saved access_token is present', (done) => {
      const accessTokenKey = 'access_token';
      const service: TokenService = TestBed.inject(TokenService);
      spyOn(browserStorageServiceSpy, 'getItem').and.returnValue(null);

      service.getAuthToken().subscribe((token) => {
        expect(token).toBeNull();
        done();
      });

      expect(browserStorageServiceSpy.getItem).toHaveBeenCalledWith(accessTokenKey);
    });
  });

  describe('setAuthToken()', () => {
    it('should set access_token in localstorage', () => {
      const accessTokenKey = 'access_token';
      const accessTokenValue = 'token_value';
      const service: TokenService = TestBed.inject(TokenService);
      spyOn(browserStorageServiceSpy, 'setItem').and.stub();

      service.setAuthToken(accessTokenValue);

      expect(browserStorageServiceSpy.setItem).toHaveBeenCalledWith(accessTokenKey, accessTokenValue);
    });
  });

  describe('clearAuthToken()', () => {
    it('should remove access_token from localstorage', () => {
      const accessTokenKey = 'access_token';
      const service: TokenService = TestBed.inject(TokenService);
      spyOn(browserStorageServiceSpy, 'removeItem').and.stub();

      service.clearAuthToken();

      expect(browserStorageServiceSpy.removeItem).toHaveBeenCalledWith(accessTokenKey);
    });
  });
});
