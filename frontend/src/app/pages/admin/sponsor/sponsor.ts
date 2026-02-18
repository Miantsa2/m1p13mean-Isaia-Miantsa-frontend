import { Component, OnInit } from '@angular/core';
import { Produit } from '../../../services/produit';
import { TableCorps,TableColumn } from '../../../components/table-corps/table-corps';
import { Boutique } from '../../../services/boutique';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sponsor',
  imports: [FormsModule,TableCorps],
  templateUrl: './sponsor.html',
  standalone: true,
})
export class Sponsor implements OnInit{
  constructor(private produitService: Produit,private boutiqueService: Boutique) {}
  adsList: any[] = [];

  adsColumns: TableColumn[] = [
      { key: 'produit', label: 'Products' },
      { key: 'boutique', label: 'Stores' },
      { key: 'dateDebut', label: 'Start Date' },
      { key: 'dateFin', label: 'End Date' },
  
    ];

  filteredAdsList: any[] = [];

  stores: any[] = [];
  selectedStore: string = '';

  loadStores(): void {
    this.boutiqueService.getBoutiques().subscribe({
      next: data => this.stores = data,
      error: err => console.error(err)
    });
  }


  loadSponsorisedProduits() {
    this.produitService.getSponsorisedProduits().subscribe({
      next: (data) => {
        this.adsList = data.map((p: any) => ({
          id: p._id,
          produit: p.nom,
          boutique: p.boutique?.nom,
          dateDebut: new Date(p.sponsor.dateDebut).toLocaleString(),
          dateFin: new Date(p.sponsor.dateFin).toLocaleString(),
        }));

         this.filteredAdsList = [...this.adsList];


      },
      error: (err) => console.error('Erreur sponsor:', err)
    });
  }

  filterByStore() {
    if (!this.selectedStore) {
      this.filteredAdsList = [...this.adsList];
      return;
    }

    this.filteredAdsList = this.adsList.filter(
      ad => ad.boutique === this.selectedStore
    );
  }




   ngOnInit() {
    this.loadSponsorisedProduits();
    this.loadStores();


  }

}
