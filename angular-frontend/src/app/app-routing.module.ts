import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {  ClientProfileComponent } from './client-profile/client-profile.component';
import { StatisticsPageComponent } from './statistics-page/statistics-page.component';
// import {  AccountManagementComponent } from './account-management/account-management.component';

const routes: Routes = [
    { path: 'client-profile', component: ClientProfileComponent },
    // { path: 'account-management', component: AccountManagementComponent },
    { path: 'statistics', component: StatisticsPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
