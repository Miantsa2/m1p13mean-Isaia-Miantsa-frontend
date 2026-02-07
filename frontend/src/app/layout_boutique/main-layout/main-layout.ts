import { Component, OnInit } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Boutique } from '../../services/boutique';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, Sidebar, Header],
  templateUrl: './main-layout.html',
})
export class MainLayout implements OnInit {
  isSidebarVisible = true;

  constructor(private boutiqueService : Boutique) {}

  ngOnInit() {
      this.boutiqueService.loadCurrentBoutique();
  }
  
  toogleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}