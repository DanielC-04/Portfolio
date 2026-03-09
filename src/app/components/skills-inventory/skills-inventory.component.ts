import { ChangeDetectionStrategy, Component } from '@angular/core';
import { openInv } from '../../legacy/legacy';

@Component({
  selector: 'app-skills-inventory',
  templateUrl: './skills-inventory.component.html',
  styleUrl: './skills-inventory.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsInventoryComponent {
  openInv(): void {
    openInv();
  }
}
