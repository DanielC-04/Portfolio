import { Injectable, computed, signal } from '@angular/core';
import { fetchPortfolioRoute } from '../../config/portfolio-api';

export type ProjectStatus = 'LIVE' | 'EN DESARROLLO' | 'COMPLETADO';
export type ProjectTab = 'INFO' | 'README' | 'STACK';

export type ProjectMedia = {
  label: 'SCR 1' | 'SCR 2' | 'SCR 3' | 'GIF';
  type: 'placeholder' | 'image' | 'gif';
  url?: string;
};

export type ProjectItem = {
  w: string;
  t: string;
  d: string;
  tags: string[];
  demo: string;
  gh: string;
  features?: string[];
  status?: ProjectStatus;
  readme?: string;
  stack?: string;
  media?: ProjectMedia[];
};

const DEFAULT_MEDIA: ProjectMedia[] = [
  { label: 'SCR 1', type: 'placeholder' },
  { label: 'SCR 2', type: 'placeholder' },
  { label: 'SCR 3', type: 'placeholder' },
  { label: 'GIF', type: 'placeholder' }
];

type ProjectApiItem = {
  id?: string;
  w?: string;
  t?: string;
  d?: string;
  tags?: string[];
  features?: string[];
  status?: string;
  demo?: string;
  gh?: string;
  readme?: string;
  stack?: string;
  media?: Array<{ label?: string; type?: string; url?: string; src?: string }>;
};

function normalizeStatus(status?: string): ProjectStatus {
  if (status === 'LIVE') return 'LIVE';
  if (status === 'COMPLETADO') return 'COMPLETADO';
  return 'EN DESARROLLO';
}

function normalizeMedia(media?: Array<{ label?: string; type?: string; url?: string; src?: string }>): ProjectMedia[] {
  if (!media || !media.length) return DEFAULT_MEDIA;
  const normalized = media.map((item, index) => {
    const fallbackLabel: ProjectMedia['label'] =
      index === 1 ? 'SCR 2' : index === 2 ? 'SCR 3' : index === 3 ? 'GIF' : 'SCR 1';

    const label = item.label === 'SCR 1' || item.label === 'SCR 2' || item.label === 'SCR 3' || item.label === 'GIF'
      ? item.label
      : fallbackLabel;

    const rawType = (item.type ?? '').trim().toLowerCase();
    const type: ProjectMedia['type'] = rawType === 'image' || rawType === 'gif' ? rawType : 'placeholder';
    const url = (item.url ?? item.src ?? '').trim();
    return {
      label,
      type,
      url
    };
  });

  return normalized.length ? normalized : DEFAULT_MEDIA;
}

function mapProjectApi(item: ProjectApiItem): ProjectItem {
  return {
    w: (item.w ?? '').trim(),
    t: (item.t ?? '').trim(),
    d: (item.d ?? '').trim(),
    tags: Array.isArray(item.tags) ? item.tags : [],
    demo: (item.demo ?? '#').trim() || '#',
    gh: (item.gh ?? '#').trim() || '#',
    features: Array.isArray(item.features) ? item.features : [],
    status: normalizeStatus(item.status),
    readme: (item.readme ?? '').trim(),
    stack: (item.stack ?? '').trim(),
    media: normalizeMedia(item.media)
  };
}

function findDefaultMediaIndex(project: ProjectItem | null): number {
  const media = project?.media ?? DEFAULT_MEDIA;
  const idx = media.findIndex((m) => (m.type === 'image' || m.type === 'gif') && !!m.url?.trim());
  return idx >= 0 ? idx : 0;
}

@Injectable({ providedIn: 'root' })
export class ProjectModalStateService {
  private readonly projectsSignal = signal<ProjectItem[]>([]);
  private readonly openSignal = signal(false);
  private readonly currentIndexSignal = signal(0);
  private readonly activeTabSignal = signal<ProjectTab>('INFO');
  private readonly activeMediaIndexSignal = signal(0);

  readonly projects = this.projectsSignal.asReadonly();
  readonly isOpen = this.openSignal.asReadonly();
  readonly currentIndex = this.currentIndexSignal.asReadonly();
  readonly activeTab = this.activeTabSignal.asReadonly();
  readonly activeMediaIndex = this.activeMediaIndexSignal.asReadonly();

  readonly currentProject = computed(() => {
    const list = this.projectsSignal();
    const idx = this.currentIndexSignal();
    return list[idx] ?? null;
  });

  readonly totalProjects = computed(() => this.projectsSignal().length);

  constructor() {
    void this.loadProjects();
  }

  private async loadProjects(): Promise<void> {
    try {
      const remote = await fetchPortfolioRoute<ProjectApiItem>('projects');
      const mapped = remote
        .map(mapProjectApi)
        .filter((p) => p.w.length > 0 && p.t.length > 0 && p.t.toLowerCase() !== 'proyecto');
      if (mapped.length) {
        this.projectsSignal.set(mapped);
      } else {
        this.projectsSignal.set([]);
      }
    } catch {
      this.projectsSignal.set([]);
    }
  }

  open(index: number): void {
    const max = this.projectsSignal().length - 1;
    if (max < 0) return;
    const safeIndex = Math.min(Math.max(index, 0), max);
    this.currentIndexSignal.set(safeIndex);
    this.activeTabSignal.set('INFO');
    this.activeMediaIndexSignal.set(findDefaultMediaIndex(this.projectsSignal()[safeIndex] ?? null));
    this.openSignal.set(true);
  }

  close(): void {
    this.openSignal.set(false);
  }

  next(): void {
    const total = this.projectsSignal().length;
    if (!total) return;
    const nextIndex = (this.currentIndexSignal() + 1) % total;
    this.currentIndexSignal.set(nextIndex);
    this.activeTabSignal.set('INFO');
    this.activeMediaIndexSignal.set(findDefaultMediaIndex(this.projectsSignal()[nextIndex] ?? null));
  }

  prev(): void {
    const total = this.projectsSignal().length;
    if (!total) return;
    const prevIndex = (this.currentIndexSignal() - 1 + total) % total;
    this.currentIndexSignal.set(prevIndex);
    this.activeTabSignal.set('INFO');
    this.activeMediaIndexSignal.set(findDefaultMediaIndex(this.projectsSignal()[prevIndex] ?? null));
  }

  setTab(tab: ProjectTab): void {
    this.activeTabSignal.set(tab);
  }

  setMedia(index: number): void {
    const media = this.currentProject()?.media ?? DEFAULT_MEDIA;
    const safeIndex = Math.min(Math.max(index, 0), media.length - 1);
    this.activeMediaIndexSignal.set(safeIndex);
  }

  resolveStatus(project: ProjectItem | null): ProjectStatus {
    return project?.status ?? 'EN DESARROLLO';
  }
}
