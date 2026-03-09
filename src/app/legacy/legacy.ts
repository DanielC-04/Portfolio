type Project = {
  w: string;
  t: string;
  d: string;
  tags: string[];
  demo: string;
  gh: string;
};

type Skill = {
  n: string;
  ico: string;
  r: 'legendary' | 'epic' | 'rare' | 'common';
  pct: number;
  lvl: string;
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
let sfxOn = false;
let achOpen = false;
let audioCtx: AudioContext | null = null;
let bgmOn = false;
let bgmTmr: ReturnType<typeof setTimeout> | null = null;
let vizTmr: ReturnType<typeof setTimeout> | null = null;
let tmr = 300;
let tmrInt: ReturnType<typeof setInterval> | null = null;
let comboCount = 0;
let comboTmr: ReturnType<typeof setTimeout> | null = null;
let comboMult = 1;
let blocksHit = 0;
const sectSeen: Record<string, boolean> = {};
const vbars: HTMLDivElement[] = [];

/* ===================== DATA ===================== */
const PROJECTS: Project[] = [
  {
    w: 'WORLD 5-1',
    t: 'API REST .NET',
    d: 'Web API con .NET 8 y ASP.NET Core. Clean Architecture (Onion), patron Repository, JWT auth y Entity Framework Core con SQL Server.',
    tags: ['C#', '.NET 8', 'SQL Server', 'JWT', 'EF Core'],
    demo: '#',
    gh: 'https://github.com/DanielC-04'
  },
  {
    w: 'WORLD 5-2',
    t: 'APP ANDROID BLE',
    d: 'Aplicacion Android nativa con Kotlin. Comunicacion BLE con beacons FeasyBeacon, geolocalización indoor, Foreground Services y notificaciones sin internet.',
    tags: ['Kotlin', 'Android', 'BLE', 'Beacons', 'IoT'],
    demo: '#',
    gh: 'https://github.com/DanielC-04'
  },
  {
    w: 'WORLD 5-3',
    t: 'ANGULAR 21 APP',
    d: 'Frontend con Angular 21, TypeScript y RxJS. Componentes standalone, servicios, directivas personalizadas y consumo de APIs REST con manejo de estado reactivo.',
    tags: ['Angular 21', 'TypeScript', 'RxJS', 'Bootstrap'],
    demo: '#',
    gh: 'https://github.com/DanielC-04'
  },
  {
    w: 'CASTLE',
    t: 'FULL STACK .NET + ANGULAR',
    d: 'Aplicacion full-stack completa. Backend .NET 8 con Azure Entra ID, base de datos SQL Server en Azure. Frontend Angular integrado con Azure App Services.',
    tags: ['C#', '.NET 8', 'Angular', 'Azure', 'SQL Server', 'Docker'],
    demo: '#',
    gh: 'https://github.com/DanielC-04'
  }
];

const SKILLS: Skill[] = [
  { n: 'C#', ico: '&#128311;', r: 'legendary', pct: 85, lvl: 'LVL 8' },
  { n: '.NET 8', ico: '&#128640;', r: 'legendary', pct: 82, lvl: 'LVL 8' },
  { n: 'Angular 21', ico: '&#128308;', r: 'epic', pct: 78, lvl: 'LVL 7' },
  { n: 'TypeScript', ico: '&#128255;', r: 'epic', pct: 75, lvl: 'LVL 7' },
  { n: 'SQL Server', ico: '&#128451;', r: 'rare', pct: 72, lvl: 'LVL 6' },
  { n: 'Entity Framework', ico: '&#128209;', r: 'rare', pct: 70, lvl: 'LVL 6' },
  { n: 'Azure', ico: '&#9729;&#65039;', r: 'rare', pct: 55, lvl: 'LVL 4' },
  { n: 'Docker', ico: '&#128051;', r: 'common', pct: 50, lvl: 'LVL 4' },
  { n: 'Kotlin', ico: '&#128241;', r: 'rare', pct: 65, lvl: 'LVL 5' },
  { n: 'Python', ico: '&#128013;', r: 'common', pct: 55, lvl: 'LVL 4' },
  { n: 'Clean Arch', ico: '&#127963;', r: 'epic', pct: 74, lvl: 'LVL 7' },
  { n: 'JWT / Auth', ico: '&#128274;', r: 'rare', pct: 68, lvl: 'LVL 5' },
  { n: 'Git', ico: '&#127760;', r: 'epic', pct: 80, lvl: 'LVL 7' },
  { n: 'AI Agents', ico: '&#129302;', r: 'rare', pct: 45, lvl: 'LVL 3' },
  { n: 'Node.js', ico: '&#128312;', r: 'common', pct: 48, lvl: 'LVL 3' },
  { n: 'Saxofon', ico: '&#127927;', r: 'legendary', pct: 90, lvl: 'LVL MAX' }
];

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first', ico: '&#127381;', n: 'PRIMER CLICK', d: 'Interactuaste por primera vez', u: false },
  { id: 'coins10', ico: '&#129689;', n: 'COLECCIONISTA', d: '10 monedas recolectadas', u: false },
  { id: 'score1k', ico: '&#11088;', n: 'HIGH SCORE', d: '1000 puntos alcanzados', u: false },
  { id: 'combo5', ico: '&#9889;', n: 'COMBO MASTER', d: 'Combo x5 activado', u: false },
  { id: 'boss', ico: '&#128293;', n: 'BOSS SLAYER', d: 'Boss derrotado', u: false },
  { id: 'inv', ico: '&#127922;', n: 'INVENTARIO ABIERTO', d: 'Revisaste tus skills', u: false },
  { id: 'contact', ico: '&#128172;', n: 'CO-OP INICIADO', d: 'Enviaste un mensaje', u: false },
  { id: 'night', ico: '&#127769;', n: 'BUHO NOCTURNO', d: 'Visitaste de noche', u: false },
  { id: 'blocks5', ico: '&#128310;', n: 'ROMPE BLOQUES', d: '5 bloques golpeados', u: false },
  { id: 'allworlds', ico: '&#127942;', n: 'MAESTRO DEL REINO', d: 'Visitaste todos los worlds', u: false }
];

