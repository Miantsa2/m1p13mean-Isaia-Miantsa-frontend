import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  standalone: true,
  templateUrl: './header.html',
})
export class Header {
  @Output() onToggle = new EventEmitter<void>();

  emitToggle() {
    this.onToggle.emit();
  }
}
