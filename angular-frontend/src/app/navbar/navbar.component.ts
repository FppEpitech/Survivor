import { AuthService } from 'src/app/service/auth/auth.service';
import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  public width = window.innerWidth
  displayNav = false
  langValue = this._transloco.getActiveLang()

  constructor(public _auth : AuthService, private router : Router, public _transloco : TranslocoService) {
    window.addEventListener('resize', this.onResize.bind(this));

    this.router.events.subscribe(() => {
      this.displayNav = false;
    });
  }

  langChangeSelect(lang : string) {
    this._transloco.setActiveLang(lang)
    localStorage.setItem('lang', lang)
  }

  private onResize(): void {
    this.width = window.innerWidth;
  }

  public toggleNav() {
    this.displayNav = !this.displayNav
  }
}
