import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteStat } from './services/site-stat';





@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
  nombre_visite=0

  constructor(private siteStatService: SiteStat) {}

  ngOnInit() {
    const dejaCompte = localStorage.getItem('visite');
    if (!dejaCompte) {
      localStorage.setItem('visite', '1');
      this.siteStatService.incrementVisit().subscribe(res => {
        this.nombre_visite = res.nombre_visite;
        console.log(this.nombre_visite);
      });
    } 
  }
}
