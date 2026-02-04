import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.html',
})

  // email = signal('');
  // password = signal('');

export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}
  onLogin(form: NgForm) {
  console.log('clic login');  

  this.authService.login(this.email, this.password).subscribe({
    next: (res) => {
      console.log('login OK', res);
      this.authService.setToken(res.token);

       if (res.user.role === 'admin') {
        this.router.navigate(['/layout-admin']);
      } 

       if (res.user.role === 'boutique') {
        this.router.navigate(['/layout-boutique']);
      } 
      else {
        this.router.navigate(['/login']);
      }
    },

     error: (err) => {
      form.controls['password']?.setErrors({
        invalidCredentials: err.error?.message || 'Email ou mot de passe incorrect'
      });
    }
  });
    }
  

  onGoogleLogin() {
    this.authService.loginWithGoogle();
  }

}
