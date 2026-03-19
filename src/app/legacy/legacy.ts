import { fetchPortfolioRoute } from '../config/portfolio-api';

type Skill = {
  n: string;
  ico: string;
  r: 'legendary' | 'epic' | 'rare' | 'common';
  pct: number;
  typ: 'Aprendiendo' | 'Intermedio' | 'Avanzado';
};

type SkillApiItem = {
  n?: string;
  ico?: string;
  r?: string;
  pct?: number;
  typ?: string;
};

type Achievement = {
  id: string;
  ico: string;
  n: string;
  d: string;
  u: boolean;
};

type BossQuestion = {
  q: string;
  opts: string[];
  a: number;
};

const byId = <T extends HTMLElement>(id: string): T | null => {
  return document.getElementById(id) as T | null;
};

/* ===================== STATE ===================== */
let SC = 0;
let CO = 0;
let achOpen = false;
let tmr = 300;
let comboCount = 0;
let comboTmr: ReturnType<typeof setTimeout> | null = null;
let comboMult = 1;
let blocksHit = 0;
const sectSeen: Record<string, boolean> = {};

/* ===================== DATA ===================== */

let SKILLS: Skill[] = [];

function normalizeRarity(value?: string): Skill['r'] {
  if (value === 'legendary' || value === 'epic' || value === 'rare' || value === 'common') {
    return value;
  }
  return 'common';
}

function normalizeType(value?: string): Skill['typ'] {
  if (value === 'Avanzado' || value === 'Intermedio' || value === 'Aprendiendo') {
    return value;
  }
  return 'Intermedio';
}

function normalizePct(value?: number): number {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

async function loadSkills(): Promise<void> {
  try {
    const remote = await fetchPortfolioRoute<SkillApiItem>('skills');
    const mapped = remote
      .map((item) => ({
        n: item.n?.trim() ?? '',
        ico: item.ico?.trim() ?? '',
        r: normalizeRarity(item.r),
        pct: normalizePct(item.pct),
        typ: normalizeType(item.typ)
      }))
      .filter((item) => item.n.length > 0);

    if (mapped.length) {
      SKILLS = mapped;
    }
  } catch {
    SKILLS = [];
  }
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first', ico: '&#127381;', n: 'PRIMER CLICK', d: 'Interactuaste por primera vez', u: false },
  { id: 'coins10', ico: '&#129689;', n: 'COLECCIONISTA', d: '10 monedas recolectadas', u: false },
  { id: 'score1k', ico: '&#11088;', n: 'HIGH SCORE', d: '1000 puntos alcanzados', u: false },
  { id: 'combo5', ico: '&#9889;', n: 'COMBO MASTER', d: 'Combo x5 activado', u: false },
  { id: 'boss', ico: '&#128293;', n: 'BOSS SLAYER', d: 'Boss derrotado', u: false },
  { id: 'inv', ico: '&#127922;', n: 'INVENTARIO ABIERTO', d: 'Revisaste tus skills', u: false },
  { id: 'contact', ico: '&#128172;', n: 'CO-OP INICIADO', d: 'Enviaste un mensaje', u: false },
  { id: 'night', ico: '&#127769;', n: 'BUHO NOCTURNO', d: 'Visitaste de noche', u: false },
  { id: 'konami', ico: '&#127918;', n: 'EASTER EGG', d: 'Descubre el secreto', u: false },
  { id: 'blocks5', ico: '&#128310;', n: 'ROMPE BLOQUES', d: '5 bloques golpeados', u: false },
  { id: 'allworlds', ico: '&#127942;', n: 'MAESTRO DEL REINO', d: 'Visitaste todos los worlds', u: false }
];

const BOSS_QS: BossQuestion[] = [
  { q: '¿Cuál es el stack principal de Daniel?', opts: ['React + Django', 'Vue + Laravel', '.NET 8 + Angular 21', 'Flutter + Firebase'], a: 2 },
  { q: '¿Dónde tuvo su pasantía Daniel?', opts: ['Freelance', 'Amazon Panamá', 'LogicStudio Panamá', 'Google LATAM'], a: 2 },
  { q: '¿Cuál arquitectura usa Daniel en backend?', opts: ['Monolítica sin patrones', 'Microservicios con Spring', 'Clean Architecture (Onion)', 'MVC simple sin SOLID'], a: 2 },
  { q: '¿Cuál es el hobby musical de Daniel?', opts: ['Guitarra', 'Piano', 'Batería', 'Saxofón'], a: 3 },
  { q: '¿En qué universidad estudia Daniel?', opts: ['USMA', 'UP', 'UTP Sede Coclé', 'OTEIMA'], a: 2 }
];
let bossHp = 5;

/* ===================== CURSOR ===================== */
let cur: HTMLElement | null = null;
let cursorX = 0;
let cursorY = 0;
let cursorVisible = false;

function paintCursor(): void {
  const el = cur;
  if (!el) return;
  el.style.left = `${cursorX}px`;
  el.style.top = `${cursorY}px`;
}

function showCursor(): void {
  const el = cur;
  if (!el) return;
  if (cursorVisible) return;
  cursorVisible = true;
  el.style.opacity = '1';
}

function hideCursor(): void {
  const el = cur;
  if (!el) return;
  cursorVisible = false;
  el.style.opacity = '0';
}

window.addEventListener('mousemove', (e: MouseEvent) => {
  const docEl = document.documentElement;
  const scrollbarWidth = Math.max(0, window.innerWidth - docEl.clientWidth);
  const overVerticalScrollbar = scrollbarWidth > 0 && e.clientX >= (window.innerWidth - scrollbarWidth);
  if (overVerticalScrollbar) {
    hideCursor();
    return;
  }

  cursorX = e.clientX;
  cursorY = e.clientY;
  showCursor();
  paintCursor();
});

window.addEventListener('scroll', () => {
  if (!cursorVisible) return;
  paintCursor();
}, { passive: true });

document.addEventListener('mouseenter', () => {
  showCursor();
  paintCursor();
});

document.addEventListener('mouseleave', () => {
  hideCursor();
});

window.addEventListener('blur', () => {
  hideCursor();
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) hideCursor();
});

