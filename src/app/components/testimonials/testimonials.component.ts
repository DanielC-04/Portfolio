import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { submitAld } from '../../legacy/legacy';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TestimonialsComponent {
  submitAld(event: Event): void {
    submitAld(event);
  }
}
