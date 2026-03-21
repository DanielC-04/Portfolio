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
  protected readonly isSending = signal(false);
  private clearMessageTimer: ReturnType<typeof setTimeout> | null = null;

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
    if (this.isSending()) return;

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
      this.scheduleMessageClear();
      return;
    }

    this.isSending.set(true);
    try {
      await postPortfolioRoute<TestimonialPostResponse>('testimonials', { name, role, message });
      this.formMessage.set('Testimonio enviado, sera revisado antes de publicarse');
      this.scheduleMessageClear();
      if (nameInput) nameInput.value = '';
      if (roleInput) roleInput.value = '';
      if (msgInput) msgInput.value = '';
    } catch {
      this.formMessage.set('No se pudo enviar el testimonio. Intenta nuevamente');
      this.scheduleMessageClear();
    } finally {
      this.isSending.set(false);
    }
  }

  private scheduleMessageClear(): void {
    if (this.clearMessageTimer) {
      clearTimeout(this.clearMessageTimer);
    }
    this.clearMessageTimer = setTimeout(() => {
      this.formMessage.set('');
      this.clearMessageTimer = null;
    }, 5000);
  }
}
