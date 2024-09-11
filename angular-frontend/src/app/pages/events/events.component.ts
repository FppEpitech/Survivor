import { backgroundColorNames } from './../../../../node_modules/@isaacs/cliui/node_modules/ansi-styles/index.d';
import { TranslocoService } from '@ngneat/transloco';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { Event, EventsService } from 'src/app/service/events/events.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import en from '@fullcalendar/core/locales/en-gb';
import fr from '@fullcalendar/core/locales/fr';
import es from '@fullcalendar/core/locales/es';
import zh from '@fullcalendar/core/locales/zh-cn';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid'

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {


  private map?: L.Map;

  events: Event[] = [];
  eventsToDisplay: any[] = [];
  clang = this._tloco.getActiveLang();
  clang_locale = this.clang == 'en' ? en : this.clang == 'fr' ? fr : this.clang == 'es' ? es : zh;


  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, listPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    height: 500,
    hiddenDays: [7],
    locale: this.clang_locale,
    events: this.eventsToDisplay,
    eventClick: (data) => {
      const description = data.event.extendedProps['description'];
      alert(description);
    },
    headerToolbar: {
      left: 'prev,next,title',
      center: '',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    },
    firstDay: 0
  };

  constructor(private eventService : EventsService, private _tloco: TranslocoService) {
    this._tloco.langChanges$.subscribe(lang => {
      this.clang = lang;
      this.clang_locale = this.clang == 'en' ? en : this.clang == 'fr' ? fr : this.clang == 'es' ? es : zh;
      this.calendarOptions.locale = this.clang
    });
  }


    ngOnInit(): void {
        this.initMap();

        this.eventService.getEvents().subscribe(events => {
        this.events = events;
        for (const event of events) {
          this.addEvent(event.name, event.date, `${this._tloco.translate('maxParticipantsTxt')}: ${event.max_participants}, ${this._tloco.translate('dateTxt')}: ${event.date} --> : ${event.location_name}`);
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

  addEvent(title :  string, date : string, desc : string) {
    console.log(date);
    this.eventsToDisplay.push({title: title, date: new Date(date), description: desc, backgroundColor:"green"});
  }
}
