import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Event, EventsService } from 'src/app/service/events/events.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {

  private map?: L.Map;

  events: Event[] = [];

  theme = localStorage.getItem('theme');

  constructor(private eventService : EventsService) {
    if (this.theme)
        document.documentElement.setAttribute('data-theme', this.theme);
  }

    ngOnInit(): void {
        this.initMap();

        this.eventService.getEvents().subscribe(events => {
        console.log(events);
        this.events = events;
        for (const event of events) {
            L.marker([parseFloat(event.location_x), parseFloat(event.location_y)]).addTo(this.map!)
            .bindPopup(event.name)
            .openPopup();
        }
        });
    }

  private initMap(): void {
    this.map = L.map('map').setView([48.86, 2.33], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

}
