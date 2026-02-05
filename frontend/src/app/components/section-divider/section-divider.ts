import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-divider',
  standalone: true,
  imports: [],
  templateUrl: './section-divider.html',
})
export class SectionDivider {
  @Input() title: string = 'SECTION TITLE';
}