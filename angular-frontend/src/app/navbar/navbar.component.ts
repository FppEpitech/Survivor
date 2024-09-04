import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  public width = window.innerWidth
  displayNav = false

  constructor() {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  private onResize(): void {
    this.width = window.innerWidth;
  }

  public toggleNav() {
    this.displayNav = !this.displayNav
  }
}
