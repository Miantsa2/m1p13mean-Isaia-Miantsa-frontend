import { Component, EventEmitter, Output, inject,computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalForm } from '../../components/modal-form/modal-form';
import { Boutique } from '../../services/boutique';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth';
import { FilterService } from '../../services/filter-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ModalForm, FormsModule, CommonModule, MatBadgeModule, MatMenuModule, MatButtonModule],
  templateUrl: './header.html',
})
export class Header {
  @Output() onToggle = new EventEmitter<void>();

  availableDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  constructor(
    private authService: AuthService, 
    private router: Router,
    private filtreService: FilterService
  ) {}
  
  boutiqueService = inject(Boutique);
  notifications: any[] = [];

  selectedLogoFile: File | null = null;
  logoPreview: string | null = null;

  // Modal section
  isModalOpen = false;
  storeData: any = {};

  unreadNotifications = computed(() => {
    const boutique = this.boutiqueService.currentBoutique();
    if (!boutique || !boutique.notifications) return [];
        return boutique.notifications.filter((notif: any) => !notif.est_lue);
  });

  unreadCount = computed(() => this.unreadNotifications().length);

  onYearChange(event: any) {
    this.filtreService.setYear(Number(event.target.value));
  }

  clearAll() {
    const boutique = this.boutiqueService.currentBoutique();
    if (!boutique || !boutique._id) return;

    this.boutiqueService.markAllNotificationsAsRead(boutique._id).subscribe({
      next: () => {
        const updatedBoutique = { ...boutique, notifications: [] };
        this.boutiqueService.currentBoutique.set(updatedBoutique);  
        console.log("Notifications vidées localement");
      },
      error: (err) => console.error("Erreur lors du nettoyage :", err)
    });
  }


  openSettings() {
    const boutique = this.boutiqueService.currentBoutique();
    if (boutique) {
      this.storeData = {
        name: boutique.nom,
        email: boutique.user?.email,
        phone: boutique.telephone,
        room: boutique.salle?.reference || 'N/A',
        category: boutique.categorie?.nom || 'N/A',
        horaires: boutique.horaires && boutique.horaires.length > 0 
                   ? [...boutique.horaires] 
                   : [{ jour: '', ouverture: '', fermeture: '' }],
        logo: boutique.logo,
        createdAt: boutique.createdAt
      }
    }
    this.isModalOpen = true;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  closeSettings() {
    this.isModalOpen = false;
  }

  // Pour voir si un champ a été modifié
  isDirty(field: string): boolean {
    const original = this.boutiqueService.currentBoutique();
    if(!original) return false;

    switch (field) {
      case 'name': return this.storeData.name !== original.nom;
      case 'phone': return this.storeData.phone !== original.telephone;
      case 'category': return this.storeData.category !== original.categorie?.nom;
      case 'email': return this.storeData.email !== original.user?.email;
      default: return false;
    }
  }

  // pour les horaires qui ne marche pas encore
  isHorairesDirty(): boolean {
    const original = this.boutiqueService.currentBoutique()?.horaires || [];
    return JSON.stringify(this.storeData.horaires) !== JSON.stringify(original);
  }

  canAddHoraire(): boolean {
    return this.storeData.horaires.length < 7;
  }

  addHoraire() {
    if (this.canAddHoraire()) {
      this.storeData.horaires.push({
        jour: '', 
        ouverture: '09:00',
        fermeture: '19:00'
      });
    }
  }

  isDaySelected(day: string, currentIndex: number): boolean {
    return this.storeData.horaires.some((h: any, index: number) => h.jour === day && index !== currentIndex);
  }

  removeHoraire(index: number) {
    if (this.storeData.horaires.length > 1) {
      this.storeData.horaires.splice(index, 1);
    } else {
      this.storeData.horaires[0] = { jour: '', ouverture: '', fermeture: '' };
    }
  }

  onLogoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedLogoFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // save the changes
  saveChanges() {
    const id = this.boutiqueService.currentBoutique()?._id;
    if(!id) return;

    const formData = new FormData();
    formData.append('nom', this.storeData.name);
    formData.append('telephone', this.storeData.phone);
    
    formData.append('horaires', JSON.stringify(this.storeData.horaires));

    if (this.selectedLogoFile) {
      formData.append('logo', this.selectedLogoFile);
    }

    this.boutiqueService.updateBoutique(id, formData).subscribe({
      next: (res) => {
        this.boutiqueService.loadCurrentBoutique();
        this.closeSettings();
        this.selectedLogoFile = null;
        this.logoPreview = null;
      },
      error: (err) => console.error(err)
    });
  }

  emitToggle() {
    this.onToggle.emit();
  }
}
