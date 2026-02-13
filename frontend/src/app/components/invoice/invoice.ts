import { Component, Input, Output, EventEmitter, SimpleChanges  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonPrimaire } from '../button-primaire/button-primaire';
import { ToWords } from "to-words";


export interface InvoiceColumn {
  key: string;
  label: string;
}

export interface InvoiceSummaryItem {
  label: string;
  value: number;
  bold?: boolean; }

export interface clientData {
  name: string;
  email: string;
  }


@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule,ButtonPrimaire],
  templateUrl: './invoice.html'
})

export class InvoiceCorps {
  @Input() buttonText: string = 'MAKE PAYMENT';
  @Input() disable: boolean = false;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Input() columns: InvoiceColumn[] = [];
  @Input() amount: number = 0;
  @Input() client: any;
  @Output() submitForm = new EventEmitter<void>();
  @Input() summary: InvoiceSummaryItem[] = [];


  creationDate: string = new Date().toISOString().split('T')[0];
  private toWords = new ToWords({
    localeCode: 'fr-FR'
  });

  convertAmountToWords(amount: number): string {
    return this.toWords.convert(amount);
  }

  confirm() {
    this.submitForm.emit();
  }

 
  closeModal() {
    this.close.emit();
  }
}



