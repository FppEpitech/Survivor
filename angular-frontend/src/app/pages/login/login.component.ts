import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

    SendLogin() {
        if (this.Email == '' || this.Password == '')
            return;
        console.log(this.Email);
        console.log(this.Password);
    }
}
