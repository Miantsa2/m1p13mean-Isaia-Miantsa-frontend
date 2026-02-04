import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { MainLayout } from './layout_boutique/main-layout/main-layout';
import { Login } from './pages/login/login';
import { Sign } from './pages/sign/sign';
import { MainLayoutAdmin } from './layout-admin/main-layout/main-layout';

export const routes: Routes = 
[
  { path: '', component: Home },
  {
    path: 'layout-boutique', 
    component: MainLayout, 
    children: [{path: '', component: Home}]
  },
  {
    path: 'layout-admin', 
    component: MainLayoutAdmin,
    children: [{path: '', component: Home}]
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'sign',
    component: Sign
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}