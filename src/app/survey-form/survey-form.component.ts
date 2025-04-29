import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

interface SatisfactionLevel {
  value: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-survey-form',
  templateUrl: './survey-form.component.html',
  styleUrls: ['./survey-form.component.css']
})
export class SurveyFormComponent {
  question1 = '¿Cómo calificaría la atención recibida por nuestro personal de taquilla / paquetería?';
  question2 = '¿Cuál es su nivel de satisfacción en general con el servicio que ofrece la empresa?';
  satisfactionLevels: SatisfactionLevel[] = [
    { value: 'muy-insatisfecho', label: 'Muy insatisfecho', icon: '/assets/Muy_Molesto.png' },
    { value: 'insatisfecho', label: 'Insatisfecho', icon: '/assets/Molesto.png' },
    { value: 'neutral', label: 'Neutral', icon: '/assets/Neutral.png' },
    { value: 'satisfecho', label: 'Satisfecho', icon: '/assets/Feliz.png' },
    { value: 'muy-satisfecho', label: 'Muy satisfecho',icon: '/assets/Muy_Feliz.png' }
  ];
  responseQ1: string = '';
  responseQ2: string = '';
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }
//metodo para enviar las respuestas del cliente
  sendResponse(question: 'q1' | 'q2', value: string) {
    // Actualiza primero la respuesta local
    if (question === 'q1') {
      this.responseQ1 = value;
    } else {
      this.responseQ2 = value;
    }

    // Solo envía al backend cuando ambas respuestas estén completas
    if (this.responseQ1 && this.responseQ2) {
      const requestData = {
        q1: this.responseQ1,
        q2: this.responseQ2
      };

      this.http.post('https://4c88-2806-10a6-6-5d2-7d80-bdf4-8119-725c.ngrok-free.app/api/submit-survey', requestData)
        .subscribe({
          next: (response: any) => {
            console.log('Respuestas enviadas:', response);
            this.errorMessage = '';
            this.snackBar.open('¡Gracias por completar la encuesta!', 'Cerrar', {
              duration: 3000
            });
            this.responseQ1 = '';
            this.responseQ2 = ''; // Limpiar después del envío
            this.errorMessage = '';
          },
          error: (error) => {
            console.error('Error al enviar respuestas:', error);
            this.errorMessage = 'Error al guardar las respuestas. Por favor intenta nuevamente.';
          }
        });
    }
  }
}
