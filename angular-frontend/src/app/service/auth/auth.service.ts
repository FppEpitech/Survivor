import { Employee, EmployeesService } from 'src/app/service/employees/employees.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private apiUrl = environment.apiUrl;
    authLogged = false;
    private employee?: Employee;
    private _transloco: any;
    private token?: any;
    private myToken?: string;

    constructor(private http: HttpClient, private router : Router, private employeesService: EmployeesService) { }

    async tryLog(email: string, password: string): Promise<string | undefined> {
        try {
            this.token = await firstValueFrom(this.http.post(`${this.apiUrl}/login`, {email, password}));
            return this.token.token;
        } catch (error) {
            console.error("Failed to login", error);
            this.token = undefined;
            return undefined;
        }
    }

    async login(email: string, password: string): Promise<boolean> {
        if (email == '' || password == '')
            return false;
        this.myToken = await this.tryLog(email, password);
        if (this.myToken) {
            localStorage.setItem("token", this.myToken);
            localStorage.setItem("token_date", Date.now().toString());
            this.setManager();
            this.router.navigate(["/"]);
            return true;
        } else {
            console.error('Error empty access token');
            return false;
        }
    }

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("Manager");
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

    isManager() {
        return localStorage.getItem("Manager") === "true";
    }

    isCoach(employee: Employee): boolean {
        return employee.work === 'Coach';
    }
}
