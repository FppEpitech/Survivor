import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';
@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports : [NgxChartsModule]
})

export class HomeComponent {

    constructor(public _auth: AuthService) {}




    barChartData1 = [
        { name: 'Customers', value: 10 },
        { name: 'meetings', value: 16 }
    ]

    barChartData2 = [
        { name: 'A', value: 10 },
        { name: 'B', value: 20 },
        { name: 'C', value: 15 },
        { name: 'D', value: 12 },
        { name: 'E', value: 16 },
    ]

    barChartData3 = [
        { name: 'Payments', value: 5 },
        { name: 'a', value: 10 },
    ]
}
