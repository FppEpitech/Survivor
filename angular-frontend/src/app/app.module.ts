import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {  NavbarComponent } from './navbar/navbar.component';
import {  ClientProfileComponent } from './pages/client-profile/client-profile.component';
import { LoginComponent } from './pages/login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './service/token-interceptor/token-interceptor.service';
import { TipsService } from './service/tips/tips.service';
import { CustomersService } from './service/customers/customers.service';
import { EmployeesService } from './service/employees/employees.service';
import { WardrobeComponent } from './pages/wardrobe/wardrobe.component';
import { CoachesComponent } from './pages/coaches/coaches.component';
import { TipsComponent } from './pages/tips/tips.component';
import { EventsComponent } from './pages/events/events.component';
import { AstrologicalCompatibilityComponent } from './pages/astrological-compatibility/astrological-compatibility.component';
import { FormsModule } from '@angular/forms';
import { SecurePipe } from './pipes/secure.pipe';
import { SignInCoachComponent } from './pages/sign-in-coach/sign-in-coach.component';
// import {  AccountManagementComponent } from './account-management/account-management.component';
// import {  StatisticsComponent } from './statistics/statistics.component';

@NgModule({
  declarations: [
    AppComponent,
    ClientProfileComponent,
    NavbarComponent,
    WardrobeComponent,
    CoachesComponent,
    TipsComponent,
    EventsComponent,
    AstrologicalCompatibilityComponent,
    LoginComponent,
    SecurePipe,
    SignInCoachComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true
      },
      TipsService,
      CustomersService,
      EmployeesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