/* ===================== PROGRESS BAR ===================== */
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  const pb = byId<HTMLDivElement>('pb');
  if (pb) pb.style.width = `${pct}%`;
  spawnScrollParticles();
});

/* ===================== TIMER ===================== */
function startTimer(): void {
  setInterval(() => {
    if (tmr > 0) {
      tmr--;
      const ti = byId<HTMLSpanElement>('ti');
      if (ti) ti.textContent = String(tmr);
    }
  }, 1000);
}

/* ===================== SCORE / COINS ===================== */
function addScore(pts: number): void {
  const total = pts * comboMult;
  SC += total;
  const sc = byId<HTMLSpanElement>('sc');
  if (sc) sc.textContent = pad6(SC);
  if (SC >= 1000) unlockAch('score1k');
}

function addCoin(): void {
  CO++;
  const co = byId<HTMLSpanElement>('co');
  if (co) co.textContent = CO < 10 ? `0${CO}` : `${CO}`;
  if (CO >= 10) unlockAch('coins10');
}

function pad6(n: number): string {
  return (`000000${n}`).slice(-6);
}

/* ===================== COMBO SYSTEM ===================== */
function registerClick(): void {
  if (comboTmr) clearTimeout(comboTmr);
  comboCount++;
  comboMult = Math.min(comboCount, 8);
  const cmult = byId<HTMLSpanElement>('cmult');
  if (cmult) cmult.textContent = String(comboMult);
  const cm = byId<HTMLSpanElement>('cm');
  if (cm) cm.textContent = `x${comboMult}`;
  if (comboMult >= 2) {
    const el = byId<HTMLDivElement>('combo');
    if (el) {
      const cmultEl = el.querySelector<HTMLSpanElement>('#cmult');
      if (cmultEl) cmultEl.textContent = String(comboMult);
      el.classList.add('show');
      setTimeout(() => el.classList.remove('show'), 900);
    }
  }
  if (comboMult >= 5) unlockAch('combo5');
  comboTmr = setTimeout(() => {
    comboCount = 0;
    comboMult = 1;
    const cmEl = byId<HTMLSpanElement>('cm');
    if (cmEl) cmEl.textContent = 'x1';
  }, 1800);
}

