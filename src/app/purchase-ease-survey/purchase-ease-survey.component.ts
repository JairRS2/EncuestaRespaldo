import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

interface SurveyOption {
  value: string;
  label: string;
  icon: string; // Cambiamos 'emoji' a 'icon'
  colorValue: number;
}

interface PlatformOption {
  value: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-purchase-ease-survey',
  templateUrl: './purchase-ease-survey.component.html',
  styleUrls: ['./purchase-ease-survey.component.css']
})
export class PurchaseEaseSurveyComponent {
  question = '¿Qué tan fácil fue comprar tus boletos en nuestra plataforma?';
  platformQuestion = '¿En qué plataforma realizaste la compra?';

  easeOptions: SurveyOption[] = [
    { value: 'muy-dificil', label: 'Muy difícil', icon: '/assets/Muy_Molesto.png', colorValue: 1 },
    { value: 'dificil', label: 'Difícil', icon: '/assets/Molesto.png', colorValue: 2 },
    { value: 'neutral', label: 'Regular', icon: '/assets/Neutral.png', colorValue: 3 },
    { value: 'facil', label: 'Fácil', icon: '/assets/Feliz.png', colorValue: 4 },
    { value: 'muy-facil', label: 'Muy fácil', icon: '/assets/Muy_Feliz.png', colorValue: 5 }
  ];

  platformOptions: PlatformOption[] = [
    { value: 'web', label: 'Sitio web', icon: '/assets/lap.png' },
    { value: 'movil', label: 'Aplicación móvil', icon: '/assets/aplicaciones.png' },
    { value: 'ambas', label: 'Ambas', icon: '/assets/ambos.png' }
  ];

  selectedEase: string = '';
  selectedPlatform: string = '';
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  // Función para obtener el valor de color basado en la opción
  getOptionColor(value: string): string {
    const option = this.easeOptions.find(opt => opt.value === value);
    return option ? option.colorValue.toString() : '0';
  }

  onEaseChange(value: string) {
    this.selectedEase = value;
    this.attemptSubmit();
  }
//cambios
  onPlatformChange(value: string) {
    this.selectedPlatform = value;
    this.attemptSubmit();
  }

  attemptSubmit() {
    if (this.selectedEase && this.selectedPlatform) {
      this.submitResponse();
    }
  }
//metodo para enviar la respuesta del cliente
  submitResponse() {
    const requestData = {
      ease: this.selectedEase,
      platform: this.selectedPlatform,
      timestamp: new Date().toISOString()
    };

    this.http.post('https://cd68-2806-10a6-6-5d2-7d80-bdf4-8119-725c.ngrok-free.app/api/submit-purchase-ease', requestData)
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
        },
        error: (error) => {
          console.error('Error:', error);
          this.errorMessage = 'Error al enviar. Por favor intenta nuevamente.';
          this.snackBar.open('Error al enviar la respuesta', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }
//metodo para reiniciar el formulario e inicializar los valores
  resetForm() {
    this.selectedEase = '';
    this.selectedPlatform = '';
    this.errorMessage = '';
  }
}
