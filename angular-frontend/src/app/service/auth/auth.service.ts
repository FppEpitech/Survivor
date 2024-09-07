import { EmployeesService } from 'src/app/service/employees/employees.service';
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

    constructor(private http: HttpClient, private router : Router, private employeesService: EmployeesService) { }

    login(email: string, password: string): void {
        if (email == '' || password == '')
            return;
        this.http.post(`${this.apiUrl}/login`, {email, password}).subscribe(
            (data : any) => {
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

    async isManager(): Promise<boolean> {
        try {
            const data = await this.employeesService.getMe().toPromise();

            if (data && data.work !== undefined) {
                return data.work !== 'Coach';
            } else {
                return false;
            }
        } catch (error) {
            console.log("Failed to get Me employee", error);
            return false;
        }
    }
}