const BOSS_QS: BossQuestion[] = [
  { q: 'Cual es el stack principal de Daniel?', opts: ['React + Django', 'Vue + Laravel', '.NET 8 + Angular 21', 'Flutter + Firebase'], a: 2 },
  { q: 'Donde tuvo su pasantia Daniel?', opts: ['Freelance', 'Amazon Panama', 'LogicStudio Panama', 'Google LATAM'], a: 2 },
  { q: 'Cual arquitectura usa Daniel en backend?', opts: ['Monolitica sin patrones', 'Microservicios con Spring', 'Clean Architecture (Onion)', 'MVC simple sin SOLID'], a: 2 },
  { q: 'Cual es el hobby musical de Daniel?', opts: ['Guitarra', 'Piano', 'Bateria', 'Saxofon'], a: 3 },
  { q: 'En que universidad estudia Daniel?', opts: ['USMA', 'UP', 'UTP Sede Cocle', 'OTEIMA'], a: 2 }
];
let bossHp = 5;
let bossAnswered = 0;

/* ===================== CURSOR ===================== */
let cur: HTMLElement | null = null;
document.addEventListener('mousemove', (e: MouseEvent) => {
  const el = cur;
  if (!el) return;
  el.style.left = `${e.clientX}px`;
  el.style.top = `${e.clientY}px`;
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
  tmrInt = setInterval(() => {
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
  playSound('coin');
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
  playSound('sel');
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
function legacyInit(): void {
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
  ic.addEventListener('click', () => { dismiss(); playSound('coin'); });
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
  buildViz();
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
  playSound('lvlup');
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
    d.setAttribute('draggable', 'true');
    d.innerHTML = `<div class="rb ${s.r}">${s.r.toUpperCase()}</div><span class="itm-ico">${s.ico}</span><div class="itm-n">${s.n}</div><div class="itm-bar"><div class="itm-fill" style="width:${s.pct}%"></div></div><div class="itm-lvl">${s.lvl}</div>`;
    d.addEventListener('dragstart', (e: DragEvent) => {
      if (e.dataTransfer) e.dataTransfer.setData('text', s.n);
      playSound('sel');
    });
    g.appendChild(d);
  });
}

export function openInv(): void {
  const inv = byId<HTMLDivElement>('inv');
  if (!inv) return;
  inv.classList.add('open');
  playSound('lvlup');
  unlockAch('inv');
}

export function closeInv(): void {
  const inv = byId<HTMLDivElement>('inv');
  if (!inv) return;
  inv.classList.remove('open');
}

/* ===================== PROJECT MAP ===================== */
export function openPm(i: number): void {
  const p = PROJECTS[i];
  if (!p) return;
  const pmW = byId<HTMLSpanElement>('pm-w');
  const pmT = byId<HTMLSpanElement>('pm-t');
  const pmD = byId<HTMLParagraphElement>('pm-d');
  const tags = byId<HTMLDivElement>('pm-tags');
  const demo = byId<HTMLAnchorElement>('pm-demo');
  const gh = byId<HTMLAnchorElement>('pm-gh');
  const pm = byId<HTMLDivElement>('pm');
  if (!pmW || !pmT || !pmD || !tags || !demo || !gh || !pm) return;
  pmW.textContent = p.w;
  pmT.textContent = p.t;
  pmD.textContent = p.d;
  tags.innerHTML = '';
  p.tags.forEach((t) => {
    const s = document.createElement('span');
    s.className = 'pm-tag';
    s.textContent = t;
    tags.appendChild(s);
  });
  demo.href = p.demo;
  gh.href = p.gh;
  pm.classList.add('open');
  playSound('sel');
  addScore(200);
}

export function closePm(): void {
  const pm = byId<HTMLDivElement>('pm');
  if (!pm) return;
  pm.classList.remove('open');
}

/* ===================== BOSS FIGHT ===================== */
function buildBoss(): void {
  const container = byId<HTMLDivElement>('bqs');
  if (!container) return;
  container.innerHTML = '';
  BOSS_QS.forEach((q, qi) => {
    const div = document.createElement('div');
    div.className = 'bq';
    let opts = '';
    q.opts.forEach((o, oi) => {
      opts += `<button class="bopt" onclick="answerBoss(${qi},${oi},${q.a},this)">${String.fromCharCode(65 + oi)}) ${o}</button>`;
    });
    div.innerHTML = `<div class="bq-t">${q.q}</div><div class="bopts">${opts}</div>`;
    container.appendChild(div);
  });
}

export function answerBoss(qi: number, picked: number, correct: number, btn: HTMLButtonElement): void {
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
    msg.textContent = 'RESPUESTA CORRECTA! -1 HP';
    msg.style.color = 'var(--green)';
    addScore(500);
    playSound('coin');
    bossAnswered++;
    if (bossHp <= 0) {
      setTimeout(() => {
        const bres = byId<HTMLDivElement>('bres');
        if (bres) bres.classList.add('show');
        unlockAch('boss');
        coinRain();
        addScore(5000);
        playSound('lvlup');
      }, 800);
    }
  } else {
    btn.className = 'bopt ng';
    const opts = bq.querySelectorAll<HTMLButtonElement>('.bopt');
    if (opts[correct]) opts[correct].className = 'bopt ok';
    msg.textContent = `INCORRECTO. La respuesta era: ${String.fromCharCode(65 + correct)}`;
    msg.style.color = 'var(--red)';
    playSound('sel');
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
  playSound('sel');
}

/* ===================== CONTACT FORM ===================== */
export function sendForm(e: Event): void {
  e.preventDefault();
  const btn = byId<HTMLButtonElement>('sbtn');
  if (!btn) return;
  btn.textContent = 'MISION RECIBIDA!';
  btn.style.background = 'var(--green)';
  addScore(1000);
  playSound('lvlup');
  unlockAch('contact');
  coinRain();
  setTimeout(() => {
    btn.textContent = 'ENVIAR MISION';
    btn.style.background = 'var(--gold)';
  }, 3000);
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
  document.querySelectorAll<HTMLElement>('a,.btn,.wb,.hbtn,.mn,.itm,.bopt').forEach((el) => {
    el.addEventListener('mouseenter', () => { playSound('hov'); });
  });
}

/* ===================== MINIGAME ===================== */
const gcv = byId<HTMLCanvasElement>('gc');
const gctx = gcv ? gcv.getContext('2d') : null;
let gameOn = false;
let gsc = 0;
let ghi = 0;
let gaf: number | null = null;
const gp = { x: 70, y: 148, vy: 0, ground: true, w: 22, h: 26 };
let genms: Array<{ x: number; y: number; w: number; h: number }> = [];
let gspd = 3;
let gframe = 0;
let gover = false;

export function openMg(): void {
  const mg = byId<HTMLDivElement>('mg');
  if (!mg) return;
  mg.classList.add('open');
  document.body.style.overflow = 'hidden';
  startMg();
  playSound('lvlup');
}

export function closeMg(): void {
  const mg = byId<HTMLDivElement>('mg');
  if (!mg) return;
  mg.classList.remove('open');
  document.body.style.overflow = '';
  gameOn = false;
  if (gaf !== null) cancelAnimationFrame(gaf);
}

function startMg(): void {
  gp.y = 148;
  gp.vy = 0;
  gp.ground = true;
  genms = [];
  gsc = 0;
  gspd = 3;
  gframe = 0;
  gover = false;
  gameOn = true;
  mgLoop();
}

function mgJump(): void {
  if (gp.ground && !gover) {
    gp.vy = -13;
    gp.ground = false;
    playSound('hov');
  }
  if (gover) startMg();
}

document.addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    const mg = byId<HTMLDivElement>('mg');
    if (mg && mg.classList.contains('open')) {
      e.preventDefault();
      mgJump();
    }
  }
  if (e.code === 'Escape') {
    const mg = byId<HTMLDivElement>('mg');
    const inv = byId<HTMLDivElement>('inv');
    const pm = byId<HTMLDivElement>('pm');
    const ws = byId<HTMLDivElement>('ws');
    if (mg && mg.classList.contains('open')) closeMg();
    if (inv && inv.classList.contains('open')) closeInv();
    if (pm && pm.classList.contains('open')) closePm();
    if (ws && ws.classList.contains('open')) closeWS();
  }
});
if (gcv) gcv.addEventListener('click', mgJump);

