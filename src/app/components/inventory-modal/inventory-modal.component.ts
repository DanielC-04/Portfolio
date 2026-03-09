import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { closeInv } from '../../legacy/legacy';

@Component({
  selector: 'app-inventory-modal',
  templateUrl: './inventory-modal.component.html',
  styleUrl: './inventory-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class InventoryModalComponent {
  closeInv(): void {
    closeInv();
  }
}
