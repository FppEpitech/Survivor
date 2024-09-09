import { Employee, EmployeesService } from 'src/app/service/employees/employees.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private apiUrl = environment.apiUrl;
    authLogged = false;
    private employee?: Employee;

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

    async setManager() {
        this.employee = await this.employeesService.getMe();
        if (this.employee === undefined)
            return;
        if (this.employee && this.employee.work !== undefined && this.employee.work !== 'Coach') {
            localStorage.setItem("Manager", "true");
        } else {
            localStorage.setItem("Manager", "false");
        }
    }

    isManager () {
        return localStorage.getItem("Manager") === "true";
    }
}
