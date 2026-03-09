import { ChangeDetectionStrategy, Component } from '@angular/core';
import { openPm } from '../../legacy/legacy';

@Component({
  selector: 'app-projects-map',
  templateUrl: './projects-map.component.html',
  styleUrl: './projects-map.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsMapComponent {
  openPm(index: number): void {
    openPm(index);
  }
}
