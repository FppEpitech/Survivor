import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  theme: 'light' | 'dark' | 'forest' = 'light';

  getIconColor(): string {
    switch (this.theme) {
      case 'light':
        return 'black';
      case 'dark':
        return 'green';
      case 'forest':
        return 'lightgray';
      default:
        return 'black';
    }
  }

  toggleTheme(): void {
    switch (this.theme) {
      case 'light':
        this.theme = 'dark';
        break;
      case 'dark':
        this.theme = 'forest';
        break;
      case 'forest':
        this.theme = 'light';
        break;
    }
    this.setTheme(this.theme);
  }

  setTheme(theme: string) {

    const body = document.body;
    body.classList.remove('bg-dark', 'text-light');
    body.classList.remove('bg-forest', 'forest-text-light');
    if (theme == "dark") {
      this.theme = "dark"
      body.classList.add('bg-dark', 'text-light');
    }
    if (theme == "forest") {
      body.classList.add('bg-forest', 'forest-text-light');
      this.theme = "forest";
    }
  }

  constructor() { }
}
