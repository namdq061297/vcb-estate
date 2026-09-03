import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldTimeSlotComponent } from './gold-time-slot.component';

describe('TimeSlotComponent', () => {
  let component: GoldTimeSlotComponent;
  let fixture: ComponentFixture<GoldTimeSlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoldTimeSlotComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GoldTimeSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
