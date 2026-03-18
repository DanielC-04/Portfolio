import { ChangeDetectionStrategy, Component } from '@angular/core';
import { openInv, openWS, toggleAch, toggleDM } from '../../legacy/legacy';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent {
  openWS(): void {
    openWS();
  }

  openInv(): void {
    openInv();
  }

  toggleAch(): void {
    toggleAch();
  }

  toggleDM(): void {
    toggleDM();
  }
}
