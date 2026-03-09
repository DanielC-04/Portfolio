import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dark-mode-button',
  templateUrl: './dark-mode-button.component.html',
  styleUrl: './dark-mode-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DarkModeButtonComponent {}
