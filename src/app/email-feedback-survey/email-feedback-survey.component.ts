import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

interface RatingOption {
  value: string;
  label: string;
  icon: string;
  colorValue: number;
}

@Component({
  selector: 'app-email-feedback-survey',
  templateUrl: './email-feedback-survey.component.html',
  styleUrls: ['./email-feedback-survey.component.css']
})
export class EmailFeedbackSurveyComponent {
  question1 = '¿Cómo calificaría la utilidad de la información proporcionada en los correos electrónicos?';
  options1: RatingOption[] = [
    { value: 'muy-insatisfecho', label: 'Muy In satisfecho', icon: '/assets/Muy_Molesto.png', colorValue: 5 },
    { value: 'insatisfecho', label: 'In satisfecho', icon: '/assets/Molesto.png', colorValue: 4 },
    { value: 'neutral', label: 'Neutral', icon: '/assets/Neutral.png', colorValue: 3 },
    { value: 'satisfecho', label: 'Satisfecho', icon: '/assets/Feliz.png', colorValue: 2 },
    { value: 'muy-satisfecho', label: 'Muy Satisfecho', icon: '/assets/Muy_Feliz.png', colorValue: 1 }
  ].reverse();
  selectedResponse1: string = '';

  question2 = '¿Con qué frecuencia encuentra útil la información que le enviamos por correo electrónico?';
  options2: RatingOption[] = [
    { value: 'nunca', label: 'Nunca', icon: '/assets/Muy_Molesto.png', colorValue: 5 },
    { value: 'rara-vez', label: 'Rara vez', icon: '/assets/Molesto.png', colorValue: 4 },
    { value: 'a-veces', label: 'A veces', icon: '/assets/Neutral.png', colorValue: 3 },
    { value: 'a-menudo', label: 'A menudo', icon: '/assets/Feliz.png', colorValue: 2 },
    { value: 'siempre', label: 'Siempre', icon: '/assets/Muy_Feliz.png', colorValue: 1 }
  ].reverse();
  selectedResponse2: string = '';

  errorMessage = '';
  isLoading = false;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  onOptionSelect1(value: string) {
    this.selectedResponse1 = value;
    this.trySubmitResponses();
  }

  onOptionSelect2(value: string) {
    this.selectedResponse2 = value;
    this.trySubmitResponses();
  }

  trySubmitResponses() {
    if (this.selectedResponse1 && this.selectedResponse2) {
      this.submitResponses();
    } else {
      this.errorMessage = ''; // Limpiar el mensaje de error si aún no se han respondido ambas
    }
  }
//Metodo para enviar las respuestas del cliente
  submitResponses() {
    this.isLoading = true;
    this.errorMessage = '';

    const requestData = {
      utilidadEmail: this.selectedResponse1,
      frecuenciaUtilEmail: this.selectedResponse2,
      timestamp: new Date().toISOString()
    };

    this.http.post('https://cd68-2806-10a6-6-5d2-7d80-bdf4-8119-725c.ngrok-free.app/api/submit-email-feedback', requestData)
      .subscribe({
        next: () => {
       Swal.fire({
            title: '¡Gracias por tu opinión!',
            imageUrl: 'assets/gracias2.png',
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
//Metodo para reiniciar el formulario y inicializar los valores
  resetForm() {
    this.selectedResponse1 = '';
    this.selectedResponse2 = '';
  }
}
