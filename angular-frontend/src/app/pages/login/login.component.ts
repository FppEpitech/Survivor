import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule]
})
export class LoginComponent {
    Email = '';
    Password = '';

    constructor (private authService: AuthService) {}

    loginClick () {
        this.authService.loginRequest(this.Email, this.Password);
        this.Password = '';
    }
}
