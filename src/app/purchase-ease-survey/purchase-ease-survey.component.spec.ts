import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseEaseSurveyComponent } from './purchase-ease-survey.component';

describe('PurchaseEaseSurveyComponent', () => {
  let component: PurchaseEaseSurveyComponent;
  let fixture: ComponentFixture<PurchaseEaseSurveyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseEaseSurveyComponent]
    });
    fixture = TestBed.createComponent(PurchaseEaseSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
