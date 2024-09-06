import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private apiUrl = 'api';
    authLogged = false;

    constructor(private http: HttpClient, private router : Router) { }

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
        this.authLogged = false;
    }

    isLogged(): boolean {
        const token = localStorage.getItem("token")
        const dateString = localStorage.getItem("token_date")
        if (!dateString) {
          this.router.navigate(["/login"])
          this.authLogged = false;
          return false;
        }
        const date = parseInt(dateString,10)
        const now = Date.now()
        if ((now - date) > (24 * 60 * 60 * 1000)) {
          this.router.navigate(["/login"])
          localStorage.removeItem("token")
          localStorage.removeItem("token_date")
          this.authLogged = false;
          return false;
        }
        this.authLogged = token != null;
        return token != null
    }
}
