import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-boss-fight',
  templateUrl: './boss-fight.component.html',
  styleUrl: './boss-fight.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class BossFightComponent {}
