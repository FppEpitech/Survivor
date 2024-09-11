import { TranslocoService } from '@ngneat/transloco';
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
    wrongPassword = false;

    constructor (private authService: AuthService, public _tloco: TranslocoService) {}

    loginClick () {
        this.authService.login(this.Email, this.Password);
        if (this.authService.isLogged() == false)
          this.wrongPassword = true;
        this.Password = '';
    }
}
