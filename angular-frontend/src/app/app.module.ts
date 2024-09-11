import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {  NavbarComponent } from './navbar/navbar.component';
import { ClientProfileComponent } from './pages/client-profile/client-profile.component';
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
import { RegisterEmployeeComponent } from './pages/register-employee/register-employee.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EventsService } from './service/events/events.service';
import { Events } from 'leaflet';
import { TranslocoRootModule } from './transloco-root.module';
import { DeleteEmployeeComponent } from './pages/delete-employee/delete-employee.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    ClientProfileComponent,
    NavbarComponent,
    WardrobeComponent,
    CoachesComponent,
    TipsComponent,
    AstrologicalCompatibilityComponent,
    LoginComponent,
    SecurePipe,
    RegisterEmployeeComponent,
    EventsComponent,
    DeleteEmployeeComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    TranslocoRootModule,
    NgbModule,
  ],
  providers: [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true
      },
      TipsService,
      CustomersService,
      EmployeesService,
      EventsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
