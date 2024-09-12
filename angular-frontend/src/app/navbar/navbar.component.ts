import { Employee, EmployeesService } from './../service/employees/employees.service';
import { AuthService } from 'src/app/service/auth/auth.service';
import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  public width = window.innerWidth
  langValue = this._transloco.getActiveLang()
  lang = ['en', 'fr', 'zh', 'es']
  idx = this.lang.findIndex(language => language === this.langValue);
  thisLang = 'en'
  Me?: Employee;
  customerRightImageUrl?: string;
  apiUrl = environment.apiUrl;

  constructor(public _auth : AuthService, private router : Router, public _transloco : TranslocoService, private employeesService: EmployeesService) {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  langChangeSelect(lang : string) {
    this._transloco.setActiveLang(lang)
    this.langValue = lang
    localStorage.setItem('lang', lang)
  }

  changeLanguage() {
    this.idx+=1
    if (this.idx === this.lang.length)
        this.idx = 0;
    this.thisLang = this.lang[this.idx];
    this.langChangeSelect(this.lang[this.idx]);
  }

  private onResize(): void {
    this.width = window.innerWidth;
  }
  setTheme(ev: any) {
    const body = document.body;
    body.classList.remove('bg-dark', 'text-light');
    if (ev.target.value === 'dark') {
      body.classList.add('bg-dark', 'text-light');
    } else if (ev.target.value === 'random') {
      this.setRandomTheme();
    }
    localStorage.setItem('theme', ev.target.value);
  }

  private loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.setTheme(savedTheme);
  }

  private setRandomTheme() {
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    document.documentElement.style.setProperty('--background-color', randomColor);
    // Additional random color styles can be set here
  }

}
