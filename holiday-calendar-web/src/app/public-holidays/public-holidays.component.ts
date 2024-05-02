import { Component, Input } from '@angular/core';
import { Holiday, HolidayType } from '../types/api-types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-holidays',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-holidays.component.html',
  styleUrl: './public-holidays.component.scss',
})
export class PublicHolidaysComponent {
  @Input() holidays: Holiday[] = [];

  get publicHolidays(): Holiday[] {
    return this.holidays
      .filter(h => h.type === HolidayType.PublicHoliday)
      .sort((h1, h2) => h1.from.localeCompare(h2.from));
  }
}
