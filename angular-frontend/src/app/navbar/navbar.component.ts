import { AuthService } from 'src/app/service/auth/auth.service';
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
  isManager = false;

  constructor(public authService: AuthService) {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  async ngOnInit() {
    this.isManager = await this.authService.isManager();
  }

  private onResize(): void {
    this.width = window.innerWidth;
  }

  public toggleNav() {
    this.displayNav = !this.displayNav
  }
}
