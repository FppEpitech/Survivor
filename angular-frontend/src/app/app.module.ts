import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {  AccountManagementComponent } from './account-management/account-management.component';
import {  NavbarComponent } from './navbar/navbar.component';
import {  ClientProfileComponent } from './client-profile/client-profile.component';
import {  StatisticsComponent } from './statistics/statistics.component';


@NgModule({
  declarations: [
    AppComponent,
    AccountManagementComponent,
    NavbarComponent,
    ClientProfileComponent,
    StatisticsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
