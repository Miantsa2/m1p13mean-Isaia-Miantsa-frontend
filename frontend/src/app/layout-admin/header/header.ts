import { Component, EventEmitter, Output } from '@angular/core';
import { ModalForm } from '../../components/modal-form/modal-form';
import { CentreService } from '../../services/centre';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';




@Component({
  selector: 'app-header',
  imports: [ModalForm, FormsModule],
  standalone: true,
  templateUrl: './header.html',
})
export class Header {
  @Output() onToggle = new EventEmitter<void>();

  isModalOpen: boolean = false;

  constructor(
    private centreService: CentreService,
    private authService: AuthService, 
    private router: Router
  ) {}

  currentCenter: any = {
    horaires: [] 
  };

  week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  getFilteredDays(currentIndex: number): string[] {
  const daysUsedByOthers = this.currentCenter.horaires
    .filter((_: any, index: number) => index !== currentIndex) 
    .map((h: any) => h.jour);

  return this.week.filter(jour => !daysUsedByOthers.includes(jour));
  }

  loadCentre(): void {
    this.centreService.getCenter().subscribe({
      next: (res) => {
        this.currentCenter = res[0];
      }
    });
  }

  addHoraire() {
    this.currentCenter.horaires.push({ jour: '', ouverture: '', fermeture: '' });
  }


  removeHoraire(index: number) {
    this.currentCenter.horaires.splice(index, 1);
  }

  saveCenterInfo() {
    const { _id, ...payload } = this.currentCenter; //on enleve le _id dans playload

    this.centreService.updateCenter(_id, payload).subscribe({
      next: (res) => {
        this.closeSettings();
        this.loadCentre();
      },
      error: (err) => alert(err.error.message)
    });
  }
    

  isFormInvalid(): boolean {
    if (!this.currentCenter.nom || !this.currentCenter.email || !this.currentCenter.telephone) {
      return true; 
    }
    if (this.currentCenter.horaires.length === 0) {
      return true; 
    }
    return this.currentCenter.horaires.some((h: any) => 
      !h.jour || !h.ouverture || !h.fermeture || (h.ouverture >= h.fermeture)
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openSettings() {
    this.loadCentre();
    this.isModalOpen = true;
  }

  closeSettings() {
    this.isModalOpen = false;
  }

  emitToggle() {
    this.onToggle.emit();
  }
}
