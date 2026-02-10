import { Component, OnInit, inject, effect, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCorps, TableColumn } from '../../../components/table-corps/table-corps';
import { StockService } from '../../../services/stock';
import { Boutique } from '../../../services/boutique';
import { Produit } from '../../../services/produit';
import { FormsModule } from '@angular/forms';
import { ModalForm } from '../../../components/modal-form/modal-form';

export interface StockItem {
  _id: string;
  nom: string;
  aboutStock: 'Storable' | 'Not storable';
  quantity: number | string;
  in: number | string;
  out: number | string;
  status: string;
  categorie?: {
    _id: string;
    nom: string;
  };
}

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, TableCorps, FormsModule, ModalForm],
  templateUrl: './stock.html',
})
export class Stock {
  private stockService = inject(StockService);
  private boutiqueService = inject(Boutique);
  private produitService = inject(Produit);

  stockData = signal<StockItem[]>([]);
  categories = signal<any[]>([]);
  loading = signal(true);

  searchTerm = signal('');
  selectedStatus = signal<string>('all');
  selectedCategory = signal<string>('all');

  stockColumns: TableColumn[] = [
    {key: 'nom', label: 'Name'},
    {key: 'stock', label:'About stock'},
    {key: 'quantity', label:'Quantity'},
    {key: 'in', label:'In'},
    {key: 'out', label:'Out'},
    {key: 'status', label:'Status'},
    {key: 'actions', label: 'Actions' }
  ];

  constructor() {
    effect(() => {
      const boutique = this.boutiqueService.currentBoutique();
      if (boutique && boutique._id) {
        this.loadData(boutique._id);
      }
    });
  }

  loadData(boutiqueId: string) {
    this.loading.set(true);
    
    this.stockService.getInventory(boutiqueId).subscribe({
      next: (data) => {
        this.stockData.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading inventory', err);
        this.loading.set(false);
      }
    });

    this.produitService.getCategoriesByBoutique(boutiqueId).subscribe({
      next: (cats) => this.categories.set(cats),
      error: (err) => console.error('Error categories', err)
    });
  }

  filteredStock = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const categoryId = this.selectedCategory();
    const statusFilter = this.selectedStatus();
    
    return this.stockData().filter(item => {
      const matchesSearch = item.nom.toLowerCase().includes(search);
      
      const matchesCategory = categoryId === 'all' || 
                              item.categorie?._id === categoryId;
                              
      const matchesStatus = statusFilter === 'all' || 
                            item.status === statusFilter;
                              
      return matchesSearch && matchesCategory && matchesStatus;
    });
  });

  toggleProductStatus(item: StockItem) {
    this.produitService.toggleAvailability(item._id).subscribe({
      next: () => {
        // On recharge les données pour mettre à jour le tableau
        const boutique = this.boutiqueService.currentBoutique();
        if (boutique?._id) this.loadData(boutique._id);
      },
      error: (err) => console.error('Erreur status update', err)
    });
  }

  // Modal ajouter stock
  isModalStockOpen = false;
  selectedStockItem: StockItem | null = null;
  quantityToAdd: number = 0;

  openModalStock(item: StockItem) {
    this.selectedStockItem = item;
    this.quantityToAdd = 0;
    this.isModalStockOpen = true;
  }

  closeModalStock() {
    this.isModalStockOpen = false;
    this.selectedStockItem = null;
  }

  movementType = signal<number>(1); // Par défaut 1 (Entrée)

  confirmAddStock() {
    const item = this.selectedStockItem;
    if (!item || this.quantityToAdd <= 0) return;

    this.stockService.addMovement(item._id, this.quantityToAdd, this.movementType()).subscribe({
        next: () => {
            this.closeModalStock();
            const boutique = this.boutiqueService.currentBoutique();
            if (boutique?._id) this.loadData(boutique._id);
        },
        error: (err) => console.error(err)
    });
  }
}