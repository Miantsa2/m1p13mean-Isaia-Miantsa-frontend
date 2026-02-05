
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-auth-callback',
  imports: [],
  templateUrl: './auth-callback.html',
  styleUrl: './auth-callback.css',
})
export class AuthCallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    const role = this.route.snapshot.queryParamMap.get('role');

    if (token && role) {
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      console.log('Token and role stored:', token, role);

      switch (role) {
        case 'admin':
          this.router.navigate(['/layout-admin']);
          break;

        case 'boutique':
          this.router.navigate(['/layout-boutique']);
          break;
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}
