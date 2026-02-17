import { Component, OnInit, effect } from '@angular/core';
import { BoutiqueStatService } from '../../../services/boutique-stat-service';
import { Boutique } from '../../../services/boutique';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../../services/filter-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  statsMensuelles: any[] = [];
  topProducts: any[] = [];
  clientStats: any[] = [];

  selectedMonthTop3: number = new Date().getMonth() + 1;
  nomsMois = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  totalVentesAnnee = 0;
  totalCAAnnee = 0;

  selectedMonthIndex: number = new Date().getMonth(); 
  selectedMonthData: any = null;

  constructor(private boutiqueStatService: BoutiqueStatService, public boutiqueService: Boutique, private filterService: FilterService) {
    effect(() => {
      const boutique = this.boutiqueService.currentBoutique();
      const year = this.filterService.selectedYear();
      if (boutique) {
        this.loadStats(boutique._id, year);
      }
    });
  }

  ngOnInit() {
    if (!this.boutiqueService.currentBoutique()) {
      this.boutiqueService.loadCurrentBoutique();
    }
  }

  loadStats(boutiqueId: string, year: number) {
    this.boutiqueStatService.getVentesAnnuelles(boutiqueId, year).subscribe({
      next: (data) => {
        this.statsMensuelles = data;
        this.calculateTotals();
        this.updateSelectedMonthData();
      },
      error: (err) => console.error('Erreur dashboard', err)
    });

    this.loadTop3(boutiqueId, year);

    this.boutiqueStatService.getStatsClients(boutiqueId, year).subscribe({
      next: (data) => {
        this.clientStats = data.slice(0, 4);
      }
    });
  }

  updateSelectedMonthData() {
    this.selectedMonthData = this.statsMensuelles.find(s => s.mois === (Number(this.selectedMonthIndex) + 1));
  }

  calculateTotals() {
    this.totalVentesAnnee = this.statsMensuelles.reduce((acc, curr) => acc + curr.nombreVentes, 0);
    this.totalCAAnnee = this.statsMensuelles.reduce((acc, curr) => acc + curr.montantTotal, 0);
  }

  loadTop3(boutiqueId: string, year: number) {
    this.boutiqueStatService.getTopProduits(boutiqueId, this.selectedMonthTop3, year).subscribe({
      next: (data) => this.topProducts = data
    });
  }

  onTop3MonthChange() {
    const boutique = this.boutiqueService.currentBoutique();
    const year = this.filterService.selectedYear(); 
    if (boutique) {
      this.loadTop3(boutique._id, year);
    }
  }
}