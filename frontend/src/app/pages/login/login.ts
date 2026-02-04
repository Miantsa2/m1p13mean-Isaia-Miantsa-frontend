import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.html',
})
export class Login {
  email = signal('');
  password = signal('');

  onLogin() {
    console.log('Login avec:', this.email(), this.password());
    // Ce que Miantsa va mettre ici comme logique
  }
}
