import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.html',
})
export class Settings {
  //visible ou non
  isModalOpen: boolean = false;

  openSettings() {
    this.isModalOpen = true;
  }

  closeSettings() {
    this.isModalOpen = false;
  }

  handleSave() {
    console.log("Données sauvegardées !");
    this.closeSettings();
  }
}