import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrl: './story.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoryComponent {}
