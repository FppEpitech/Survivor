import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bad-request',
  templateUrl: './bad-request.component.html',
  styleUrls: ['./bad-request.component.scss']
})
export class BadRequestComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']); // Remplace '/' par la route d'accueil
  }
}
