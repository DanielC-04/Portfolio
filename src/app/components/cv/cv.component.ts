import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { fetchPortfolioRoute } from '../../config/portfolio-api';
import { environment } from '../../../environments/environment';

type ExperienceItem = {
  id?: string;
  year?: string;
  role?: string;
  company?: string;
  description?: string;
  icon?: string;
  sort?: number;
  visible?: boolean;
};

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrl: './cv.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CvComponent {
  protected readonly experience = signal<ExperienceItem[]>([]);

  constructor() {
    void this.loadExperience();
  }

  private async loadExperience(): Promise<void> {
    try {
      const remote = await fetchPortfolioRoute<ExperienceItem>('experience');
      this.experience.set(remote.filter((item) => (item.role ?? '').trim().length > 0));
    } catch {
      this.experience.set([]);
    }
  }

  downloadCV(): void {
    if (!environment.cvUrl) {
      return;
    }

    const link = document.createElement('a');
    link.href = environment.cvUrl;
    link.download = 'Daniel_Carrasco_CV.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
