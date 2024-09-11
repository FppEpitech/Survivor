import { Component } from '@angular/core';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss']
})
export class ThemeComponent {

    theme = localStorage.getItem('theme');

    constructor () {
        if (this.theme)
            document.documentElement.setAttribute('data-theme', this.theme);
    }

    toggleTheme(theme:string) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }
}
