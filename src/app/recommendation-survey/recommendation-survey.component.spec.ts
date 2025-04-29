import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendationSurveyComponent } from './recommendation-survey.component';

describe('RecommendationSurveyComponent', () => {
  let component: RecommendationSurveyComponent;
  let fixture: ComponentFixture<RecommendationSurveyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecommendationSurveyComponent]
    });
    fixture = TestBed.createComponent(RecommendationSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
