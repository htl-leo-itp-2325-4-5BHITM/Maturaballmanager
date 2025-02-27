import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ContactPerson} from "../model/contactperson";
import {environment} from "../../environments/environment";
import {AppointmentRequest, AppointmentResponse} from "../model/appointment";

@Injectable({
    providedIn: 'root'
})
export class AppointmentService {
    private baseUrl = `${environment.apiUrl}/appointments`;

    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };


    constructor(private http: HttpClient) {
    }

    getAppointments(): Observable<AppointmentResponse[]> {
        return this.http.get<AppointmentResponse[]>(`${this.baseUrl}`);
    }

    getAppointmentsForDate(date: string, keycloakId: string, roles: string[]): Observable<AppointmentResponse[]> {
        const params = new HttpParams()
            .set('date', date)
            .set('keycloakId', keycloakId)
            .set('roles', roles.join(','));

        return this.http.get<AppointmentResponse[]>(`${this.baseUrl}/byDate`, {
            ...this.httpOptions,
            params: params
        });
    }

    createAppointment(appointment: AppointmentRequest): Observable<AppointmentRequest> {
        return this.http.post<AppointmentRequest>(`${this.baseUrl}`, appointment, this.httpOptions);
    }

    updateAppointment(id: number, updatedAppointment: AppointmentRequest): Observable<AppointmentRequest> {
        return this.http.put<AppointmentRequest>(`${this.baseUrl}/${id}`, updatedAppointment, this.httpOptions);
    }

    deleteAppointment(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`, this.httpOptions);
    }
}