/* ===================== POPUPS ===================== */
function spawnCoin(x: number, y: number): void {
  const el = document.createElement('div');
  el.className = 'cpop';
  el.innerHTML = '&#129689;';
  el.style.left = `${x}px`;
  el.style.top = `${y + window.scrollY}px`;
  document.body.appendChild(el);
  setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 700);
  addCoin();
}

function spawnPts(pts: number, x: number, y: number): void {
  const el = document.createElement('div');
  el.className = 'ppop';
  el.textContent = `+${pts * (comboMult > 1 ? comboMult : 1)}`;
  el.style.left = `${x}px`;
  el.style.top = `${y + window.scrollY - 16}px`;
  document.body.appendChild(el);
  setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 550);
}

/* ===================== PIXEL PARTICLES (on scroll) ===================== */
let pThrottle = false;
function spawnScrollParticles(): void {
  if (pThrottle) return;
  pThrottle = true;
  setTimeout(() => { pThrottle = false; }, 120);
  const colors = ['#f8b800', '#3382F6', '#512BD4', '#00b300', '#d63031'];
  for (let i = 0; i < 3; i++) {
    const p = document.createElement('div');
    p.className = 'pxp';
    p.style.left = `${Math.random() * window.innerWidth}px`;
    p.style.top = `${Math.random() * window.innerHeight}px`;
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
    document.body.appendChild(p);
    setTimeout((el: HTMLElement) => { if (el.parentNode) el.parentNode.removeChild(el); }, 950, p);
  }
}

/* ===================== COIN RAIN ===================== */
function coinRain(): void {
  for (let i = 0; i < 40; i++) {
    const delay = i * 80;
    setTimeout(() => {
      const c = document.createElement('div');
      c.className = 'rainc';
      c.innerHTML = '&#129689;';
      c.style.left = `${Math.random() * 100}vw`;
      c.style.top = '-40px';
      c.style.animationDuration = `${2 + Math.random() * 2}s`;
      document.body.appendChild(c);
      setTimeout(() => { if (c.parentNode) c.parentNode.removeChild(c); }, 4000);
    }, delay);
  }
}

/* ===================== Q-BLOCK HIT ===================== */
export function hitQ(el: HTMLElement, pts: number): void {
  registerClick();
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top;
  spawnCoin(cx, cy);
  spawnPts(pts, cx, cy);
  addScore(pts);
  el.style.transform = 'translateY(-16px)';
  setTimeout(() => { el.style.transform = ''; }, 160);
  blocksHit++;
  if (blocksHit >= 5) unlockAch('blocks5');
  unlockAch('first');
}

document.addEventListener('click', (e: MouseEvent) => {
  const target = e.target as HTMLElement | null;
  if (!target) return;
  if (target.classList.contains('hq') || target.classList.contains('qb')) return;
  if (target.closest('a') || target.closest('button') || target.closest('form')) return;
  registerClick();
  addScore(5);
  unlockAch('first');
});

/* ===================== WORLD SELECT ===================== */
export function openWS(): void {
  const ws = byId<HTMLDivElement>('ws');
  if (!ws) return;
  ws.classList.add('open');
}

export function closeWS(): void {
  const ws = byId<HTMLDivElement>('ws');
  if (!ws) return;
  ws.classList.remove('open');
}

