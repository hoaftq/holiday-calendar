import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayLegendComponent } from './holiday-legend.component';

describe('HolidayLegendComponent', () => {
  let component: HolidayLegendComponent;
  let fixture: ComponentFixture<HolidayLegendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HolidayLegendComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HolidayLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
