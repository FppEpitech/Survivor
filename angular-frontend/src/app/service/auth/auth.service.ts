import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private apiUrl = 'api/employees/login';
    authState = false;

    constructor(private http: HttpClient) { }

    // getData(email: string, password: string): Observable<any> {
    //     // return this.http.get<any>(this.apiUrl, {headers: myheader});

    //     const url = `/api/employees/login`;
    //     const headers = new HttpHeaders({
    //     'X-Group-Authorization': this.groupToken
    //     });

    //     return this.http.post(url, { email, password }, { headers });
    // }

    loginRequest(email: string, password: string): Observable<any> {
        return this.http.post(`${this.apiUrl}`, {email, password});
    }

    login(email: string, password: string): void {
        if (email == '' || password == '')
            return;
        this.loginRequest(email, password).subscribe(
            (data) => {
                console.log(data);
                if (data != null) {
                    localStorage.setItem("access_token", data);
                } else {
                    console.error('Error empty access token');
                }
            },
            (error) => {console.error('Error wrong login');}
        );
    }

    // isAccessTokenInStorage () {

    // }

    // isTokenValid () {

    // }
}
