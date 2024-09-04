import { Component } from '@angular/core';
import { CoachsComponent } from './component/coachs/coachs.component';
import { Charts } from './component/charts/charts/charts.component';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CoachsComponent, Charts],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsPageComponent {

}
