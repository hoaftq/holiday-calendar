import { Component, OnInit } from '@angular/core';
import { HolidayCalendarService } from './holiday-calendar.service';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../calendar/calendar.component';
import { Holiday } from '../types/api-types';
import { EMPTY, Observable } from 'rxjs';

@Component({
  selector: 'app-holiday-calendar',
  standalone: true,
  templateUrl: './holiday-calendar.component.html',
  styleUrl: './holiday-calendar.component.scss',
  imports: [CommonModule, CalendarComponent],
})
export class HolidayCalendarComponent implements OnInit {
  months = [...Array(12)].map((_, i) => i);
  holidays$: Observable<Holiday[]> = EMPTY;

  constructor(private service: HolidayCalendarService) {}

  ngOnInit(): void {
    this.holidays$ = this.service.getHolidayData({ countryIsoCode: 'SG' });
  }
}
