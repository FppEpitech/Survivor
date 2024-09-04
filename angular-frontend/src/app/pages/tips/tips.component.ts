import { Component } from '@angular/core';
import { TipsService, Tip } from 'src/app/service/tips/tips.service';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.scss']
})
export class TipsComponent {

  tips: Tip[] = [];

  constructor(private tipsService: TipsService) {}

  ngOnInit(): void {
    this.tipsService.getTips().subscribe(
      (data) => {
        console.log(data);
        this.tips = data;
      },
      (error) => { console.error('Failed to load tips', error); }
    );
  }

}
