import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Holiday, HolidayType } from '../types/api-types';
import { DayType } from '../types/types';

interface Day {
  dayOfMonth: number | null;
  type: DayType | null;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnChanges {
  daysOfWeekNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  weeks: Day[][] = [[]];

  @Input() holidays: Holiday[] = [];
  @Input() year: number;
  @Input() month: number;

  constructor() {
    const today = new Date();
    this.year = today.getFullYear();
    this.month = today.getMonth();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.holidays.length) {
      return;
    }

    this.prepareDays();
  }

  get monthName() {
    return new Date(this.year, this.month, 1).toLocaleString('default', {
      month: 'long',
    });
  }

  private prepareDays() {
    const firstDay = new Date(this.year, this.month, 1);
    for (let i = 0; i < firstDay.getDay(); i++) {
      this.addDay(null);
    }

    const lastDay = new Date(this.year, this.month + 1, 0);
    for (let i = 0; i < lastDay.getDate(); i++) {
      this.addDay(i + 1);
    }

    const lastLine = this.weeks[this.weeks.length - 1];
    for (let i = lastLine.length; i < 7; i++) {
      this.addDay(null);
    }
  }

  private addDay(dayOfMonth: number | null) {
    const day: Day = {
      dayOfMonth,
      type: dayOfMonth ? this.getDayType(this.holidays, dayOfMonth) : null,
    };

    const lastWeek = this.weeks[this.weeks.length - 1];
    if (lastWeek.length < 7) {
      lastWeek.push(day);
    } else {
      this.weeks.push([day]);
    }
  }

  private getDayType(holidays: Holiday[], dayOfMonth: number): DayType | null {
    const date = `${this.year}-${this.pad0(this.month + 1)}-${this.pad0(
      dayOfMonth
    )}`;
    for (const h of holidays) {
      if (date === h.from || (h.to && h.from <= date && date <= h.to)) {
        return {
          isPublicHoliday: h.type === HolidayType.PublicHoliday,
          isSchoolHoliday: h.type === HolidayType.SchoolHoliday,
          gradeLevels: h.gradeLevels,
        };
      }
    }

    return null;
  }

  private pad0(n: number): string {
    return ('0' + n).slice(-2);
  }
}
