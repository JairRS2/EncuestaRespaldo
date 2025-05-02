import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailFeedbackSurveyComponent } from './email-feedback-survey.component';

describe('EmailFeedbackSurveyComponent', () => {
  let component: EmailFeedbackSurveyComponent;
  let fixture: ComponentFixture<EmailFeedbackSurveyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailFeedbackSurveyComponent]
    });
    fixture = TestBed.createComponent(EmailFeedbackSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
