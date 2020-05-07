import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(request)
      .pipe(catchError(err => {
        switch(err.status) {
          case 401: {
            this.authService.logout();
            break;
          }
          case 403: {
            this.authService.permissionDenied();
            break;
          }
        }

        const error = err.error.message || err.statusText;
        return throwError(error);
      }),
    );
  }
}