function drawDev(x: number, y: number): void {
  if (!gctx) return;
  gctx.fillStyle = '#3382F6'; gctx.fillRect(x + 3, y, 14, 5);
  gctx.fillStyle = '#ffe0b0'; gctx.fillRect(x + 2, y + 5, 18, 7);
  gctx.fillStyle = '#1a1a2e'; gctx.fillRect(x + 5, y + 7, 3, 3); gctx.fillRect(x + 14, y + 7, 3, 3);
  gctx.fillStyle = '#3382F6'; gctx.fillRect(x + 2, y + 12, 18, 8);
  gctx.fillStyle = '#512BD4'; gctx.fillRect(x + 5, y + 13, 5, 7); gctx.fillRect(x + 12, y + 13, 5, 7);
  gctx.fillStyle = '#222'; gctx.fillRect(x + 4, y + 20, 6, 4); gctx.fillRect(x + 12, y + 20, 6, 4);
}

function drawBug(bx: number, by: number): void {
  if (!gctx) return;
  gctx.fillStyle = '#d63031'; gctx.fillRect(bx + 4, by, 20, 6);
  gctx.fillStyle = '#800000'; gctx.fillRect(bx, by + 6, 28, 14);
  gctx.fillStyle = '#ff0'; gctx.fillRect(bx + 5, by + 8, 4, 4); gctx.fillRect(bx + 19, by + 8, 4, 4);
  gctx.fillStyle = '#d63031'; gctx.fillRect(bx + 8, by + 14, 12, 4);
  gctx.fillStyle = '#600000'; gctx.fillRect(bx + 4, by + 20, 8, 7); gctx.fillRect(bx + 16, by + 20, 8, 7);
}

