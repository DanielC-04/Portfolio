import { ChangeDetectionStrategy, Component } from '@angular/core';
import { hitQ } from '../../legacy/legacy';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent {
  hitQ(target: EventTarget | null, pts: number): void {
    if (!(target instanceof HTMLElement)) {
      return;
    }
    hitQ(target, pts);
  }
}
