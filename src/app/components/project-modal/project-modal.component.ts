import { ChangeDetectionStrategy, Component, HostListener, ViewEncapsulation, computed } from '@angular/core';
import { closePm } from '../../legacy/legacy';
import { ProjectModalStateService, type ProjectStatus, type ProjectTab } from './project-modal.state';

@Component({
  selector: 'app-project-modal',
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ProjectModalComponent {
  private readonly stateSvc: ProjectModalStateService;
  protected readonly tabs: ProjectTab[] = ['INFO', 'README', 'STACK'];
  protected readonly state: ProjectModalStateService;
  protected readonly project;
  protected readonly isOpen;
  protected readonly currentIndex;
  protected readonly total;
  protected readonly activeTab;
  protected readonly activeMediaIndex;
  protected readonly media = computed(() => this.project()?.media ?? []);
  protected readonly status = computed(() => this.stateSvc.resolveStatus(this.project()));
  protected readonly safeProject = computed(() => this.project()!);
  protected readonly tabContent = computed(() => {
    const current = this.project();
    if (!current) return '';
    const active = this.activeTab();
    if (active === 'README') {
      return current.readme ?? 'README pendiente. Aqui ira el resumen tecnico del repo y decisiones de arquitectura.';
    }
    if (active === 'STACK') {
      return current.stack ?? `Stack principal: ${current.tags.join(', ')}`;
    }
    return current.d;
  });

  constructor(projectModalState: ProjectModalStateService) {
    this.stateSvc = projectModalState;
    this.state = this.stateSvc;
    this.project = this.stateSvc.currentProject;
    this.isOpen = this.stateSvc.isOpen;
    this.currentIndex = this.stateSvc.currentIndex;
    this.total = this.stateSvc.totalProjects;
    this.activeTab = this.stateSvc.activeTab;
    this.activeMediaIndex = this.stateSvc.activeMediaIndex;
  }

  @HostListener('window:pm:open', ['$event'])
  onLegacyOpen(event: Event): void {
    const customEvent = event as CustomEvent<{ index?: number }>;
    const index = customEvent.detail?.index ?? 0;
    this.stateSvc.open(index);
  }

  @HostListener('window:pm:close')
  onLegacyClose(): void {
    this.stateSvc.close();
  }

  closePm(): void {
    this.stateSvc.close();
    closePm();
  }

  prev(): void {
    this.stateSvc.prev();
  }

  next(): void {
    this.stateSvc.next();
  }

  setTab(tab: ProjectTab): void {
    this.stateSvc.setTab(tab);
  }

  setMedia(index: number): void {
    this.stateSvc.setMedia(index);
  }

  isStatus(status: ProjectStatus): boolean {
    return this.status() === status;
  }
}
