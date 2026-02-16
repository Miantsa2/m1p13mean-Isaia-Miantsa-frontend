import { Component, OnInit } from '@angular/core';
import { TableCorps, TableColumn } from '../../../components/table-corps/table-corps';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vente',
  standalone: true,
  imports: [CommonModule, TableCorps],
  templateUrl: './vente.html',
})
export class Vente {
  salesData: any[] = [
    { _id: '1', clientNom: 'Mirado', totalOrder: 10000, orderDate: new Date('2026-01-31'), status: 'Confirmed' },
    { _id: '2', clientNom: 'Miantsa', totalOrder: 13000, orderDate: new Date('2026-02-01'), status: 'To deliver' },
    { _id: '3', clientNom: 'Isaia', totalOrder: 12000, orderDate: new Date('2026-02-15'), status: 'To deliver' }
  ];

  salesColumns: TableColumn[] = [
    {key: 'nom', label: 'Client'},
    {key: 'total', label:'Total order'},
    {key: 'confirm_date', label:'Order date'},
    {key: 'status', label:'Status'},
    {key: 'actions', label: 'Actions' }
  ];
}