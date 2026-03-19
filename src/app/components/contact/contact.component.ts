import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import emailjs from '@emailjs/browser';
import { environment } from '../../../environments/environment';
import { registerContactAchievement } from '../../legacy/legacy';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  protected readonly isSending = signal(false);
  protected readonly sendMessage = signal('');

  constructor() {
    if (environment.emailjsPublicKey) {
      emailjs.init(environment.emailjsPublicKey);
    }
  }

  async sendForm(event: Event): Promise<void> {
    event.preventDefault();
    if (this.isSending()) return;

    const form = event.target as HTMLFormElement | null;
    if (!form) return;

    const nameInput = form.querySelector<HTMLInputElement>('#contact-name');
    const emailInput = form.querySelector<HTMLInputElement>('#contact-email');
    const messageInput = form.querySelector<HTMLTextAreaElement>('#contact-message');

    const nombre = nameInput?.value.trim() ?? '';
    const email = emailInput?.value.trim() ?? '';
    const mensaje = messageInput?.value.trim() ?? '';

    if (!nombre || !email || !mensaje) {
      this.sendMessage.set('Completa todos los campos antes de enviar');
      return;
    }

    if (!environment.emailjsServiceId || !environment.emailjsTemplateId || !environment.emailjsPublicKey) {
      this.sendMessage.set('Error al enviar, intenta de nuevo');
      return;
    }

    this.isSending.set(true);
    this.sendMessage.set('');

    try {
      await emailjs.send(environment.emailjsServiceId, environment.emailjsTemplateId, {
        from_name: nombre,
        from_email: email,
        message: mensaje
      });

      registerContactAchievement();
      this.sendMessage.set('Mensaje enviado, te respondere pronto');
      form.reset();
    } catch {
      this.sendMessage.set('Error al enviar, intenta de nuevo');
    } finally {
      this.isSending.set(false);
    }
  }
}
