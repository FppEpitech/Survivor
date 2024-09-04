import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import {  ClientProfileComponent } from './pages/client-profile/client-profile.component';
import { LoggedGuard } from './guards/logged.guard';
import { WardrobeComponent } from './pages/wardrobe/wardrobe.component';
import { StatisticsPageComponent } from './pages/statistics/statistics.component';
import { TipsComponent } from './pages/tips/tips.component';
// import {  AccountManagementComponent } from './account-management/account-management.component';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [LoggedGuard]},
    { path: 'login', component: LoginComponent},
    { path: 'client-profile', component: ClientProfileComponent, canActivate: [LoggedGuard] },
    // { path: 'account-management', component: AccountManagementComponent },
    { path: 'statistics', component: StatisticsPageComponent },
    { path: 'wardrobe', component: WardrobeComponent },
    { path: 'tips', component: TipsComponent, canActivate: [LoggedGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
