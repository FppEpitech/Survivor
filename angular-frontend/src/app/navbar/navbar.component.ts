import { AuthService } from 'src/app/service/auth/auth.service';
import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  public width = window.innerWidth
  displayNav = false

  constructor(public _auth : AuthService, private router : Router) {
    window.addEventListener('resize', this.onResize.bind(this));

    this.router.events.subscribe(() => {
      this.displayNav = false;
    });
  }

  private onResize(): void {
    this.width = window.innerWidth;
  }

  public toggleNav() {
    this.displayNav = !this.displayNav
  }
}
