import { ChangeDetectionStrategy, Component } from '@angular/core';
import { openInv, openMg, openWS, toggleAch, toggleSfx } from '../../legacy/legacy';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent {
  toggleSfx(): void {
    toggleSfx();
  }

  openWS(): void {
    openWS();
  }

  openInv(): void {
    openInv();
  }

  openMg(): void {
    openMg();
  }

  toggleAch(): void {
    toggleAch();
  }
}
