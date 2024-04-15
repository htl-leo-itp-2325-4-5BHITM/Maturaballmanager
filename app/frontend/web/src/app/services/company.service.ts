import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {apiUrl} from "../app.config";
import {CompanyOverviewDTO} from "../model/dto/CompanyOverviewDTO";
import {CompanyDetailDTO} from "../model/dto/CompanyDetailDTO";


@Injectable({
    providedIn: 'root'
})
export class CompanyService {

    constructor(private http: HttpClient) { }

    getCompanyOverview(): Observable<CompanyOverviewDTO[]> {
        return this.http.get<CompanyOverviewDTO[]>(apiUrl + "/companies/overview");
    }

    getCompanyDetail(id: number): Observable<CompanyDetailDTO> {
        return this.http.get<CompanyDetailDTO>(`${apiUrl}/companies/detail/${id}`);
    }
}
