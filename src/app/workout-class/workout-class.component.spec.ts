import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutClassComponent } from './workout-class.component';

describe('WorkoutClassComponent', () => {
  let component: WorkoutClassComponent;
  let fixture: ComponentFixture<WorkoutClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkoutClassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkoutClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
