import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private loginUrl = 'https://auth.htl-leonding.ac.at/realms/htl-leonding/protocol/openid-connect/token';
    private clientId = 'htlleonding-service';
    private clientSecret = 'AkIRaaboJ23Q64jSjtN9gkmfMumUybD8';  // Beachte Sicherheitshinweise bezüglich Client Secrets
    private headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
    });

    private isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());

    constructor(private http: HttpClient) {}

    private saveToken(token: string): void {
        localStorage.setItem('access_token', token);
        this.isAuthenticated.next(true);
    }

    private removeToken(): void {
        localStorage.removeItem('access_token');
        this.isAuthenticated.next(false);
    }

    public getToken(): string | null {
        return localStorage.getItem('access_token');
    }

    public isLoggedIn(): boolean {
        const token = localStorage.getItem('access_token');
        return !!token;
    }

    public hasToken(): boolean {
        return !localStorage.getItem('access_token');
    }

    login(username: string, password: string): Observable<any> {
        const body = new URLSearchParams();
        body.set('client_id', this.clientId);
        body.set('client_secret', this.clientSecret);
        body.set('grant_type', 'password');
        body.set('username', username);
        body.set('password', password);
        body.set('scope', 'openid');

        return this.http.post<any>(this.loginUrl, body.toString(), { headers: this.headers }).pipe(
            map(response => {
                this.saveToken(response.access_token);
                return response;
            })
        );
    }

    logout(): void {
        this.removeToken();
    }
}