function mgLoop(): void {
  if (!gameOn || !gctx) return;
  gctx.clearRect(0, 0, 620, 190);
  gctx.fillStyle = '#5c94fc'; gctx.fillRect(0, 0, 620, 160);
  gctx.fillStyle = '#c84c0c'; gctx.fillRect(0, 160, 620, 30);
  gctx.fillStyle = '#e06020'; gctx.fillRect(0, 160, 620, 5);
  if (!gover) {
    gframe++;
    gsc = Math.floor(gframe * gspd / 10);
    gspd = 3 + gframe / 350;
    const gs = byId<HTMLSpanElement>('gs');
    if (gs) gs.textContent = String(gsc);
    gp.vy += 0.75; gp.y += gp.vy;
    if (gp.y >= 148) { gp.y = 148; gp.vy = 0; gp.ground = true; }
    if (gframe % Math.max(55, 95 - Math.floor(gframe / 90)) === 0) genms.push({ x: 640, y: 130, w: 28, h: 28 });
    genms.forEach((e) => { e.x -= gspd; });
    genms = genms.filter((e) => e.x > -50);
    genms.forEach((e) => {
      if (gp.x + gp.w - 6 > e.x + 4 && gp.x + 6 < e.x + e.w - 4 && gp.y + gp.h - 3 > e.y + 4) {
        gover = true;
        if (gsc > ghi) {
          ghi = gsc;
          const gh = byId<HTMLSpanElement>('gh');
          if (gh) gh.textContent = String(ghi);
        }
        addScore(gsc);
      }
    });
    drawDev(gp.x, gp.y);
    genms.forEach((e) => { drawBug(e.x, e.y); });
    gctx.fillStyle = '#f8b800';
    gctx.font = '9px "Press Start 2P",monospace';
    gctx.fillText(`SCORE:${gsc}`, 8, 18);
    gctx.fillText(`HI:${ghi}`, 420, 18);
  } else {
    gctx.fillStyle = 'rgba(0,0,0,0.75)'; gctx.fillRect(0, 0, 620, 190);
    gctx.fillStyle = '#f8b800';
    gctx.font = '18px "Press Start 2P",monospace';
    gctx.textAlign = 'center'; gctx.fillText('GAME OVER', 310, 75);
    gctx.font = '8px "Press Start 2P",monospace';
    gctx.fillStyle = '#fff'; gctx.fillText(`SCORE: ${gsc}`, 310, 110);
    gctx.fillText('CLICK O ESPACIO PARA REINICIAR', 310, 145);
    gctx.textAlign = 'left';
  }
  gaf = requestAnimationFrame(mgLoop);
}

