import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';
import {apiUrl} from "../app.config";
import {CompanyOverviewDTO} from "../model/dto/CompanyOverviewDTO";
import {CompanyDetailDTO} from "../model/dto/CompanyDetailDTO";
import {Company} from "../model/Company";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";


@Injectable({
    providedIn: 'root'
})
export class CompanyService {

    constructor(private http: HttpClient) {
    }

    getCompanyOverview(): Observable<CompanyOverviewDTO[]> {
        return this.http.get<CompanyOverviewDTO[]>(apiUrl + "/companies/overview");
    }

    getCompanyDetail(id: number): Observable<CompanyDetailDTO> {
        return this.http.get<CompanyDetailDTO>(`${apiUrl}/companies/detail/${id}`);
    }

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'my-auth-token'
        })
    };

    updateCompany(company: Company): Observable<Company> {
        return this.http.post<Company>(apiUrl, company, this.httpOptions)
            .pipe(
                catchError( (err, caught) => {console.log(err); return caught})
            );
    }
}
