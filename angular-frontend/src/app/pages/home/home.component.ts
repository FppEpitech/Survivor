import { Component } from '@angular/core';
import { Charts } from './component/charts/charts.component';


@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [Charts]
})

export class HomeComponent {

}
