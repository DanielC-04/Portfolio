import { Injectable, computed, signal } from '@angular/core';

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

const PROJECTS: ProjectItem[] = [
  {
    w: 'WORLD 5-1',
    t: 'API REST .NET',
    d: 'Web API con .NET 8 y ASP.NET Core. Clean Architecture (Onion), patron Repository, JWT auth y Entity Framework Core con SQL Server.',
    tags: ['C#', '.NET 8', 'SQL Server', 'JWT', 'EF Core'],
    demo: '#',
    gh: 'https://github.com/DanielC-04',
    features: [
      'Autenticacion con JWT y refresh tokens',
      'Arquitectura limpia en capas Onion',
      'Repository Pattern + buenas practicas SOLID',
      'CRUD completo con validaciones',
      'Swagger para documentacion de endpoints'
    ],
    status: 'COMPLETADO',
    readme: 'Proyecto backend enfocado en escalabilidad, seguridad y mantenimiento con .NET 8.',
    stack: 'ASP.NET Core, Entity Framework Core, SQL Server, JWT, Swagger',
    media: DEFAULT_MEDIA
  },
  {
    w: 'WORLD 5-2',
    t: 'APP ANDROID BLE',
    d: 'Aplicacion Android nativa con Kotlin. Comunicacion BLE con beacons FeasyBeacon, geolocalizacion indoor, Foreground Services y notificaciones sin internet.',
    tags: ['Kotlin', 'Android', 'BLE', 'Beacons', 'IoT'],
    demo: '#',
    gh: 'https://github.com/DanielC-04',
    features: [
      'Escaneo y lectura de beacons BLE',
      'Servicios en segundo plano (foreground)',
      'Notificaciones locales sin conexion',
      'Logica de proximidad indoor',
      'Arquitectura modular para escalar features'
    ],
    status: 'COMPLETADO',
    readme: 'Aplicacion orientada a escenarios IoT y geolocalizacion indoor para Android nativo.',
    stack: 'Kotlin, Android SDK, BLE, Foreground Services, Notifications',
    media: DEFAULT_MEDIA
  },
  {
    w: 'WORLD 5-3',
    t: 'ANGULAR 21 APP',
    d: 'Frontend con Angular 21, TypeScript y RxJS. Componentes standalone, servicios, directivas personalizadas y consumo de APIs REST.',
    tags: ['Angular 21', 'TypeScript', 'RxJS', 'Bootstrap'],
    demo: '#',
    gh: 'https://github.com/DanielC-04',
    features: [
      'Arquitectura standalone component-first',
      'Estado reactivo con RxJS',
      'UI retro con componentes reutilizables',
      'Integracion con APIs REST',
      'Diseño responsivo mobile-first'
    ],
    status: 'LIVE',
    readme: 'Frontend principal del portfolio con enfoque interactivo y estilo pixel retro.',
    stack: 'Angular 21, TypeScript, RxJS, CSS, HTML',
    media: DEFAULT_MEDIA
  },
  {
    w: 'CASTLE',
    t: 'FULL STACK .NET + ANGULAR',
    d: 'Aplicacion full-stack. Backend .NET 8 con Azure Entra ID y SQL Server en Azure. Frontend Angular integrado con App Services.',
    tags: ['C#', '.NET 8', 'Angular', 'Azure', 'SQL Server', 'Docker'],
    demo: '#',
    gh: 'https://github.com/DanielC-04',
    features: [
      'Autenticacion empresarial con Azure Entra ID',
      'Backend y frontend desacoplados',
      'Despliegue en servicios cloud',
      'Contenerizacion para entornos consistentes',
      'Pipeline pensado para CI/CD'
    ],
    status: 'EN DESARROLLO',
    readme: 'Proyecto full-stack en evolucion para despliegue cloud y arquitectura empresarial.',
    stack: '.NET 8, Angular, Azure App Services, SQL Server, Docker',
    media: DEFAULT_MEDIA
  }
];

@Injectable({ providedIn: 'root' })
export class ProjectModalStateService {
  private readonly projectsSignal = signal<ProjectItem[]>(PROJECTS);
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

  open(index: number): void {
    const max = this.projectsSignal().length - 1;
    if (max < 0) return;
    const safeIndex = Math.min(Math.max(index, 0), max);
    this.currentIndexSignal.set(safeIndex);
    this.activeTabSignal.set('INFO');
    this.activeMediaIndexSignal.set(0);
    this.openSignal.set(true);
  }

  close(): void {
    this.openSignal.set(false);
  }

  next(): void {
    const total = this.projectsSignal().length;
    if (!total) return;
    this.currentIndexSignal.set((this.currentIndexSignal() + 1) % total);
    this.activeTabSignal.set('INFO');
    this.activeMediaIndexSignal.set(0);
  }

  prev(): void {
    const total = this.projectsSignal().length;
    if (!total) return;
    this.currentIndexSignal.set((this.currentIndexSignal() - 1 + total) % total);
    this.activeTabSignal.set('INFO');
    this.activeMediaIndexSignal.set(0);
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
