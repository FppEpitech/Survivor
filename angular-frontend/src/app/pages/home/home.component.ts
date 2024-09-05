import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Component } from '@angular/core';
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports : [NgxChartsModule]
})

export class HomeComponent {
  barChartData = [    { name: 'A', value: 10 },
  { name: 'B', value: 20 },
  { name: 'C', value: 15 }
  ]

   edit() {
    this.barChartData = [    { name: 'A', value: 10 },
    { name: 'B', value: 25 },
    { name: 'C', value: 15 }
    ]
   }
}
