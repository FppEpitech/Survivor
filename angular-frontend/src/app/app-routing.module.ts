import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {  AccountManagementComponent } from './account-management/account-management.component';
import {  ClientProfileComponent } from './client-profile/client-profile.component';
import {  StatisticsComponent } from './statistics/statistics.component';

const routes: Routes = [
    { path: 'account-management', component: AccountManagementComponent },
    { path: 'client-profile', component: ClientProfileComponent },
    { path: 'statistics', component: StatisticsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
