import { Component, EventEmitter, Output } from '@angular/core';
import { ModalForm } from '../../components/modal-form/modal-form';

@Component({
  selector: 'app-header',
  imports: [ModalForm],
  standalone: true,
  templateUrl: './header.html',
})
export class Header {
  @Output() onToggle = new EventEmitter<void>();

  isModalOpen: boolean = false;

  openSettings() {
    this.isModalOpen = true;
  }

  closeSettings() {
    this.isModalOpen = false;
  }

  emitToggle() {
    this.onToggle.emit();
  }
}
