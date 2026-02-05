import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { MainLayout } from './layout_boutique/main-layout/main-layout';
import { LoginComponent } from './pages/login/login';
import { SignComponent } from './pages/sign/sign';
import { MainLayoutAdmin } from './layout-admin/main-layout/main-layout';
import { AuthCallbackComponent } from './pages/auth-callback/auth-callback';
import { Rooms } from './pages/admin/rooms/rooms';
import { Stores } from './pages/admin/stores/stores';
export const routes: Routes = 
[
  { path: '', component: LoginComponent },
 

   { path: 'auth/callback', component: AuthCallbackComponent },
  {
    path: 'layout-boutique', 
    component: MainLayout, 
    children: [{path: '', component: Home}]
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
        path: 'stores',
        component: Stores
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