/* ===================== SOUND ENGINE ===================== */
function initAudio(): void {
  if (!audioCtx) {
    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioCtor();
    buildViz();
  }
}

function buildViz(): void {
  const v = byId<HTMLDivElement>('mviz');
  if (!v || vbars.length) return;
  for (let i = 0; i < 50; i++) {
    const b = document.createElement('div');
    b.className = 'vb';
    v.appendChild(b);
    vbars.push(b);
  }
}

function beep(f: number, d: number, t: OscillatorType = 'square', v = 0.1, dl = 0): void {
  if (!audioCtx || !sfxOn) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.connect(g);
  g.connect(audioCtx.destination);
  o.type = t;
  const ts = audioCtx.currentTime + dl;
  o.frequency.setValueAtTime(f, ts);
  g.gain.setValueAtTime(v, ts);
  g.gain.exponentialRampToValueAtTime(0.001, ts + d);
  o.start(ts);
  o.stop(ts + d + 0.01);
}

const SND: Record<string, () => void> = {
  coin: () => { beep(988, 0.05); beep(1319, 0.1, 'square', 0.1, 0.06); },
  hov: () => { beep(440, 0.03, 'square', 0.04); },
  sel: () => { beep(523, 0.05, 'square', 0.07); },
  lvlup: () => { [523, 659, 784, 1047].forEach((f, i) => { beep(f, 0.09, 'square', 0.09, i * 0.08); }); }
};

function playSound(n: string): void {
  if (!sfxOn && n !== 'lvlup') return;
  initAudio();
  if (SND[n]) SND[n]();
}

