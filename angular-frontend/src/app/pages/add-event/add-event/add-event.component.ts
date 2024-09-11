import { EventCreation } from './../../../service/events/events.service';
import { EventsService, Event } from 'src/app/service/events/events.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent {
  eventName = '';
  eventDate = '';
  maxParticipants = '';
  locationX = '';
  locationY = '';
  eventType = '';
  employeeId = '';
  locationName = '';
  errMsg = '';
  errMsgInFail = '';

  newEvent?: EventCreation;

  constructor(private eventsService: EventsService, private router: Router, public _tloco: TranslocoService) {
    this.errMsgInFail = this._tloco.translate('addEvent.errMsgInFail');
  }

  async createEvent() {
    if (!this.eventName || !this.eventDate || !this.maxParticipants || !this.locationX || !this.locationY || !this.eventType || !this.employeeId || !this.locationName) {
      console.log(this.errMsgInFail);
      this.errMsg = this.errMsgInFail;
      return;
    }

    this.newEvent = await {
      name: this.eventName,
      date: this.eventDate,
      max_participants: parseInt(this.maxParticipants),
      location_x: this.locationX,
      location_y: this.locationY,
      type: this.eventType,
      employee_id: parseInt(this.employeeId),
      location_name: this.locationName
    };

    this.eventsService.createEvent(this.newEvent).subscribe((event) => {
      console.log("Event created successfully");
      this.router.navigate(["/events"]);
      this.errMsg = '';
    }, (error) => {
      console.log(error);
      this.errMsg = error;
    })
  }
}
