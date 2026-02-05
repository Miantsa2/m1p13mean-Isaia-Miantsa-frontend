import { Component, Input, Output, EventEmitter } from '@angular/core';
import {CommonModule} from "@angular/common";
import { ButtonPrimaire } from '../button-primaire/button-primaire';
@Component({
  selector: 'app-modal-form',
  standalone: true,
  imports: [CommonModule, ButtonPrimaire],
  templateUrl: './modal-form.html',
})
export class ModalForm {
  @Input() buttonText: string = 'SAVE CHANGES';
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<void>();
  
  closeModal() {
    this.close.emit();

  }
  confirm() {
    this.close.emit();
    this.submitForm.emit();
  }
}
