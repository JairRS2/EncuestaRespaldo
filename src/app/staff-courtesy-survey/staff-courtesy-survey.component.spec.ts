import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffCourtesySurveyComponent } from './staff-courtesy-survey.component';

describe('StaffCourtesySurveyComponent', () => {
  let component: StaffCourtesySurveyComponent;
  let fixture: ComponentFixture<StaffCourtesySurveyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StaffCourtesySurveyComponent]
    });
    fixture = TestBed.createComponent(StaffCourtesySurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
