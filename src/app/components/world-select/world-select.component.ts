import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-world-select',
  templateUrl: './world-select.component.html',
  styleUrl: './world-select.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorldSelectComponent {}
