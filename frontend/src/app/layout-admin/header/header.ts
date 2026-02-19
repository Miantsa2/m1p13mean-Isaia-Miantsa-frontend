import { Component, EventEmitter, Output, signal , computed} from '@angular/core';
import { ModalForm } from '../../components/modal-form/modal-form';
import { CentreService } from '../../services/centre';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';


interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

@Component({
  selector: 'app-header',
  imports: [CommonModule, ModalForm, FormsModule, MatBadgeModule, MatMenuModule, MatButtonModule],
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



   ngOnInit(): void {
    this.loadCentre();

  }




  // Simulation notification (je pense ici faut juste adopter aux schéma du boutique)
  // notifications = signal<Notification[]>([
  //   { id: 1, title: 'Event request', message: 'Your rent has been paid for the month of January.', time: '1j', isRead: false },
  //   { id: 2, title: 'Something', message: 'Your sponsorship request has been rejected', time: '1h', isRead: false }
  // ]);

  // clearAll() {
  //   this.notifications.set([]);
  // }

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
        console.log("Centre chargé :", this.currentCenter);
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


  
  clearAll() {
    if (!this.currentCenter || !this.currentCenter._id) return;

    this.centreService.markAllNotificationsAsRead(this.currentCenter._id).subscribe({
      next: () => {
        const updatedcentre = { ...this.currentCenter, notifications: [] };
        this.loadCentre()
        console.log("Notifications vidées localement",updatedcentre);
      },
      error: (err) => console.error("Erreur lors du nettoyage :", err)
    });
  }


  get unreadNotifications() {
    return this.currentCenter?.notifications?.filter(
      (notif: any) => notif.est_lue === false
    ) || [];
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
