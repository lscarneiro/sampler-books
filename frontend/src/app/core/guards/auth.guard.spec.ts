import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { TokenService } from 'src/app/core/auth';

describe('AuthGuard', () => {
  const LOGIN_ROUTE = '/login';
  let guard: AuthGuard;
  let activatedRouteSnapshot: ActivatedRouteSnapshot;
  let router: Router;
  let routerStateSnapshot: RouterStateSnapshot;
  const tokenService = {
    getAuthToken: (): Observable<string> => {
      return of(null);
    },
  } as Partial<TokenService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: TokenService,
          useValue: tokenService,
        },
      ],
    });
    guard = TestBed.inject(AuthGuard);
    activatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    router = TestBed.inject(Router);
    routerStateSnapshot = router.routerState.snapshot;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect invalid sessions to /login', (done) => {
    const navigateByUrl = spyOn(router, 'navigateByUrl');
    const canActivateObservable = guard.canActivate(activatedRouteSnapshot, routerStateSnapshot) as Observable<boolean>;

    canActivateObservable.subscribe((result) => {
      expect(result).toBe(false);
      expect(navigateByUrl).toHaveBeenCalledWith(LOGIN_ROUTE);
      done();
    });
  });

  it('should permit valid sessions', (done) => {
    spyOn(tokenService, 'getAuthToken').and.returnValue(of('some_token'));
    const navigateByUrl = spyOn(router, 'navigateByUrl');
    const canActivateObservable = guard.canActivate(activatedRouteSnapshot, routerStateSnapshot) as Observable<boolean>;

    canActivateObservable.subscribe((result) => {
      expect(result).toBe(true);
      expect(navigateByUrl).not.toHaveBeenCalled();
      done();
    });
  });
});
