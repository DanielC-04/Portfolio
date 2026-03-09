import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-level-transition',
  templateUrl: './level-transition.component.html',
  styleUrl: './level-transition.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LevelTransitionComponent {}
