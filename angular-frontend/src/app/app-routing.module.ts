import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import {  ClientProfileComponent } from './pages/client-profile/client-profile.component';
import { LoggedGuard } from './guards/logged.guard';
import { WardrobeComponent } from './pages/wardrobe/wardrobe.component';
import { StatisticsPageComponent } from './pages/statistics/statistics-page.component';
// import {  AccountManagementComponent } from './account-management/account-management.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'client-profile', component: ClientProfileComponent, canActivate: [LoggedGuard] },
    // { path: 'account-management', component: AccountManagementComponent },
    { path: 'statistics', component: StatisticsPageComponent },
    { path: 'wardrobe', component: WardrobeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
