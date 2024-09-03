import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    authState = false;
    private apiUrl = '/api';
    private groupToken = "26001e74fc50419476dbb6a180cb0152";

    constructor(private http: HttpClient) { }

    getData(email: string, password: string): Observable<any> {
        // return this.http.get<any>(this.apiUrl, {headers: myheader});

        const url = `/api/employees/login`;
        const headers = new HttpHeaders({
        'X-Group-Authorization': this.groupToken
        });

        return this.http.post(url, { email, password }, { headers });
    }

    // login(email: string, password: string): Observable<any> {

    // }

    // isAccessTokenInStorage () {

    // }

    // isTokenValid () {

    // }
}
