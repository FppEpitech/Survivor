import { Component } from '@angular/core';
import { TipsService } from './service/tips/tips.service';
import { Tip } from './service/tips/tips.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'angular-frontend';

    tips: Tip[] = [];
    selectedTip?: Tip;

    constructor(private tipsService: TipsService, private http: HttpClient) {
        // this.http.get("/api/tips").subscribe((data) => {
        //     console.log(data);
        // })
    };

    ngOnInit(): void {
        this.tipsService.getTips().subscribe(
            (data) => {
                this.tips = data
                console.log(this.tips[0].id)
            },
            (error) => console.error('Error fetching tips', error)
        );
    }
}
