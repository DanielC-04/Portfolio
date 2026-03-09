import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-combo',
  templateUrl: './combo.component.html',
  styleUrl: './combo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComboComponent {}
