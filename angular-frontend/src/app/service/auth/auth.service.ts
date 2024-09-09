import { EmployeesService } from 'src/app/service/employees/employees.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private apiUrl = environment.apiUrl;
    authLogged = false;

    constructor(private http: HttpClient, private router : Router, private employeesService: EmployeesService) { }

    login(email: string, password: string): void {
        if (email == '' || password == '')
            return;
        this.http.post(`${this.apiUrl}/login`, {email, password}).subscribe(
            (data : any) => {
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("token_date", Date.now().toString())
                    this.setManager();
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

    setManager() {
        this.employeesService.getMe().subscribe(

            (data) => {
                if (data && data.work !== undefined && data.work !== 'Coach') {
                    localStorage.setItem("Manager", "true");
                } else {
                    localStorage.setItem("Manager", "false");
                }
            },
            (error) => {
                console.log("Failed to get Me employee", error);
                localStorage.setItem("Manager", "false");
            }
        );
    }

    isManager () {
        return localStorage.getItem("Manager") === "true";
    }
}
