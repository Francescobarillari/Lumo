import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: any) => {
      console.error('HTTP ERROR intercepted', err);

      if (err instanceof HttpErrorResponse) {
        return throwError(() => err);
      }
      return throwError(() => err || 'Unknown error');
    })
  );
};
