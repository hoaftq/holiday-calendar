import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface LegendEntry {
  label: string;
  color: string;
}

@Component({
  selector: 'app-holiday-legend',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './holiday-legend.component.html',
  styleUrl: './holiday-legend.component.scss'
})
export class HolidayLegendComponent {
  @Input()
  legendEntries: LegendEntry[] = [];
}
