import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteUsabilitySurveyComponent } from './website-usability-survey.component';

describe('WebsiteUsabilitySurveyComponent', () => {
  let component: WebsiteUsabilitySurveyComponent;
  let fixture: ComponentFixture<WebsiteUsabilitySurveyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WebsiteUsabilitySurveyComponent]
    });
    fixture = TestBed.createComponent(WebsiteUsabilitySurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
