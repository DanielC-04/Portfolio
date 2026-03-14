import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { initLegacy } from './legacy/legacy';
import { AboutComponent } from './components/about/about.component';
import { AchievementsPanelComponent } from './shared/achievements/achievements-panel.component';
import { BossFightComponent } from './components/boss-fight/boss-fight.component';
import { ComboComponent } from './components/combo/combo.component';
import { ContactComponent } from './components/contact/contact.component';
import { CursorComponent } from './components/cursor/cursor.component';
import { CvComponent } from './components/cv/cv.component';
import { DarkModeButtonComponent } from './components/dark-mode-button/dark-mode-button.component';
import { FooterComponent } from './components/footer/footer.component';
import { GithubStatsComponent } from './components/github-stats/github-stats.component';
import { HeroComponent } from './components/hero/hero.component';
import { InsertCoinComponent } from './shared/insert-coin/insert-coin.component';
import { KonamiScreenComponent } from './components/konami-screen/konami-screen.component';
import { LevelTransitionComponent } from './components/level-transition/level-transition.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { ProjectModalComponent } from './components/project-modal/project-modal.component';
import { ProjectsMapComponent } from './components/projects-map/projects-map.component';
import { SkillsInventoryComponent } from './components/skills-inventory/skills-inventory.component';
import { StoryComponent } from './components/story/story.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { TopbarComponent } from './shared/topbar/topbar.component';
import { WorldSelectComponent } from './components/world-select/world-select.component';

@Component({
  selector: 'app-root',
  imports: [
    AboutComponent,
    AchievementsPanelComponent,
    BossFightComponent,
    ComboComponent,
    ContactComponent,
    CursorComponent,
    CvComponent,
    DarkModeButtonComponent,
    FooterComponent,
    GithubStatsComponent,
    HeroComponent,
    InsertCoinComponent,
    KonamiScreenComponent,
    LevelTransitionComponent,
    ProgressBarComponent,
    ProjectModalComponent,
    ProjectsMapComponent,
    SkillsInventoryComponent,
    StoryComponent,
    TestimonialsComponent,
    TopbarComponent,
    WorldSelectComponent
  ],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements AfterViewInit {
  ngAfterViewInit(): void {
    initLegacy();
  }
}