const BGM_N: Array<[number, number]> = [
  [659, 0.15], [659, 0.15], [0, 0.15], [659, 0.15], [0, 0.15], [523, 0.15], [659, 0.15], [784, 0.3], [0, 0.3], [392, 0.3],
  [523, 0.3], [0, 0.15], [392, 0.3], [0, 0.15], [330, 0.3], [0, 0.15], [440, 0.3], [494, 0.15], [466, 0.15], [440, 0.3],
  [392, 0.22], [659, 0.22], [784, 0.22], [880, 0.3], [698, 0.15], [784, 0.15], [0, 0.15], [659, 0.3], [523, 0.15], [587, 0.15], [494, 0.3]
];

function playBGM(): void {
  if (!audioCtx || bgmOn) return;
  const ctx = audioCtx;
  bgmOn = true;
  const loop = () => {
    if (!bgmOn) return;
    let t = ctx.currentTime + 0.05;
    let tot = 0;
    BGM_N.forEach((n) => {
      if (n[0] > 0) beep(n[0], n[1] * 0.88, 'square', 0.05, t - ctx.currentTime);
      t += n[1];
      tot += n[1];
    });
    bgmTmr = setTimeout(loop, tot * 1000 + 120);
  };
  loop();
  const vl = () => {
    if (!bgmOn) return;
    vbars.forEach((b) => {
      const h = 3 + Math.random() * 28;
      b.style.height = `${h}px`;
      b.style.background = `hsl(${Math.random() * 60 + 30},100%,50%)`;
    });
    vizTmr = setTimeout(vl, 90);
  };
  vl();
}

function stopBGM(): void {
  bgmOn = false;
  if (bgmTmr) clearTimeout(bgmTmr);
  if (vizTmr) clearTimeout(vizTmr);
  vbars.forEach((b) => {
    b.style.height = '3px';
    b.style.background = 'var(--gold)';
  });
}

export function toggleSfx(): void {
  initAudio();
  sfxOn = !sfxOn;
  const btn = byId<HTMLButtonElement>('sfxbtn');
  const viz = byId<HTMLDivElement>('mviz');
  if (!btn || !viz) return;
  if (sfxOn) {
    btn.textContent = 'SFX ON';
    btn.classList.add('active');
    viz.classList.add('on');
    playBGM();
  } else {
    btn.textContent = 'SFX';
    btn.classList.remove('active');
    viz.classList.remove('on');
    stopBGM();
  }
}

