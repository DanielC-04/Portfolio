import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-konami-screen',
  templateUrl: './konami-screen.component.html',
  styleUrl: './konami-screen.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KonamiScreenComponent {}
