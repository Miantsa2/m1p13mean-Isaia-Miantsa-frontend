import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type FooterType = 'footer1' | 'footer2';

export interface FooterData {
  title: string;
  phone: string;
  email: string;
  logoUrl?: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
})
export class Footer {
  @Input() footerType: FooterType = 'footer1';
  @Input() footerData!: FooterData;
}