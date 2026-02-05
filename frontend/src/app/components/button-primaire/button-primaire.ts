import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-button-primaire',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './button-primaire.html',
})
export class ButtonPrimaire {
  @Input() text: string = 'Bouton';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() route?: string | any[];
}
