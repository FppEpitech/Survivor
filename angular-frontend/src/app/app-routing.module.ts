import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import {  ClientProfileComponent } from './pages/client-profile/client-profile.component';
import { LoggedGuard } from './guards/logged.guard';
import { WardrobeComponent } from './pages/wardrobe/wardrobe.component';
import { StatisticsPageComponent } from './pages/statistics/statistics.component';
import { AstrologicalCompatibilityComponent } from './pages/astrological-compatibility/astrological-compatibility.component';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [LoggedGuard]},
    { path: 'login', component: LoginComponent},
    { path: 'client-profile', component: ClientProfileComponent, canActivate: [LoggedGuard] },
    { path: 'statistics', component: StatisticsPageComponent },
    { path: 'wardrobe', component: WardrobeComponent },
    { path: 'astrological-compatibility', component: AstrologicalCompatibilityComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
