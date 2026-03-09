import { ChangeDetectionStrategy, Component } from '@angular/core';
import { closeKonami } from '../../legacy/legacy';

@Component({
  selector: 'app-konami-screen',
  templateUrl: './konami-screen.component.html',
  styleUrl: './konami-screen.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KonamiScreenComponent {
  closeKonami(): void {
    closeKonami();
  }
}
