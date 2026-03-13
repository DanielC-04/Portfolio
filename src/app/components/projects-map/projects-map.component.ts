import { ChangeDetectionStrategy, Component } from '@angular/core';
import { openPm } from '../../legacy/legacy';
import { ProjectModalStateService, type ProjectItem } from '../project-modal/project-modal.state';

type MapPoint = { x: number; y: number };
type MapLayout = { width: number; height: number; points: MapPoint[]; path: string };

@Component({
  selector: 'app-projects-map',
  templateUrl: './projects-map.component.html',
  styleUrl: './projects-map.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsMapComponent {
  protected readonly projects;
  private readonly layoutCache = new Map<number, MapLayout>();

  constructor(private readonly projectModalState: ProjectModalStateService) {
    this.projects = this.projectModalState.projects;
  }

  openPm(index: number): void {
    openPm(index);
  }

  private buildLayout(total: number): MapLayout {
    const safeTotal = Math.max(total, 1);
    const cols = Math.min(7, safeTotal);
    const rows = Math.ceil(safeTotal / cols);
    const sidePadding = 90;
    const width = 1560;
    const xGap = cols > 1 ? (width - sidePadding * 2) / (cols - 1) : 0;
    const rowGap = 140;
    const startY = 156;

    const points: MapPoint[] = [];
    for (let i = 0; i < safeTotal; i++) {
      const row = Math.floor(i / cols);
      const colInRow = i % cols;
      const isEvenRow = row % 2 === 0;
      const visualCol = isEvenRow ? colInRow : cols - 1 - colInRow;
      const x = Math.round(sidePadding + visualCol * xGap);
      const yWave = colInRow % 2 === 0 ? 20 : -18;
      const y = startY + row * rowGap + yWave;
      points.push({ x, y });
    }

    const height = Math.max(320, startY + (rows - 1) * rowGap + 140);

    const path = this.buildPath(points);
    return { width, height, points, path };
  }

  private buildPath(points: MapPoint[]): string {
    if (!points.length) return '';
    if (points.length === 1) {
      return `M ${points[0].x} ${points[0].y}`;
    }

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const current = points[i];
      const midX = (prev.x + current.x) / 2;
      const midY = (prev.y + current.y) / 2;
      d += ` Q ${prev.x} ${prev.y} ${midX} ${midY}`;
    }

    const last = points[points.length - 1];
    d += ` T ${last.x} ${last.y}`;
    return d;
  }

  private getLayout(total: number): MapLayout {
    const key = Math.max(total, 1);
    const cached = this.layoutCache.get(key);
    if (cached) return cached;
    const layout = this.buildLayout(key);
    this.layoutCache.set(key, layout);
    return layout;
  }

  getMapWidth(total: number): number {
    return this.getLayout(total).width;
  }

  getMapHeight(total: number): number {
    return this.getLayout(total).height;
  }

  getMapPath(total: number): string {
    return this.getLayout(total).path;
  }

  getNodePoint(index: number, total: number): MapPoint {
    return this.getLayout(total).points[index] ?? { x: 100, y: 170 };
  }

  getNodeStyle(index: number, total: number): string {
    const point = this.getNodePoint(index, total);
    return `left:${point.x}px;top:${point.y}px`;
  }

  getNodeClass(index: number, total: number): string {
    if (index === total - 1 && total > 1) {
      return 'mn castle';
    }
    return 'mn';
  }

  nodeLabel(project: ProjectItem): string {
    const lines = project.t.split(' ');
    if (lines.length <= 2) {
      return lines.join('<br>');
    }
    return `${lines.slice(0, 2).join(' ')}<br>${lines.slice(2, 4).join(' ')}`;
  }
}
