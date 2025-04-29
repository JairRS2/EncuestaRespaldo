import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveyFormComponent } from './survey-form/survey-form.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { RecommendationSurveyComponent } from './recommendation-survey/recommendation-survey.component';
import { AuthGuard } from './auth.guard';
import { PurchaseEaseSurveyComponent } from './purchase-ease-survey/purchase-ease-survey.component';

const routes: Routes = [
  {
    path: '',
    component: SurveyFormComponent,
    data: { title: 'Encuesta de Satisfacción' }
  },
  {
    path: 'recomendacion',
    component: RecommendationSurveyComponent,
    data: { title: 'Encuesta de Recomendación' }
  },
   {
    path: 'CompraBoletos',
    component: PurchaseEaseSurveyComponent,
    data: { title: 'Encuesta de CompraBoletos' }
  },
  {
    path: 'admin/estadisticas',
    component: StatisticsComponent,
    canActivate: [AuthGuard],
    data: { title: 'Estadísticas' }
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