export function goSec(id: string): void {
  const el = byId<HTMLElement>(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ===================== INSERT COIN ===================== */
async function legacyInit(): Promise<void> {
  const ic = byId<HTMLDivElement>('ic');
  if (!ic) return;
  const dismiss = () => {
    ic.style.transition = 'opacity 0.5s';
    ic.style.opacity = '0';
    setTimeout(() => {
      ic.style.display = 'none';
      showLT('WORLD 1-1', 'INICIO');
    }, 500);
    document.removeEventListener('keydown', keyHandler);
  };

  setTimeout(dismiss, 2800);
  ic.addEventListener('click', () => { dismiss(); });
  const keyHandler = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable)) {
      return;
    }
    dismiss();
  };
  document.addEventListener('keydown', keyHandler, { once: true });

  const h = new Date().getHours();
  if (h >= 22 || h < 6) setTimeout(() => { unlockAch('night'); }, 3200);

  startTimer();
  buildAch();
  await loadSkills();
  buildInv();
  buildBoss();
}

/* ===================== LEVEL TRANSITION ===================== */
function showLT(w: string, n: string): void {
  const el = byId<HTMLDivElement>('lt');
  const ltW = byId<HTMLSpanElement>('lt-w');
  const ltN = byId<HTMLSpanElement>('lt-n');
  if (!el || !ltW || !ltN) return;
  ltW.textContent = w;
  ltN.textContent = n;
  el.classList.add('show');
  setTimeout(() => { el.classList.remove('show'); }, 2000);
}

/* ===================== INVENTORY ===================== */
function buildInv(): void {
  const g = byId<HTMLDivElement>('inv-grid');

  if (!g) return;

  g.innerHTML = '';

  SKILLS.forEach((s) => {
    const d = document.createElement('div');
    
    d.className = `itm ${s.r}`;
    d.innerHTML = `<div class="rb ${s.r}">${s.r.toUpperCase()}</div><span class="itm-ico">${s.ico}</span><div class="itm-n">${s.n.toUpperCase()}</div><div class="itm-bar"><div class="itm-fill" style="width:${s.pct}%"></div></div>`;// <div class="itm-typ">${s.typ}</div> *Dejar para modificar despues si se quiere mostrar el tipo de habilidad
    g.appendChild(d);
  });
}

export function openInv(): void {
  const sec = byId<HTMLElement>('skillsec');
  if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  unlockAch('inv');
}

/* ===================== PROJECT MAP ===================== */
export function openPm(i: number): void {
  if (!window.dispatchEvent) return;
  window.dispatchEvent(new CustomEvent('pm:open', { detail: { index: i } }));
  addScore(200);
}

export function closePm(): void {
  window.dispatchEvent(new Event('pm:close'));
}

/* ===================== BOSS FIGHT ===================== */
function buildBoss(): void {
  const container = byId<HTMLDivElement>('bqs');
  if (!container) return;
  bossHp = 5;
  const bhpf = byId<HTMLDivElement>('bhpf');
  const bhpl = byId<HTMLDivElement>('bhpl');
  const bres = byId<HTMLDivElement>('bres');
  const bmsg = byId<HTMLDivElement>('bmsg');
  if (bhpf) bhpf.style.width = '100%';
  if (bhpl) bhpl.textContent = 'HP: 5 / 5';
  if (bres) bres.classList.remove('show');
  if (bmsg) bmsg.textContent = '';
  container.innerHTML = '';
  BOSS_QS.forEach((q) => {
    const div = document.createElement('div');
    div.className = 'bq';
    let opts = '';
    q.opts.forEach((o, oi) => {
      opts += `<button class="bopt" data-picked="${oi}" data-correct="${q.a}">${String.fromCharCode(65 + oi)}) ${o}</button>`;
    });
    div.innerHTML = `<div class="bq-t">${q.q}</div><div class="bopts">${opts}</div>`;
    div.querySelectorAll<HTMLButtonElement>('.bopt').forEach((btn) => {
      btn.addEventListener('click', () => {
        const picked = Number(btn.dataset['picked'] ?? -1);
        const correct = Number(btn.dataset['correct'] ?? -1);
        answerBoss(picked, correct, btn);
      });
    });
    container.appendChild(div);
  });
}

