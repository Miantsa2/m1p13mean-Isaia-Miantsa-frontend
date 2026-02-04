import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth';


@Component({
  selector: 'app-sign',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './sign.html',
})

export class SignComponent {
  newClient = {
    email: '',
    password: '',
    nom: '',
    prenom: '',
    genre: '',
    dateNaissance: '',
    adresse: ''
  };

  constructor(private authService: AuthService,private router: Router) {}

  onSignup(form: NgForm) {
    this.authService.signup(this.newClient).subscribe({
      next: (res) => {
        this.authService.setToken(res.token);
        console.log('Inscription réussie', res.user);
        // this.router.navigate(['/dashboard']);
      },
       error: (err) => {
       form.controls['sign']?.setErrors({
        invalidCredentials: err.error?.message || 'Something went wrong during signup'
      });
    }
    });
  }

  onGoogleSignup() {
    this.authService.loginWithGoogle();
  }



  //  test() {
  //   this.authService.getHome();
  // }

  //  test2() {
  //   this.authService.getHome2();
  // }


}
