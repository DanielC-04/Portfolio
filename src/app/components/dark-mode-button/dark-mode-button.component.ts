import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toggleDM } from '../../legacy/legacy';

@Component({
  selector: 'app-dark-mode-button',
  templateUrl: './dark-mode-button.component.html',
  styleUrl: './dark-mode-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DarkModeButtonComponent {
  toggleDM(): void {
    toggleDM();
  }
}
