import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-astrological-compatibility',
  templateUrl: './astrological-compatibility.component.html',
  styleUrls: ['./astrological-compatibility.component.scss']
})
export class AstrologicalCompatibilityComponent {
    isLeftDropdownPressed = false;
    isRightDropdownPressed = false;

    // Toggles the dropdown state
    toggleDropdown(dropdown: 'left' | 'right', event: Event) {
      event.stopPropagation(); // Prevents the event from bubbling up the DOM tree
      if (dropdown === 'left') {
        this.isLeftDropdownPressed = !this.isLeftDropdownPressed;
      } else {
        this.isRightDropdownPressed = !this.isRightDropdownPressed;
      }
    }

    // Closes the dropdown
    closeDropdown(dropdown: 'left' | 'right') {
      if (dropdown === 'left') {
        this.isLeftDropdownPressed = false;
      } else {
        this.isRightDropdownPressed = false;
      }
    }

    // Closes the dropdown if clicked outside
    @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    const dropdownLeft = document.querySelector('.dropdownLeft');
    const dropdownRight = document.querySelector('.dropdownRight');

    if (dropdownLeft && !dropdownLeft.contains(event.target as Node)) {
      this.isLeftDropdownPressed = false;
    }

    if (dropdownRight && !dropdownRight.contains(event.target as Node)) {
      this.isRightDropdownPressed = false;
    }
  }
}
