import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
}

@Component({
  selector: 'app-table-corps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-corps.html',
})
export class TableCorps {
  @Input() columns: TableColumn[] = [];
}