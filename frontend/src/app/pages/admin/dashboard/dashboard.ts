import { Component, OnInit, signal } from '@angular/core';
import { DashboardService } from '../../../services/dashboard-admin';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { FormsModule } from '@angular/forms'; 




@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BaseChartDirective, FormsModule],
  templateUrl: './dashboard.html',
 
})
export class Dashboard implements OnInit {

  selectedMonth: string = '';
  selectedYear: string = '';


  pieChartData: any = {
  labels: ['Loyers', 'Sponsors'],
  datasets: [
    {
      data: [0, 0]
    }
  ]
};


  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Chiffre d\'affaire',
        fill: true,
        tension: 0.4
      }
    ]
  };

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true }
    }
  };



  // Signals pour stocker nos données
  visitors : number = 0;
  stores : number = 0;
  totalProducts : number = 0;
  chiffreAffaire : number = 0;
  roomsLibres : number = 0;
  
  loading :boolean= true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {

    this.loadStats();
    this.loadEvolution();
    this.loadRepartition();
  }

  applyFilters() {
    const year = this.selectedYear === 'all' || !this.selectedYear
      ? undefined
      : Number(this.selectedYear);

    const month = this.selectedMonth === 'all' || !this.selectedMonth
      ? undefined
      : Number(this.selectedMonth);

    this.loadStats(year, month);
    this.loadEvolution(year, month);
    this.loadRepartition(year);
  }

  loadRepartition(year?: number) {
    this.dashboardService.getRepartition(year)
      .subscribe((res: any) => {
        this.pieChartData = {
          labels: ['Loyers', 'Sponsors'],
          datasets: [
            {
              data: [res.loyers, res.sponsors]
            }
          ]
        };
      });
  }



  loadStats(year?: number, month?: number) {
    this.loading = true;

    this.dashboardService.getVisitors(year, month).subscribe({
      next: (res) => {
        this.visitors = res.nombre_visite;
      }
    });

    this.dashboardService.getStores(year, month)
      .subscribe(res => this.stores = res.total_boutiques);

    this.dashboardService.getProducts(year, month)
      .subscribe(res => this.totalProducts = res.total_produits);

    this.dashboardService.getRoomsLibres()
      .subscribe(res => this.roomsLibres = res.salles_libres);

    this.dashboardService.getChiffreAffaire(year, month).subscribe({
      next: (res) => {
        this.chiffreAffaire = res.chiffre_affaire;
        this.loading = false;
      }
    });
  }

  loadEvolution(year?: number, month?: number) {
    this.dashboardService.getEvolutionMensuelle(year, month)
      .subscribe((res: any) => {

        const labels = res.map((item: any) => item.month);
        const values = res.map((item: any) => item.total);

        this.lineChartData = {
          labels,
          datasets: [
            {
              data: values,
              label: "Chiffre d'affaire",
              fill: true,
              tension: 0.4
            }
          ]
        };
      });
  }


}