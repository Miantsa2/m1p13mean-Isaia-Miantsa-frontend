import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  selectedYear = signal<number>(2026);

  setYear(year: number) {
    this.selectedYear.set(year);
  } 
}