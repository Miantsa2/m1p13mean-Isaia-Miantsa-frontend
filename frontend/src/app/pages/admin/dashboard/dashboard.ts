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
    this.loadStats();
    this.loadEvolution();
    this.loadRepartition();
  }

  loadRepartition() {
    this.dashboardService.getRepartition(this.selectedYear).subscribe((res: any) => {
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


  loadStats() {
    this.loading= true;
    
    this.dashboardService.getVisitors(this.selectedYear, this.selectedMonth).subscribe({
      next: (res) => {
        this.visitors = res.nombre_visite,
        console.log(this.visitors)
      }, // Ajustez .count selon la réponse de votre API
      error: (err) => console.error(err)
    });

    this.dashboardService.getStores(this.selectedYear, this.selectedMonth).subscribe(res => this.stores= res.total_boutiques);
    this.dashboardService.getProducts(this.selectedYear, this.selectedMonth).subscribe(res => this.totalProducts= res.total_produits);
    this.dashboardService.getRoomsLibres().subscribe(res => this.roomsLibres= res.salles_libres);
    
    this.dashboardService.getChiffreAffaire(this.selectedYear, this.selectedMonth).subscribe({
      next: (res) => {
        this.chiffreAffaire= res.chiffre_affaire;
        this.loading= false;
      }
    });
  }

  loadEvolution() {
  this.dashboardService.getEvolutionMensuelle().subscribe((res: any) => {
    const labels = res.map((item: any) => item.month);
    const values = res.map((item: any) => item.total);

    this.lineChartData = {
      labels,
      datasets: [
        {
          data: values,
          label: 'Chiffre d\'affaire',
          fill: true,
          tension: 0.4
        }
      ]
    };
  });
}

}