import { Component } from '@angular/core';
import { HolidayCalendarService } from './holiday-calendar.service';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from "../calendar/calendar.component";

@Component({
  selector: 'app-holiday-calendar',
  standalone: true,
  templateUrl: './holiday-calendar.component.html',
  styleUrl: './holiday-calendar.component.scss',
  imports: [CommonModule, CalendarComponent]
})
export class HolidayCalendarComponent {
  holidayData$ = this.service.getHolidayData({ countryIsoCode: 'SG' });

  constructor(private service: HolidayCalendarService) { }
}
