import { Component, OnInit } from '@angular/core';
import { HolidayCalendarService } from './holiday-calendar.service';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../calendar/calendar.component';
import { GradleLevel, Holiday } from '../types/api-types';
import { EMPTY, Observable } from 'rxjs';
import { PublicHolidaysComponent } from '../public-holidays/public-holidays.component';
import { HolidayLegendComponent, LegendEntry } from "../holiday-legend/holiday-legend.component";

@Component({
  selector: 'app-holiday-calendar',
  standalone: true,
  templateUrl: './holiday-calendar.component.html',
  styleUrl: './holiday-calendar.component.scss',
  imports: [CommonModule, CalendarComponent, PublicHolidaysComponent, HolidayLegendComponent]
})
export class HolidayCalendarComponent implements OnInit {
  year = 2024;
  months = [...Array(12)].map((_, i) => i);
  holidays$: Observable<Holiday[]> = EMPTY;
  legendEntries: LegendEntry[] = [
    {
      label: 'Public holidays',
      color: 'bg-orange-700'
    },
    {
      label: 'School holidays',
      color: 'bg-amber-200'
    }
  ]
  country = 'Singapore';

  constructor(private service: HolidayCalendarService) { }

  ngOnInit(): void {
    this.holidays$ = this.service.getHolidayData({
      countryIsoCode: 'SG',
      schoolGradleLevels: [GradleLevel.Primary],
    });
  }
}