export function answerBoss(picked: number, correct: number, btn: HTMLButtonElement): void {
  const bq = btn.closest('.bq');
  if (!bq) return;
  bq.querySelectorAll<HTMLButtonElement>('.bopt').forEach((b) => { b.style.pointerEvents = 'none'; });
  const msg = byId<HTMLDivElement>('bmsg');
  if (!msg) return;
  if (picked === correct) {
    btn.className = 'bopt ok';
    bossHp--;
    const pct = Math.max(0, (bossHp / 5) * 100);
    const bhpf = byId<HTMLDivElement>('bhpf');
    const bhpl = byId<HTMLDivElement>('bhpl');
    if (bhpf) bhpf.style.width = `${pct}%`;
    if (bhpl) bhpl.textContent = `HP: ${bossHp} / 5`;
    msg.textContent = '¡RESPUESTA CORRECTA! -1 HP';
    msg.style.color = 'var(--green)';
    addScore(500);
    if (bossHp <= 0) {
      setTimeout(() => {
        const bres = byId<HTMLDivElement>('bres');
        if (bres) bres.classList.add('show');
        unlockAch('boss');
        coinRain();
        addScore(5000);
      }, 800);
    }
  } else {
    btn.className = 'bopt ng';
    const opts = bq.querySelectorAll<HTMLButtonElement>('.bopt');
    if (opts[correct]) opts[correct].className = 'bopt ok';
    msg.textContent = `INCORRECTO. La respuesta era: ${String.fromCharCode(65 + correct)}`;
    msg.style.color = 'var(--red)';
  }
  setTimeout(() => { msg.textContent = ''; }, 2500);
}

/* ===================== ACHIEVEMENTS ===================== */
function buildAch(): void {
  const l = byId<HTMLDivElement>('achl');
  if (!l) return;
  l.innerHTML = '';
  ACHIEVEMENTS.forEach((a) => {
    const d = document.createElement('div');
    d.className = `ai ${a.u ? 'unlocked' : 'locked'}`;
    d.id = `a-${a.id}`;
    d.innerHTML = `<div class="ai-i">${a.ico}</div><div><div class="ai-n">${a.n}</div><div class="ai-d">${a.d}</div></div>`;
    l.appendChild(d);
  });
}

function unlockAch(id: string): void {
  const a = ACHIEVEMENTS.find((x) => x.id === id);
  if (!a || a.u) return;
  a.u = true;
  const el = byId<HTMLDivElement>(`a-${id}`);
  if (el) el.className = 'ai unlocked';
  const ati = byId<HTMLDivElement>('ati');
  const atn = byId<HTMLDivElement>('atn');
  if (ati) ati.innerHTML = a.ico;
  if (atn) atn.textContent = a.n;
  const t = byId<HTMLDivElement>('acht');
  if (t) {
    t.classList.add('show');
    setTimeout(() => { t.classList.remove('show'); }, 3200);
  }
  addScore(800);
  const allSecs = ['story', 'about', 'cvsec', 'skillsec', 'mapsec', 'bosssec'];
  if (allSecs.every((s) => sectSeen[s])) unlockAch('allworlds');
}

export function toggleAch(): void {
  achOpen = !achOpen;
  const achp = byId<HTMLDivElement>('achp');
  if (achp) achp.classList.toggle('open', achOpen);
}

/* ===================== CONTACT FORM ===================== */
export function sendForm(e: Event): void {
  e.preventDefault();
  const btn = byId<HTMLButtonElement>('sbtn');
  if (!btn) return;
  btn.textContent = 'MISION RECIBIDA!';
  btn.style.background = 'var(--green)';
  addScore(1000);
  unlockAch('contact');
  coinRain();
  setTimeout(() => {
    btn.textContent = 'ENVIAR MISION';
    btn.style.background = 'var(--gold)';
  }, 3000);
}

export function registerContactAchievement(): void {
  unlockAch('contact');
  addScore(1000);
  coinRain();
}

