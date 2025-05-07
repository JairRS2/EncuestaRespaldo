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
  selector: 'app-survey-form',
  templateUrl: './survey-form.component.html',
  styleUrls: ['./survey-form.component.css']
})
export class SurveyFormComponent {
  question1 = '¿Cómo calificaría la atención recibida por nuestro personal de taquilla / paquetería?';
  options1: RatingOption[] = [
    { value: 'muy-insatisfecho', label: 'Muy Insatisfecho', icon: '/assets/Muy_Molesto.png', colorValue: 5 },
    { value: 'insatisfecho', label: 'Insatisfecho', icon: '/assets/Molesto.png', colorValue: 4 },
    { value: 'neutral', label: 'Neutral', icon: '/assets/Neutral.png', colorValue: 3 },
    { value: 'satisfecho', label: 'Satisfecho', icon: '/assets/Feliz.png', colorValue: 2 },
    { value: 'muy-satisfecho', label: 'Muy Satisfecho', icon: '/assets/Muy_Feliz.png', colorValue: 1 }
  ];
  selectedResponse1: string = '';

  question2 = '¿Cuál es su nivel de satisfacción en general con el servicio que ofrece la empresa?';
  options2: RatingOption[] = [
    { value: 'muy-insatisfecho', label: 'Muy Insatisfecho', icon: '/assets/Muy_Molesto.png', colorValue: 5 },
    { value: 'insatisfecho', label: 'Insatisfecho', icon: '/assets/Molesto.png', colorValue: 4 },
    { value: 'neutral', label: 'Neutral', icon: '/assets/Neutral.png', colorValue: 3 },
    { value: 'satisfecho', label: 'Satisfecho', icon: '/assets/Feliz.png', colorValue: 2 },
    { value: 'muy-satisfecho', label: 'Muy Satisfecho', icon: '/assets/Muy_Feliz.png', colorValue: 1 }
  ];
  selectedResponse2: string = '';

  errorMessage = '';
  isLoading = false;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }
//Metodo para obtener el valor de color basado en la opción
  onOptionSelect1(value: string) {
    this.selectedResponse1 = value;
    this.trySubmitResponses();
  }
//metodo para obtener el valor de color basado en la opción
  onOptionSelect2(value: string) {
    this.selectedResponse2 = value;
    this.trySubmitResponses();
  }
//Metodo para enviar las respuestas del cliente
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
      q1: this.selectedResponse1,
      q2: this.selectedResponse2,
      timestamp: new Date().toISOString()
    };

    this.http.post('https://7bd7-2806-10a6-24-8f9a-7d80-bdf4-8119-725c.ngrok-free.app/api/submit-survey', requestData)
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
          console.error('Error al enviar respuestas:', error);
          this.isLoading = false;
          this.errorMessage = 'Error al guardar las respuestas. Por favor intenta nuevamente.';
          this.snackBar.open('Error al enviar la respuesta', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }
//Metodo para reiniciar el formulario
  resetForm() {
    this.selectedResponse1 = '';
    this.selectedResponse2 = '';
  }
}
