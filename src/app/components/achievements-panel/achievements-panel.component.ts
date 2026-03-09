import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-achievements-panel',
  templateUrl: './achievements-panel.component.html',
  styleUrl: './achievements-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AchievementsPanelComponent {}