/* ===================== SCROLL REVEAL + SECTION TRACKING ===================== */
function setupRevealAndTracking(): void {
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('on');
    });
  }, { threshold: 0.12 });
  document.querySelectorAll<HTMLElement>('.rev').forEach((el) => { revObs.observe(el); });

  const slObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const lines = entry.target.querySelectorAll<HTMLElement>('.sl');
        lines.forEach((l, i) => { setTimeout(() => l.classList.add('on'), i * 200); });
      }
    });
  }, { threshold: 0.2 });
  const sw = document.querySelector<HTMLElement>('.sl-wrap');
  if (sw) slObs.observe(sw);

  const secObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.target.id) sectSeen[entry.target.id] = true;
    });
  }, { threshold: 0.25 });
  ['story', 'about', 'cvsec', 'skillsec', 'mapsec', 'bosssec', 'testsec', 'consec'].forEach((id) => {
    const el = byId<HTMLElement>(id);
    if (el) secObs.observe(el);
  });
}

/* HOVER SOUNDS */
function setupHoverSounds(): void {
  // intentionally no-op: audio feedback removed
}

document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.code === 'Escape') {
    const pm = byId<HTMLDivElement>('pm');
    const ws = byId<HTMLDivElement>('ws');
    if (pm && pm.classList.contains('open')) closePm();
    if (ws && ws.classList.contains('open')) closeWS();
  }
});
/* ===================== DARK MODE ===================== */
let dmOn = false;
export function toggleDM(): void {
  dmOn = !dmOn;
  document.body.classList.toggle('dark-mode', dmOn);
  const btn = byId<HTMLButtonElement>('dm-btn');
  if (btn) btn.textContent = dmOn ? '\u2600\uFE0F DIA' : '\u263E NOCHE';
  if (dmOn) {
    unlockAch('night');
    document.querySelectorAll<HTMLElement>('.sky-l,.cloud-row,.hill-row,.plat-row,.gnd').forEach((el) => {
      el.style.filter = 'brightness(0.55) saturate(0.82)';
    });
    const hero = byId<HTMLDivElement>('hero');
    if (hero) hero.style.background = '#070b16';
    if (!byId<HTMLDivElement>('stars-layer')) {
      const sl = document.createElement('div');
      sl.id = 'stars-layer';
      sl.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;';
      for (let i = 0; i < 80; i++) {
        const s = document.createElement('div');
        s.style.cssText = `position:absolute;width:2px;height:2px;background:#c7d5ff;left:${Math.random() * 100}%;top:${Math.random() * 60}%;opacity:${0.15 + Math.random() * 0.3};${Math.random() > 0.5 ? `animation:blink ${1 + Math.random() * 2}s step-end infinite;` : ''}`;
        sl.appendChild(s);
      }
      if (hero) hero.insertBefore(sl, hero.firstChild);
    }
    const stars = byId<HTMLDivElement>('stars-layer');
    if (stars) stars.style.display = 'block';
  } else {
    document.querySelectorAll<HTMLElement>('.sky-l,.cloud-row,.hill-row,.plat-row,.gnd').forEach((el) => {
      el.style.filter = '';
    });
    const hero = byId<HTMLDivElement>('hero');
    if (hero) hero.style.background = '';
    const sl = byId<HTMLDivElement>('stars-layer');
    if (sl) sl.style.display = 'none';
  }
}

/* ===================== KONAMI CODE ===================== */
const KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
let konamiIdx = 0;
document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.keyCode === KONAMI[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === KONAMI.length) {
      konamiIdx = 0;
      showKonami();
    }
  } else {
    konamiIdx = e.keyCode === KONAMI[0] ? 1 : 0;
  }
});

function showKonami(): void {
  const el = byId<HTMLDivElement>('konami-screen');
  if (el) el.classList.add('show');
  addScore(9999); coinRain();
  unlockAch('konami');
}

export function closeKonami(): void {
  const el = byId<HTMLDivElement>('konami-screen');
  if (el) el.classList.remove('show');
}

export function initLegacy(): void {
  void legacyInit();
  cur = byId<HTMLElement>('cur');
  setTimeout(() => {
    setupRevealAndTracking();
    setupHoverSounds();
  }, 0);
}
