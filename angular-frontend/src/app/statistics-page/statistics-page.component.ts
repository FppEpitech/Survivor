import { Component } from '@angular/core';
import { CoachsComponent } from './component/coachs/coachs.component';
import { Charts } from './component/charts/charts/charts.component';

@Component({
  selector: 'app-statistics-page',
  standalone: true,
  imports: [CoachsComponent, Charts],
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.scss']
})
export class StatisticsPageComponent {

}
