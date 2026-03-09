import { ChangeDetectionStrategy, Component } from '@angular/core';
import { closeWS, goSec, openInv } from '../../legacy/legacy';

@Component({
  selector: 'app-world-select',
  templateUrl: './world-select.component.html',
  styleUrl: './world-select.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorldSelectComponent {
  goSec(id: string): void {
    goSec(id);
  }

  closeWS(): void {
    closeWS();
  }

  openInv(): void {
    openInv();
  }
}