/* ===================== DARK MODE ===================== */
let dmOn = false;
export function toggleDM(): void {
  dmOn = !dmOn;
  document.body.classList.toggle('dark-mode', dmOn);
  const btn = byId<HTMLButtonElement>('dm-btn');
  if (btn) btn.textContent = dmOn ? '\u2600\uFE0F DIA' : '\u263E NOCHE';
  if (dmOn) {
    document.querySelectorAll<HTMLElement>('.sky-l,.cloud-row,.hill-row,.plat-row,.gnd').forEach((el) => {
      el.style.filter = 'hue-rotate(200deg) brightness(0.3)';
    });
    const hero = byId<HTMLDivElement>('hero');
    if (hero) hero.style.background = '#0a0a20';
    if (!byId<HTMLDivElement>('stars-layer')) {
      const sl = document.createElement('div');
      sl.id = 'stars-layer';
      sl.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;';
      for (let i = 0; i < 80; i++) {
        const s = document.createElement('div');
        s.style.cssText = `position:absolute;width:2px;height:2px;background:#fff;left:${Math.random() * 100}%;top:${Math.random() * 60}%;opacity:${0.3 + Math.random() * 0.7};${Math.random() > 0.5 ? `animation:blink ${1 + Math.random() * 2}s step-end infinite;` : ''}`;
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
  playSound('sel');
}

/* ===================== ALDEANOS FORM ===================== */
export function submitAld(e: Event): void {
  e.preventDefault();
  const name = byId<HTMLInputElement>('ald-name')?.value ?? '';
  const role = byId<HTMLInputElement>('ald-role')?.value || 'Visitante';
  const msg = byId<HTMLTextAreaElement>('ald-msg-inp')?.value ?? '';
  if (!name || !msg) return;
  const colors = ['#3382F6', '#f8b800', '#00b300', '#a040ff', '#d63031'];
  const col = colors[Math.floor(Math.random() * colors.length)];
  const card = document.createElement('div');
  card.className = 'ald-card rev on';
  card.style.borderColor = col;
  card.innerHTML = `<div class="ald-hdr"><div class="ald-ava"><svg width="52" height="52" viewBox="0 0 20 20" style="image-rendering:pixelated"><rect x="6" y="0" width="8" height="2" fill="${col}"/><rect x="4" y="2" width="12" height="4" fill="${col}"/><rect x="3" y="6" width="14" height="6" fill="#ffe0b0"/><rect x="5" y="8" width="2" height="2" fill="#222"/><rect x="13" y="8" width="2" height="2" fill="#222"/><rect x="3" y="12" width="14" height="6" fill="${col}"/></svg></div><div class="ald-info"><div class="ald-name">${name.toUpperCase().substring(0, 18)}</div><div class="ald-role">${role.toUpperCase().substring(0, 20)}</div><div class="ald-rel">VISITANTE</div></div></div><div class="ald-quote">${msg.substring(0, 200)}</div><div class="ald-stars">&#11088;&#11088;&#11088;&#11088;&#11088;</div>`;
  const grid = byId<HTMLDivElement>('ald-grid');
  if (grid) grid.appendChild(card);
  const msgEl = byId<HTMLDivElement>('ald-msg');
  if (msgEl) msgEl.textContent = `TESTIMONIO AGREGADO! GRACIAS, ${name.toUpperCase()}!`;
  const nameEl = byId<HTMLInputElement>('ald-name');
  const roleEl = byId<HTMLInputElement>('ald-role');
  const msgInp = byId<HTMLTextAreaElement>('ald-msg-inp');
  if (nameEl) nameEl.value = '';
  if (roleEl) roleEl.value = '';
  if (msgInp) msgInp.value = '';
  addScore(500); playSound('lvlup'); coinRain();
  setTimeout(() => { if (msgEl) msgEl.textContent = ''; }, 3000);
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
  addScore(9999); coinRain(); playSound('lvlup');
}

export function closeKonami(): void {
  const el = byId<HTMLDivElement>('konami-screen');
  if (el) el.classList.remove('show');
}

/* ===================== CV PDF DOWNLOAD ===================== */
export function downloadCV(): void {
  const cvContent = 'DANIEL CARRASCO\n'
    + 'Software Developer | .NET & Angular\n'
    + 'dsotillo20@gmail.com | github.com/DanielC-04\nPanama\n\n'
    + '== EXPERIENCIA ==\n'
    + 'Desarrollador de Software - Pasantia\n'
    + 'LogicStudio | Panama | 2024-2025\n'
    + '.NET 8 + Angular 21, Clean Architecture, JWT, Azure Entra ID, SQL Server\n\n'
    + '== EDUCACION ==\n'
    + 'Ing. en Sistemas de Informacion (4to ano)\n'
    + 'Universidad Tecnologica de Panama - Sede Cocle | 2020-Presente\n\n'
    + '== SKILLS PRINCIPALES ==\n'
    + 'C# / .NET 8 / Angular 21 / TypeScript / SQL Server / Entity Framework\n'
    + 'Clean Architecture / JWT / Azure / Docker / Kotlin / Python / Git\n\n'
    + '== CONTACTO ==\n'
    + 'Email: dsotillo20@gmail.com\n'
    + 'GitHub: github.com/DanielC-04';
  const blob = new Blob([cvContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Daniel_Carrasco_CV.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  addScore(300); playSound('coin');
  const btn = byId<HTMLButtonElement>('cv-btn');
  if (btn) {
    btn.textContent = 'DESCARGADO!';
    setTimeout(() => { btn.textContent = 'DESCARGAR CV'; }, 2000);
  }
}

export function initLegacy(): void {
  legacyInit();
  cur = byId<HTMLElement>('cur');
  setTimeout(() => {
    setupRevealAndTracking();
    setupHoverSounds();
  }, 0);
}
