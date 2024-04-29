import { Component } from '@angular/core';
import { HolidayCalendarService } from './holiday-calendar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-holiday-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './holiday-calendar.component.html',
  styleUrl: './holiday-calendar.component.scss'
})
export class HolidayCalendarComponent {
  holidayData$ = this.service.getHolidayData({ countryIsoCode: 'SG' });

  constructor(private service: HolidayCalendarService) { }
}
