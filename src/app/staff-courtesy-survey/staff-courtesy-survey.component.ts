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
  selector: 'app-staff-courtesy-survey',
  templateUrl: './staff-courtesy-survey.component.html',
  styleUrls: ['./staff-courtesy-survey.component.css']
})
export class StaffCourtesySurveyComponent {
  question1 = '¿Cómo calificaría la amabilidad y cortesía del personal de atención al cliente?';
  question2 = '¿Qué tan atento diría que fue el personal a sus necesidades?';

  optionsAmabilidad: RatingOption[] = [
    { value: 'muy-buena', label: 'Muy buena', icon: '/assets/Muy_Feliz.png', colorValue: 1 },
    { value: 'buena', label: 'Buena', icon: '/assets/Feliz.png', colorValue: 2 },
    { value: 'regular', label: 'Regular', icon: '/assets/Neutral.png', colorValue: 3 },
    { value: 'mala', label: 'Mala', icon: '/assets/Molesto.png', colorValue: 4 },
    { value: 'muy-mala', label: 'Muy mala', icon: '/assets/Muy_Molesto.png', colorValue: 5 }
  ].reverse();
  optionsAtencion: RatingOption[] = [
    { value: 'muy-atento', label: 'Muy atento', icon: '/assets/Muy_Feliz.png', colorValue: 1 },
    { value: 'atento', label: 'Atento', icon: '/assets/Feliz.png', colorValue: 2 },
    { value: 'neutral', label: 'Neutral', icon: '/assets/Neutral.png', colorValue: 3 },
    { value: 'poco-atento', label: 'Poco atento', icon: '/assets/Molesto.png', colorValue: 4 },
    { value: 'nada-atento', label: 'Nada atento', icon: '/assets/Muy_Molesto.png', colorValue: 5 }
  ].reverse();

  selectedResponseQ1: string = '';
  selectedResponseQ2: string = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  onOptionSelectQ1(value: string) {
    this.selectedResponseQ1 = value;
    this.trySubmitResponses();
  }

  onOptionSelectQ2(value: string) {
    this.selectedResponseQ2 = value;
    this.trySubmitResponses();
  }

  trySubmitResponses() {
    if (this.selectedResponseQ1 && this.selectedResponseQ2) {
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
      amabilidad: this.selectedResponseQ1,
      atencion: this.selectedResponseQ2,
      timestamp: new Date().toISOString()
    };

    this.http.post('https://cd68-2806-10a6-6-5d2-7d80-bdf4-8119-725c.ngrok-free.app/api/submit-staff-courtesy', requestData)
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
    this.selectedResponseQ1 = '';
    this.selectedResponseQ2 = '';
  }
}
