import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-insert-coin',
  templateUrl: './insert-coin.component.html',
  styleUrl: './insert-coin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InsertCoinComponent {}
