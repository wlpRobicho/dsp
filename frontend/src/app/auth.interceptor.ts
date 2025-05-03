import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse
  } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { Observable, throwError, from } from 'rxjs';
  import { catchError, switchMap } from 'rxjs/operators';
  
  @Injectable()
  export class AuthInterceptor implements HttpInterceptor {
  
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const token = localStorage.getItem('token');
      const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;
  
      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            return from(this.refreshToken()).pipe(
              switchMap(newToken => {
                if (newToken) {
                  const retryReq = req.clone({
                    setHeaders: { Authorization: `Bearer ${newToken}` }
                  });
                  return next.handle(retryReq);
                } else {
                  localStorage.clear();
                  window.location.href = '/login';
                  return throwError(() => error);
                }
              })
            );
          }
          return throwError(() => error);
        })
      );
    } 
  
    private async refreshToken(): Promise<string | null> {
      const refresh = localStorage.getItem('refresh_token');
      if (!refresh) return null;
  
      try {
        const response = await fetch('http://localhost:8000/api/users/token/refresh/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh })
        });
  
        if (!response.ok) return null;
  
        const data = await response.json();
        const newToken = data.access;
        localStorage.setItem('token', newToken);
        return newToken;
      } catch (err) {
        console.error('Refresh token failed:', err);
        return null;
      }
    }
  }
  