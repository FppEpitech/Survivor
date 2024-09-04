import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private apiUrl = 'api';

    constructor(private http: HttpClient, private router : Router) { }

    // getData(email: string, password: string): Observable<any> {
    //     // return this.http.get<any>(this.apiUrl, {headers: myheader});

    //     const url = `/api/employees/login`;
    //     const headers = new HttpHeaders({
    //     'X-Group-Authorization': this.groupToken
    //     });

    //     return this.http.post(url, { email, password }, { headers });
    // }

    login(email: string, password: string): void {
        if (email == '' || password == '')
            return;
        this.http.post(`${this.apiUrl}/login`, {email, password}).subscribe(
            (data : any) => {
                console.log(data);
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("token_date", Date.now().toString())
                    this.router.navigate(["/"]);
                } else {
                    console.error('Error empty access token');
                }
            },
            (error) => {console.error('Error wrong login');}
        );
    }

    logout() {
        localStorage.removeItem("token")
        this.router.navigate(["/login"]);
    }

    // isAccessTokenInStorage () {

    // }

    // isTokenValid () {

    // }
}
