import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlanComponent } from './addplan.component';

describe('AddPlanComponent', () => {
  let component: AddPlanComponent;
  let fixture: ComponentFixture<AddPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
