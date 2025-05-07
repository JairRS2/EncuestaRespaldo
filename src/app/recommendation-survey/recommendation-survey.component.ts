import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

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
  ].reverse();


  selectedResponse: string = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }
//metodo para obtener el valor de color basado en la opción
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

    this.http.post('https://7bd7-2806-10a6-24-8f9a-7d80-bdf4-8119-725c.ngrok-free.app/api/submit-recommendation', requestData)
      .subscribe({
        next: () => {
         Swal.fire({
              title: '¡Gracias por tu opinión!',
              imageUrl: 'assets/gracias.png',
              imageWidth: 100,
              imageHeight: 100,
              imageAlt: 'Imagen de agradecimiento',
              showConfirmButton: false,
              timer: 1500,
              customClass: {
                title: 'swal-title-elegante',
                popup: 'swal-popup-elegante'
              }
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
