import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

interface RecommendationOption {
  value: string;
  label: string;
  icon: string;
  colorValue: number; // Propiedad requerida para semaforización
}

@Component({
  selector: 'app-recommendation-survey',
  templateUrl: './recommendation-survey.component.html',
  styleUrls: ['./recommendation-survey.component.css']
})
export class RecommendationSurveyComponent {
  question = '¿Recomendarías nuestros servicios a amigos, familiares u otras personas?';

  options: RecommendationOption[] = [
    { value: 'definitely-yes', label: 'Definitivamente sí', icon: '/assets/Muy_Feliz.png', colorValue: 1 },
    { value: 'probably-yes', label: 'Probablemente sí', icon: '/assets/Feliz.png', colorValue: 2 },
    { value: 'not-sure', label: 'No estoy seguro', icon: '/assets/Neutral.png', colorValue: 3},
    { value: 'probably-no', label: 'Probablemente no', icon: '/assets/Molesto.png', colorValue: 4 },
    { value: 'definitely-no', label: 'Definitivamente no', icon: '/assets/Muy_Molesto.png', colorValue: 5 }
  ];


  selectedResponse: string = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  onOptionSelect(value: string) {
    this.selectedResponse = value;
    this.submitResponse(value);
  }
//metodo para enviar las respuestas del cliente
  submitResponse(value: string) {
    this.isLoading = true;
    this.errorMessage = '';

    const requestData = {
      recommendation: value,
      timestamp: new Date().toISOString()
    };

    this.http.post('https://4c88-2806-10a6-6-5d2-7d80-bdf4-8119-725c.ngrok-free.app/api/submit-recommendation', requestData)
      .subscribe({
        next: () => {
          this.snackBar.open('¡Gracias por tu recomendación!', 'Cerrar', {
            duration: 2000,
            panelClass: ['success-snackbar']
          });
          this.resetForm();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error:', error);
          this.isLoading = false;
          this.errorMessage = 'Error al enviar. Por favor intenta nuevamente.';
          this.snackBar.open('Error al enviar la respuesta', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }
//metodo para reiniciar el formulario
  resetForm() {
    this.selectedResponse = '';
  }
}
