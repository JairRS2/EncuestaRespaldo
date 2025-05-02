import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | Promise<boolean> {
    if (this.authService.isAuthenticatedUser()) {
      return true;
    } else {
      return Swal.fire({
        title: 'Autenticación de Administrador',
        text: 'Ingrese la contraseña de administrador:',
        input: 'password',
        showCancelButton: true,
        confirmButtonText: 'Ingresar',
        cancelButtonText: 'Cancelar',
        inputAttributes: {
          autocapitalize: 'off'
        },
        preConfirm: (password) => {
          if (this.authService.login(password)) {
            return true;
          } else {
            Swal.showValidationMessage('Contraseña incorrecta');
            return false;
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          return true;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      });
    }
  }
}
