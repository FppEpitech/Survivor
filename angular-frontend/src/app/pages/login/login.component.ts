import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    Email = '';
    Password = '';

    constructor (private authService: AuthService) {}

    loginClick () {
        this.authService.login(this.Email, this.Password);
        this.Password = '';
    }
}
