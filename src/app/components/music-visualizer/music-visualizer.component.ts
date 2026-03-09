import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-music-visualizer',
  templateUrl: './music-visualizer.component.html',
  styleUrl: './music-visualizer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MusicVisualizerComponent {}
