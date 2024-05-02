import { Component, OnInit } from '@angular/core';
import { HolidayCalendarService } from './holiday-calendar.service';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../calendar/calendar.component';
import { GradleLevel, Holiday } from '../types/api-types';
import { EMPTY, Observable } from 'rxjs';
import { PublicHolidaysComponent } from '../public-holidays/public-holidays.component';

@Component({
  selector: 'app-holiday-calendar',
  standalone: true,
  templateUrl: './holiday-calendar.component.html',
  styleUrl: './holiday-calendar.component.scss',
  imports: [CommonModule, CalendarComponent, PublicHolidaysComponent],
})
export class HolidayCalendarComponent implements OnInit {
  year = 2024;
  months = [...Array(12)].map((_, i) => i);
  holidays$: Observable<Holiday[]> = EMPTY;

  constructor(private service: HolidayCalendarService) {}

  ngOnInit(): void {
    this.holidays$ = this.service.getHolidayData({
      countryIsoCode: 'SG',
      schoolGradleLevels: [GradleLevel.Primary],
    });
  }
}
