import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {AuthStore} from '../stores/auth.store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isRefreshing = false;

  constructor(private http: HttpClient, private authStore: AuthStore) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>('/api/auth/login', { username, password }).pipe(
        tap(async response => {
          if (response.access_token && response.refresh_token) {
            await this.authStore.set('auth_token', response.access_token);
            await this.authStore.set('refresh_token', response.refresh_token);
          } else {
            console.error('Login response does not contain tokens');
          }
        }),
        catchError(error => {
          return error;
        })
    );
  }

  async getToken(): Promise<string | null> {
    return await this.authStore.get('auth_token');
  }

  async getRefreshToken(): Promise<string | null> {
    const refreshToken = await this.authStore.get('refresh_token');
    return refreshToken;
  }

  async refreshToken(): Promise<string | null> {
    if (this.isRefreshing) {
      return null;
    }

    this.isRefreshing = true;
    const refreshToken = await this.getRefreshToken();
    if (!refreshToken) {
      this.isRefreshing = false;
      return null;
    }

    try {
      const response = await this.http.post<any>('/api/auth/refresh', { refreshToken: refreshToken }).toPromise();
      if (response.access_token && response.refresh_token) {
        await this.authStore.set('auth_token', response.access_token);
        await this.authStore.set('refresh_token', response.refresh_token);
        this.isRefreshing = false;
        return response.access_token;
      } else {
        await this.logout();
        this.isRefreshing = false;
        return null;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      await this.logout();
      this.isRefreshing = false;
      return null;
    }
  }

  async validateToken(): Promise<boolean> {
    const token = await this.getToken();
    if (!token) {
      return false;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    try {
      const response = await this.http.get<any>('/api/auth/validate', { headers }).toPromise()
      return response?.valid ?? false;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  async logout(): Promise<void> {
    await this.authStore.delete('auth_token');
    await this.authStore.delete('refresh_token');
  }
}