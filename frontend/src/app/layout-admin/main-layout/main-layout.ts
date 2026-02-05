import { Component } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, Sidebar, Header],
  templateUrl: './main-layout.html',
})
export class MainLayoutAdmin {
  isSidebarVisible = true;
  toogleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}