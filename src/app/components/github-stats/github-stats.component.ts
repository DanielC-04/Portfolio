import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-github-stats',
  templateUrl: './github-stats.component.html',
  styleUrl: './github-stats.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GithubStatsComponent {}
