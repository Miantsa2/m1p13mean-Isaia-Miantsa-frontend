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
import { StoreDetail } from './pages/client/store-detail/store-detail';
import {Delivery} from './pages/client/delivery/delivery';
import { PanierDetail } from './pages/client/panier-detail/panier-detail';
import { InvoiceCart } from './pages/client/invoice-cart/invoice-cart';
import { InvoiceSponsor } from './pages/boutique/invoice-sponsor/invoice-sponsor';
import { Vente } from './pages/boutique/vente/vente';
import { Livraison } from './pages/client/livraison/livraison';
import { Dashboard } from './pages/boutique/dashboard/dashboard';

export const routes: Routes = 
[
  { path: '', component: LoginComponent },
 
  {path: 'home', component: Home},
  { path: 'auth/callback', component: AuthCallbackComponent },
  { path: 'delivery', component: Delivery },
  { path: 'invoiceCart', component: InvoiceCart },


  {
    path: 'layout-boutique', 
    component: MainLayout, 
    children: [
      {
        path: '', 
        redirectTo: 'dashboard', 
        pathMatch: 'full' 
      },
      {
        path: 'dashboard',
        component: Dashboard
      },
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
      },
      {
        path: 'invoice-sponsor',
        component: InvoiceSponsor 
      },   
      {
        path: 'sales',
        component: Vente
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
  {
    path: 'store/:id',
    component: StoreDetail
  },
  {
    path: 'cart',
    component: PanierDetail
  },
  {
    path: 'livraison',
    component: Livraison
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}