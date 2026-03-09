import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { closePm } from '../../legacy/legacy';

@Component({
  selector: 'app-project-modal',
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ProjectModalComponent {
  closePm(): void {
    closePm();
  }
}
