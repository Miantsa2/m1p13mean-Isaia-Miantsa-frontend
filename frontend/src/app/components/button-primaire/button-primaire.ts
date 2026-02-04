import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-primaire',
  standalone: true,
  imports: [],
  templateUrl: './button-primaire.html',
})
export class ButtonPrimaire {
  @Input() text: string = 'Bouton';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
}
