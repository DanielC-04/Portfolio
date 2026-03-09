import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-skills-inventory',
  templateUrl: './skills-inventory.component.html',
  styleUrl: './skills-inventory.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsInventoryComponent {}
