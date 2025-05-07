import { BrowserModule } from '@angular/platform-browser';
import { NgModule, isDevMode } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AppComponent } from './app.component';
import { SurveyFormComponent } from './survey-form/survey-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StatisticsComponent } from './statistics/statistics.component';
import { NgChartsModule } from 'ng2-charts';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router'; // <-- Importa esto
import { AppRoutingModule } from './app-routing.module';
import { RecommendationSurveyComponent } from './recommendation-survey/recommendation-survey.component';
import { PurchaseEaseSurveyComponent } from './purchase-ease-survey/purchase-ease-survey.component';
import { EmailFeedbackSurveyComponent } from './email-feedback-survey/email-feedback-survey.component';
import { WebsiteUsabilitySurveyComponent } from './website-usability-survey/website-usability-survey.component';
import { StaffCourtesySurveyComponent } from './staff-courtesy-survey/staff-courtesy-survey.component';
import { ServiceWorkerModule } from '@angular/service-worker'; // <-- Añade esto
@NgModule({
  declarations: [
    AppComponent,
    SurveyFormComponent,
    StatisticsComponent,
    RecommendationSurveyComponent,
    PurchaseEaseSurveyComponent,
    EmailFeedbackSurveyComponent,
    WebsiteUsabilitySurveyComponent,
    StaffCourtesySurveyComponent

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    MatButtonModule,
    MatRadioModule,
    MatCardModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    NgChartsModule,
    RouterModule,
    MatProgressSpinnerModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }) // <-- Añade esto
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
