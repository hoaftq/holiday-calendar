import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HolidayCalendarComponent } from "./holiday-calendar/holiday-calendar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, HolidayCalendarComponent]
})
export class AppComponent {
  title = 'holiday-calendar-web';
}
