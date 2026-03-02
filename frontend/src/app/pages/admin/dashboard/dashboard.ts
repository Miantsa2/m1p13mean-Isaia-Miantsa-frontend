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
export class DashboardAdmin implements OnInit {

  selectedMonth: string = '';
  selectedYear: string = '';

  roomsPieChart: any = {
  labels: ['Occupied ', 'Free'],
  datasets: [
      {
        data: [0, 0]
      }
    ]
  };



  pieChartData: any = {
  labels: ['Rents', 'Sponsors'],
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
        label: 'Turnover',
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

  productsChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Top stores by products'
      }
    ]
  };

  productsChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    indexAxis: 'y', 
    plugins: {
      legend: { display: true }
    }
  };

  
  



  // Signals pour stocker nos données
  visitors : number = 0;
  stores : number = 0;
  chiffreAffaire : number = 0;
  
  loading :boolean= true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {

    this.loadStats();
    this.loadEvolution();
    this.loadRepartition();
    this.loadRooms();
    this.loadProducts();
  }



  applyFilters() {
    const year = this.selectedYear === 'all' || !this.selectedYear
      ? undefined
      : Number(this.selectedYear);

    const month = this.selectedMonth === 'all' || !this.selectedMonth
      ? undefined
      : Number(this.selectedMonth);

    this.loadStats(year, month);
    this.loadEvolution(year);
    this.loadRepartition(year,month);
    this.loadRooms(year, month);
    this.loadProducts(year, month);
  }

  loadRepartition(year?: number,month?: number) {
    this.dashboardService.getRepartition(year, month)
      .subscribe((res: any) => {
        this.pieChartData = {
          labels: ['Rents', 'Sponsors'],
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

    this.dashboardService.getChiffreAffaire(year, month).subscribe({
      next: (res) => {
        this.chiffreAffaire = Math.round(res.chiffre_affaire);
        this.loading = false;
      }
    });
  }

  loadEvolution(year?: number) {
    this.dashboardService.getEvolutionMensuelle(year)
      .subscribe((res: any) => {

        const labels = res.map((item: any) => item.month);
        const values = res.map((item: any) => item.total);

        this.lineChartData = {
          labels,
          datasets: [
            {
              data: values,
              label: "Turnover",
              fill: true,
              tension: 0.4
            }
          ]
        };
      });
  }

  loadRooms(year?: number, month?: number) {
    
      this.dashboardService.getRoomsRepartition(year, month).subscribe(res => {
        this.roomsPieChart = {
          labels: ['Occupied', 'Free'],
          datasets: [
            {
              data: [res.occupes, res.libres]
            }
          ]
        };
      });
  }

 loadProducts(year?: number, month?: number) {
  this.dashboardService.getPerformance(year, month).subscribe({
    next: (res) => {
      const labels = res.map((item: any) => item._id || 'Store');
      const values = res.map((item: any) => item.total);

      this.productsChartData = {
        labels,
        datasets: [
          {
            data: values,
            label: 'Top stores by products',
            backgroundColor: [
              '#4dc9f6', '#291102', '#f53794', '#537bc4', 
              '#acc236', '#166a8f', '#00a950', '#58595b', '#8549ba', '#ff6384'
            ],
            barThickness: 15,      
            maxBarThickness: 20,   
            minBarLength: 2     
          }
        ]
      };
    },
    error: () => console.error("Erreur performance produits")
  });
}


}