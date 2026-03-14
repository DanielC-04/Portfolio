import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { fetchPortfolioRoute, postPortfolioRoute } from '../../config/portfolio-api';

type TestimonialItem = {
  id?: string;
  createdAt?: string;
  name?: string;
  role?: string;
  relation?: string;
  message?: string;
  avatarColor?: string;
  stars?: number;
  status?: string;
  approvedAt?: string;
};

type TestimonialPostResponse = {
  ok?: boolean;
  message?: string;
  error?: string;
};

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TestimonialsComponent {
  protected readonly testimonials = signal<TestimonialItem[]>([]);
  protected readonly formMessage = signal('');

  constructor() {
    void this.loadTestimonials();
  }

  private async loadTestimonials(): Promise<void> {
    try {
      const remote = await fetchPortfolioRoute<TestimonialItem>('testimonials');
      this.testimonials.set(remote);
    } catch {
      this.testimonials.set([]);
    }
  }

  protected starsText(stars?: number): string {
    const safe = Math.max(1, Math.min(5, Number(stars) || 5));
    return '⭐'.repeat(safe);
  }

  protected avatarStyle(color?: string): string {
    const fill = color?.trim() || '#3382F6';
    return `--ald-avatar-color:${fill}`;
  }

  async submitAld(event: Event): Promise<void> {
    event.preventDefault();

    const form = event.target as HTMLFormElement | null;
    if (!form) return;

    const nameInput = form.querySelector<HTMLInputElement>('#ald-name');
    const roleInput = form.querySelector<HTMLInputElement>('#ald-role');
    const msgInput = form.querySelector<HTMLTextAreaElement>('#ald-msg-inp');

    const name = nameInput?.value.trim() ?? '';
    const role = roleInput?.value.trim() ?? '';
    const message = msgInput?.value.trim() ?? '';

    if (!name || !message) {
      this.formMessage.set('Completa nombre y mensaje para enviar tu testimonio');
      return;
    }

    try {
      await postPortfolioRoute<TestimonialPostResponse>('testimonials', { name, role, message });
      this.formMessage.set('Testimonio enviado, sera revisado antes de publicarse');
      if (nameInput) nameInput.value = '';
      if (roleInput) roleInput.value = '';
      if (msgInput) msgInput.value = '';
    } catch {
      this.formMessage.set('No se pudo enviar el testimonio. Intenta nuevamente');
    }
  }
}
