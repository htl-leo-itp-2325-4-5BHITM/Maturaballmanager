import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {from, throwError} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {AuthService} from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    return from(authService.getToken()).pipe(
        switchMap(token => {
            if (req.url.endsWith('/api/auth/login')) {
                return next(req);
            }

            if (token) {
                req = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            return next(req);
        }),
        catchError(error => {
            if (error.status === 401) {
                return from(authService.refreshToken()).pipe(
                    switchMap(newToken => {
                        if (newToken) {
                            req = req.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${newToken}`,
                                },
                            });
                            return next(req);
                        } else {
                            return throwError(() => new Error('Unauthorized'));
                        }
                    })
                );
            }
            return throwError(error);
        })
    );
};
