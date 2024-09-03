import { Component } from '@angular/core';
import { CoachsComponent } from './component/coachs/coachs.component';

@Component({
  selector: 'app-statistics-page',
  standalone: true,
  imports: [CoachsComponent],
  templateUrl: './statistics-page.component.html',
  styleUrl: './statistics-page.component.scss'
})
export class StatisticsPageComponent {

}
