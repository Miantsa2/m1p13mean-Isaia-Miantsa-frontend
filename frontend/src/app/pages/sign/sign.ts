import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './sign.html',
})
export class Sign {

}
