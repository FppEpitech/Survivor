import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { ClientProfileComponent } from './pages/client-profile/client-profile.component';
import { LoggedGuard } from './guards/logged.guard';
import { WardrobeComponent } from './pages/wardrobe/wardrobe.component';
import { StatisticsPageComponent } from './pages/statistics/statistics.component';
import { AstrologicalCompatibilityComponent } from './pages/astrological-compatibility/astrological-compatibility.component';
import { TipsComponent } from './pages/tips/tips.component';
// import {  AccountManagementComponent } from './account-management/account-management.component';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [LoggedGuard]},
    { path: 'login', component: LoginComponent},
    { path: 'client-profile', component: ClientProfileComponent, canActivate: [LoggedGuard] },
    { path: 'astrological-compatibility', component: AstrologicalCompatibilityComponent, canActivate: [LoggedGuard]},
    { path: 'statistics', component: StatisticsPageComponent, canActivate: [LoggedGuard] },
    { path: 'wardrobe', component: WardrobeComponent, canActivate: [LoggedGuard] },
    { path: 'tips', component: TipsComponent, canActivate: [LoggedGuard] },
    { path: 'home', component: HomeComponent, canActivate: [LoggedGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
