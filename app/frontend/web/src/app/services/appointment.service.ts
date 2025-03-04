import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AppointmentRequest, AppointmentResponse } from '../model/appointment';

@Injectable({
    providedIn: 'root'
})
export class AppointmentService {
    private baseUrl = `${environment.apiUrl}/appointments`;

    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) {}

    getAppointments(): Observable<AppointmentResponse[]> {
        return this.http.get<AppointmentResponse[]>(`${this.baseUrl}`);
    }

    getAppointmentsForDate(date: string): Observable<AppointmentResponse[]> {
        const params = new HttpParams().set('date', date);
        return this.http.get<AppointmentResponse[]>(`${this.baseUrl}/byDate`, { ...this.httpOptions, params });
    }

    createAppointment(appointment: AppointmentRequest): Observable<AppointmentResponse> {
        return this.http.post<AppointmentResponse>(`${this.baseUrl}`, appointment, this.httpOptions);
    }

    updateAppointment(id: number, updatedAppointment: AppointmentRequest): Observable<AppointmentResponse> {
        return this.http.put<AppointmentResponse>(`${this.baseUrl}/${id}`, updatedAppointment, this.httpOptions);
    }

    deleteAppointment(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`, this.httpOptions);
    }
}