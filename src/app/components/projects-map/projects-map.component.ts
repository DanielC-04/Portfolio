import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-projects-map',
  templateUrl: './projects-map.component.html',
  styleUrl: './projects-map.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsMapComponent {}
