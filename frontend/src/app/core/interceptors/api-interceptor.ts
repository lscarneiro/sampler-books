import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { TokenService } from 'src/app/core/auth';
import { ServerValidationService } from 'src/app/core/services';
import { ValidationErrorBag } from 'src/app/shared/models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiInterceptor implements HttpInterceptor {
  constructor(public tokenService: TokenService, private serverValidationService: ServerValidationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.startsWith('/')) {
      const originalUrl = request.url;
      request = request.clone({
        url: `${environment.apiUrl}${request.url}`,
      });
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
}
