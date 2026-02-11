import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { MainLayout } from './layout_boutique/main-layout/main-layout';
import { LoginComponent } from './pages/login/login';
import { SignComponent } from './pages/sign/sign';
import { MainLayoutAdmin } from './layout-admin/main-layout/main-layout';
import { AuthCallbackComponent } from './pages/auth-callback/auth-callback';
import { Rooms } from './pages/admin/rooms/rooms';
import { Stores } from './pages/admin/stores/stores';
import {EventStore} from './pages/admin/event-store/event-store';
import {Events} from './pages/admin/event/event';
import { Products } from './pages/boutique/products/products';
import { StoresProduct } from './pages/admin/stores-product/stores-product';
import { Stock } from './pages/boutique/stock/stock';
import {StoresEvent} from './pages/boutique/event/event';
import { Charge } from './pages/boutique/charge/charge';
import { Rent } from './pages/boutique/rent/rent';
import { RentAdmin } from './pages/admin/rent/rent';


export const routes: Routes = 
[
  { path: '', component: LoginComponent },
 
  {path: 'home', component: Home},
  { path: 'auth/callback', component: AuthCallbackComponent },
  {
    path: 'layout-boutique', 
    component: MainLayout, 
    children: [
      {
        path: 'products',
        component: Products 
      },
      {
        path: 'stock',
        component: Stock
      },

       {
        path: 'event',
        component: StoresEvent 
      },
       {
        path: 'charges',
        component: Charge 
      },

       {
        path: 'rent',
        component: Rent 
      }

      
    ]
  },
  {
    path: 'layout-admin', 
    component: MainLayoutAdmin,
    children: [
      {
        path: 'rooms', 
        component: Rooms 
      },
      {
        path: 'stores/stores-products/:id',
        component: StoresProduct 
      },
      {
        path: 'stores',
        component: Stores
      },
      {
        path: 'event',
        component: EventStore
      },

        {
        path: 'eventCenter',
        component: Events
      },
        {
        path: 'rent',
        component: RentAdmin 
      }
      
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'sign',
    component: SignComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}