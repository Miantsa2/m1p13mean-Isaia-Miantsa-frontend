import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonPrimaire } from '../../components/button-primaire/button-primaire';

export type HeaderType = 'header1' | 'header2' | 'header3';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonPrimaire],
  templateUrl: './header.html',
})
export class Header {
  @Input() headerType: HeaderType = 'header1';
}