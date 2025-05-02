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
  selector: 'app-website-usability-survey',
  templateUrl: './website-usability-survey.component.html',
  styleUrls: ['./website-usability-survey.component.css']
})
export class WebsiteUsabilitySurveyComponent {
  question1 = '¿Cómo calificaría la facilidad para encontrar la información que buscaba en nuestra página web/redes sociales?';
  question2 = '¿Qué tan intuitiva le pareció la navegación en nuestra página web/redes sociales?';

  optionsFacilidad: RatingOption[] = [
    { value: 'muy-dificil', label: 'Muy difícil', icon: '/assets/Muy_Molesto.png', colorValue: 5 },
    { value: 'dificil', label: 'Difícil', icon: '/assets/Molesto.png', colorValue: 4 },
    { value: 'neutral', label: 'Neutral', icon: '/assets/Neutral.png', colorValue: 3 },
    { value: 'facil', label: 'Fácil', icon: '/assets/Feliz.png', colorValue: 2 },
    { value: 'muy-facil', label: 'Muy fácil', icon: '/assets/Muy_Feliz.png', colorValue: 1 }
  ];

  optionsIntuitividad: RatingOption[] = [
    { value: 'muy-poco-intuitiva', label: 'Muy poco intuitiva', icon: '/assets/Muy_Molesto.png', colorValue: 5 },
    { value: 'poco-intuitiva', label: 'Poco intuitiva', icon: '/assets/Molesto.png', colorValue: 4 },
    { value: 'neutral', label: 'Neutral', icon: '/assets/Neutral.png', colorValue: 3 },
    { value: 'intuitiva', label: 'Intuitiva', icon: '/assets/Feliz.png', colorValue: 2 },
    { value: 'muy-intuitiva', label: 'Muy intuitiva', icon: '/assets/Muy_Feliz.png', colorValue: 1 }
  ];

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


  submitResponses() {
    this.isLoading = true;
    this.errorMessage = '';

    const requestData = {
      facilidadInfoWeb: this.selectedResponseQ1,
      intuitividadNavegacion: this.selectedResponseQ2,
      timestamp: new Date().toISOString()
    };

    this.http.post('https://cd68-2806-10a6-6-5d2-7d80-bdf4-8119-725c.ngrok-free.app/api/submit-website-usability', requestData)
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
          Swal.fire({ // <-- Reemplazamos this.snackBar.open con Swal.fire
            icon: 'error',
            title: '¡Error!',
            text: 'Error al enviar. Por favor intenta nuevamente.',
          });
        }
      });
  }

  resetForm() {
    this.selectedResponseQ1 = '';
    this.selectedResponseQ2 = '';
  }
}
