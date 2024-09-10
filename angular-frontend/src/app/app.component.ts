import { TranslocoService } from '@ngneat/transloco';
import { Component } from '@angular/core';
import { AuthService } from './service/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'angular-frontend';
    constructor (public _auth: AuthService, private _transloco : TranslocoService) {
      let lang = localStorage.getItem('lang')
      if (lang) {
        this._transloco.setActiveLang(lang);
      }
    }
}
