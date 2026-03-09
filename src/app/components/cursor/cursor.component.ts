import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-cursor',
  templateUrl: './cursor.component.html',
  styleUrl: './cursor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CursorComponent {}
