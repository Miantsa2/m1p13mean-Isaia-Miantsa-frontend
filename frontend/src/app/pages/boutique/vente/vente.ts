import { Component, OnInit, effect } from '@angular/core';
import { TableCorps, TableColumn } from '../../../components/table-corps/table-corps';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart-service';
import { Boutique } from '../../../services/boutique';
import { FormsModule } from '@angular/forms';
import { ModalForm } from '../../../components/modal-form/modal-form';

@Component({
  selector: 'app-vente',
  standalone: true,
  imports: [CommonModule, TableCorps, FormsModule, ModalForm],
  templateUrl: './vente.html',
})
export class Vente implements OnInit {
  salesData: any[] = [];
  filteredSales: any[] = [];

  selectedSale: any = null;
  deliveryDate: string = '';

  currentStatus: string = 'all';
  sortOrder: 'recent' | 'old' = 'recent';
  searchTerm: string = '';

  salesColumns: TableColumn[] = [
    { key: 'nom', label: 'Client' },
    { key: 'produit', label: 'Product' },
    { key: 'total', label: 'Subtotal' },
    { key: 'confirm_date', label: 'Order date' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
  ];

  constructor(
    private cartService: CartService, 
    public boutiqueService: Boutique
  ) {
    effect(() => {
      const boutique = this.boutiqueService.currentBoutique();
      if (boutique) {
        this.loadSales(boutique._id);
      }
    });
  }

  ngOnInit() {
    if (!this.boutiqueService.currentBoutique()) {
      this.boutiqueService.loadCurrentBoutique();
    }
  }

  loadSales(boutiqueId: string) {
    this.cartService.getSalesByBoutique(boutiqueId).subscribe({
      next: (data) => {
        this.salesData = data;
        this.applyFilters();
        console.log('Sales :', data);
      },
      error: (err) => console.error('Error loading sales', err)
    });
  }

  applyFilters() {
    let temp = [...this.salesData];

    if (this.currentStatus !== 'all') {
      temp = temp.filter(sale => sale.status === this.currentStatus);
    }

    if (this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      temp = temp.filter(sale => 
        sale.clientNom.toLowerCase().includes(term)
      );
    }

    temp.sort((a, b) => {
      const dateA = new Date(a.orderDate).getTime();
      const dateB = new Date(b.orderDate).getTime();
      return this.sortOrder === 'recent' ? dateB - dateA : dateA - dateB;
    });

    this.filteredSales = temp;
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'recent' ? 'old' : 'recent';
    this.applyFilters();
  }

  setStatusFilter(status: string) {
    this.currentStatus = status;
    this.applyFilters();
  }

  checkSale(sale: any) {
    this.cartService.checkProductInPanier(sale.panierId, sale.produitId).subscribe({
        next: () => {
            sale.status = 'checked';
            const index = this.salesData.findIndex(s => s.produitId === sale.produitId && s.panierId === sale.panierId);
            if (index !== -1) {
                this.salesData[index].status = 'checked';
            }
            this.applyFilters();
            console.log('Sale saved as checked in Database');
        },
        error: (err) => console.error('Error saving status', err)
    });
  }

  // Modal planning deliver
  isModalDeliverOpen = false;
  openModalDelivery(sale: any) {
    this.selectedSale = sale;
    this.isModalDeliverOpen = true;
  }
  confirmDelivery() {
    if (!this.deliveryDate) return alert("Please select a date and time");
    this.cartService.updateRecuperationDate(
      this.selectedSale.panierId,
      this.selectedSale.produitId,
      new Date(this.deliveryDate).toISOString()
    ).subscribe({
      next: () => {
        alert("Delivery planned!");
        this.closeModalDelivery();
        this.loadSales(this.boutiqueService.currentBoutique()._id);
      },
      error: (err) => console.error(err)
    });
  }
  closeModalDelivery() {
    this.isModalDeliverOpen = false;
  }
}