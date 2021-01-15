import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { TokenService } from 'src/app/core/auth';
import { LoadingService, ServerValidationService } from 'src/app/core/services';
import { ValidationErrorBag } from 'src/app/shared/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    public tokenService: TokenService,
    private serverValidationService: ServerValidationService,
    private loadingSevice: LoadingService
  ) {}

  requestCount = 0;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.startsWith('/')) {
      const originalUrl = request.url;
      request = request.clone({
        url: `${environment.apiUrl}${request.url}`,
      });

      this.handleRequestStart();
      return this.tokenService.getAuthToken().pipe(
        switchMap((token) => {
          if (token) {
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`,
              },
            });
          }
          return next.handle(request);
        }),
        tap({
          next: (event) => this.handleResponse(event),
          error: (event) => this.handleResponse(event),
        }),
        catchError((err) => {
          if (err instanceof HttpErrorResponse && err.status === 422) {
            const errorBag = err.error as ValidationErrorBag;
            if (Object.keys(errorBag?.errors).length > 0) {
              this.serverValidationService.PropagateServerValidationError(errorBag);
            }
          }
          throw err;
        })
      );
    }
    return next.handle(request);
  }

  handleRequestStart(): void {
    if (this.requestCount == 0) {
      this.loadingSevice.PropagateLoadingState(true);
    }
    this.requestCount++;
  }
  handleResponse(event): void {
    if (event instanceof HttpResponse || event instanceof HttpErrorResponse) {
      this.requestCount--;
      if (this.requestCount === 0) {
        this.loadingSevice.PropagateLoadingState(false);
      }
    }
  }
}
