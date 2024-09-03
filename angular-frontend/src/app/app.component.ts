import { Component } from '@angular/core';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-frontend';


  data: any;
  constructor(private api: AuthService) {}

  ngOnInit() {
    this.api.getData("jeanne.martin@soul-connection.fr", "naouLeA82oeirn").subscribe(
      (response) => {
        this.data = response.token;
        console.log("yaaaaaaa");
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  };
}
