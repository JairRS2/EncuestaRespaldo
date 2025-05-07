import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router, private authService: AuthService) {}
  title?: string = 'Encuesta';
  menuOpen = true;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  navigateToAdmin() {
    this.router.navigate(['/admin/estadisticas']);
  }
}
