import { ChangeDetectionStrategy, Component } from '@angular/core';
import { sendForm } from '../../legacy/legacy';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  sendForm(event: Event): void {
    sendForm(event);
  }
}
