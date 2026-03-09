import { ChangeDetectionStrategy, Component } from '@angular/core';
import { closeMg } from '../../legacy/legacy';

@Component({
  selector: 'app-minigame-modal',
  templateUrl: './minigame-modal.component.html',
  styleUrl: './minigame-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MinigameModalComponent {
  closeMg(): void {
    closeMg();
  }
}
