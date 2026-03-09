import { ChangeDetectionStrategy, Component } from '@angular/core';
import { downloadCV } from '../../legacy/legacy';

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrl: './cv.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CvComponent {
  downloadCV(): void {
    downloadCV();
  }
}
