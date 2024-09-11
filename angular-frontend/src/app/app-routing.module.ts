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
import { CoachesComponent } from './pages/coaches/coaches.component';
import { RegisterEmployeeComponent } from './pages/register-employee/register-employee.component';
import { EventsComponent } from './pages/events/events.component';
import { ManagerGuard } from './guards/manager.guard';
import { ThemeComponent } from './pages/theme/theme/theme.component';


const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [LoggedGuard]},
    { path: 'login', component: LoginComponent},
    { path: 'client-profile', component: ClientProfileComponent, canActivate: [LoggedGuard] },
    { path: 'coaches', component: CoachesComponent, canActivate: [LoggedGuard, ManagerGuard] },
    { path: 'astrological-compatibility', component: AstrologicalCompatibilityComponent, canActivate: [LoggedGuard]},
    { path: 'statistics', component: StatisticsPageComponent, canActivate: [LoggedGuard] },
    { path: 'wardrobe', component: WardrobeComponent, canActivate: [LoggedGuard] },
    { path: 'tips', component: TipsComponent, canActivate: [LoggedGuard] },
    { path: 'home', component: HomeComponent, canActivate: [LoggedGuard] },
    { path: 'register-employee', component: RegisterEmployeeComponent, canActivate: [LoggedGuard, ManagerGuard] },
    { path: 'events', component: EventsComponent, canActivate: [LoggedGuard] },
    { path: 'theme', component: ThemeComponent, canActivate: [LoggedGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
