import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ContactPerson} from "../model/contactperson";
import {environment} from "../../environments/environment";
import {Appointment} from "../model/appointment";

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

    getAppointments(): Observable<Appointment[]> {
        return this.http.get<Appointment[]>(`${this.baseUrl}`);
    }

    getAppointmentsForDate(date: string, keycloakId: string, roles: string[]): Observable<Appointment[]> {
        const params = new HttpParams()
            .set('date', date)
            .set('keycloakId', keycloakId)
            .set('roles', roles.join(','));

        return this.http.get<Appointment[]>(`${this.baseUrl}/byDate`, {
            ...this.httpOptions,
            params: params
        });
    }

    createAppointment(appointment: Appointment): Observable<Appointment> {
        return this.http.post<Appointment>(`${this.baseUrl}`, appointment, this.httpOptions);
    }

    updateAppointment(id: number, updatedAppointment: Appointment): Observable<Appointment> {
        return this.http.put<Appointment>(`${this.baseUrl}/${id}`, updatedAppointment, this.httpOptions);
    }

    deleteAppointment(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`, this.httpOptions);
    }
}
