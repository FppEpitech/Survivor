import { Component, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { Event, EventsService } from 'src/app/service/events/events.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions } from '@fullcalendar/core';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {

  private map?: L.Map;

  events: Event[] = [];
  eventsToDisplay: any[] = [];
  constructor(private eventService : EventsService) {}
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    height: 500,
    hiddenDays: [ 7 ],
    events: this.eventsToDisplay,
    };
    ngOnInit(): void {
        this.initMap();

        this.eventService.getEvents().subscribe(events => {
        this.events = events;
        for (const event of events) {
          this.addEvent(event.name, event.date);

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

  addEvent(title :  string, date : string) {
    console.log(date);
    this.eventsToDisplay.push({title: title, date: new Date(date)});
  }
}
