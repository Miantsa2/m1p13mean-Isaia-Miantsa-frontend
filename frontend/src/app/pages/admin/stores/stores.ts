import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonPrimaire } from '../../../components/button-primaire/button-primaire';
import { StoreCardAdmin } from '../../../components/store-card-admin/store-card-admin';
import { ModalForm } from '../../../components/modal-form/modal-form';

@Component({
  selector: 'app-stores',
    standalone: true,
    imports: [ButtonPrimaire, CommonModule, StoreCardAdmin, ModalForm],
  templateUrl: './stores.html',
})
export class Stores {
  stores = [
    { logo: '/pasta.png', salle_ref: 'Room 001' , metre_carre: '50'},
    { logo: '/pasta.png', salle_ref: 'Room 015' , metre_carre: '50'},
    { logo: '/abc.png', salle_ref: 'Room 050' , metre_carre: '50'},
    { logo: '/abc.png', salle_ref: 'Room 005' , metre_carre: '50'},
  ]

  // Modal ajout
  isModalAddOpen = false;
  openAddModal() {this.isModalAddOpen = true};
  closeAddModal() {this.isModalAddOpen = false};
}