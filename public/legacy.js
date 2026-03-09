/* ===================== STATE ===================== */
var SC = 0, CO = 0, sfxOn = false, achOpen = false;
var audioCtx = null, bgmOn = false, bgmTmr = null, vizTmr = null;
var tmr = 300, tmrInt = null;
var comboCount = 0, comboTmr = null, comboMult = 1;
var blocksHit = 0, sectSeen = {};
var vbars = [];

/* ===================== DATA ===================== */
var PROJECTS = [
  { w: 'WORLD 5-1', t: 'API REST .NET', d: 'Web API con .NET 8 y ASP.NET Core. Clean Architecture (Onion), patron Repository, JWT auth y Entity Framework Core con SQL Server.', tags: ['C#', '.NET 8', 'SQL Server', 'JWT', 'EF Core'], demo: '#', gh: 'https://github.com/DanielC-04' },
  { w: 'WORLD 5-2', t: 'APP ANDROID BLE', d: 'Aplicacion Android nativa con Kotlin. Comunicacion BLE con beacons FeasyBeacon, geolocalización indoor, Foreground Services y notificaciones sin internet.', tags: ['Kotlin', 'Android', 'BLE', 'Beacons', 'IoT'], demo: '#', gh: 'https://github.com/DanielC-04' },
  { w: 'WORLD 5-3', t: 'ANGULAR 21 APP', d: 'Frontend con Angular 21, TypeScript y RxJS. Componentes standalone, servicios, directivas personalizadas y consumo de APIs REST con manejo de estado reactivo.', tags: ['Angular 21', 'TypeScript', 'RxJS', 'Bootstrap'], demo: '#', gh: 'https://github.com/DanielC-04' },
  { w: 'CASTLE', t: 'FULL STACK .NET + ANGULAR', d: 'Aplicacion full-stack completa. Backend .NET 8 con Azure Entra ID, base de datos SQL Server en Azure. Frontend Angular integrado con Azure App Services.', tags: ['C#', '.NET 8', 'Angular', 'Azure', 'SQL Server', 'Docker'], demo: '#', gh: 'https://github.com/DanielC-04' }
];

var SKILLS = [
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

var ACHIEVEMENTS = [
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

var BOSS_QS = [
  { q: 'Cual es el stack principal de Daniel?', opts: ['React + Django', 'Vue + Laravel', '.NET 8 + Angular 21', 'Flutter + Firebase'], a: 2 },
  { q: 'Donde tuvo su pasantia Daniel?', opts: ['Freelance', 'Amazon Panama', 'LogicStudio Panama', 'Google LATAM'], a: 2 },
  { q: 'Cual arquitectura usa Daniel en backend?', opts: ['Monolitica sin patrones', 'Microservicios con Spring', 'Clean Architecture (Onion)', 'MVC simple sin SOLID'], a: 2 },
  { q: 'Cual es el hobby musical de Daniel?', opts: ['Guitarra', 'Piano', 'Bateria', 'Saxofon'], a: 3 },
  { q: 'En que universidad estudia Daniel?', opts: ['USMA', 'UP', 'UTP Sede Cocle', 'OTEIMA'], a: 2 }
];
var bossHp = 5, bossAnswered = 0;

/* ===================== CURSOR ===================== */
var cur = document.getElementById('cur');
document.addEventListener('mousemove', function (e) { cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px'; });

/* ===================== PROGRESS BAR ===================== */
window.addEventListener('scroll', function () {
  var h = document.documentElement;
  var pct = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
  document.getElementById('pb').style.width = pct + '%';
  spawnScrollParticles();
});

/* ===================== TIMER ===================== */
function startTimer() {
  tmrInt = setInterval(function () {
    if (tmr > 0) { tmr--; document.getElementById('ti').textContent = tmr; }
  }, 1000);
}

/* ===================== SCORE / COINS ===================== */
function addScore(pts) {
  var total = pts * comboMult;
  SC += total;
  document.getElementById('sc').textContent = pad6(SC);
  if (SC >= 1000) unlockAch('score1k');
}
function addCoin() {
  CO++;
  document.getElementById('co').textContent = CO < 10 ? '0' + CO : '' + CO;
  if (CO >= 10) unlockAch('coins10');
}
function pad6(n) { return ('000000' + n).slice(-6); }

/* ===================== COMBO SYSTEM ===================== */
function registerClick() {
  clearTimeout(comboTmr);
  comboCount++;
  comboMult = Math.min(comboCount, 8);
  document.getElementById('cmult').textContent = comboMult;
  document.getElementById('cm').textContent = 'x' + comboMult;
  if (comboMult >= 2) {
    var el = document.getElementById('combo');
    el.querySelector('#cmult').textContent = comboMult;
    el.classList.add('show');
    setTimeout(function () { el.classList.remove('show'); }, 900);
  }
  if (comboMult >= 5) unlockAch('combo5');
  comboTmr = setTimeout(function () { comboCount = 0; comboMult = 1; document.getElementById('cm').textContent = 'x1'; }, 1800);
}

/* ===================== POPUPS ===================== */
function spawnCoin(x, y) {
  var el = document.createElement('div');
  el.className = 'cpop';
  el.innerHTML = '&#129689;';
  el.style.left = x + 'px';
  el.style.top = (y + window.scrollY) + 'px';
  document.body.appendChild(el);
  setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 700);
  addCoin();
}
function spawnPts(pts, x, y) {
  var el = document.createElement('div');
  el.className = 'ppop';
  el.textContent = '+' + pts * (comboMult > 1 ? comboMult : 1);
  el.style.left = x + 'px';
  el.style.top = (y + window.scrollY - 16) + 'px';
  document.body.appendChild(el);
  setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 550);
}

/* ===================== PIXEL PARTICLES (on scroll) ===================== */
var lastScroll = 0, pThrottle = false;
function spawnScrollParticles() {
  if (pThrottle) return;
  pThrottle = true;
  setTimeout(function () { pThrottle = false; }, 120);
  var colors = ['#f8b800', '#3382F6', '#512BD4', '#00b300', '#d63031'];
  for (var i = 0; i < 3; i++) {
    var p = document.createElement('div');
    p.className = 'pxp';
    p.style.left = Math.random() * window.innerWidth + 'px';
    p.style.top = Math.random() * window.innerHeight + 'px';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDuration = (0.5 + Math.random() * 0.5) + 's';
    document.body.appendChild(p);
    setTimeout(function (el) { if (el.parentNode) el.parentNode.removeChild(el); }, 950, p);
  }
}

/* ===================== COIN RAIN ===================== */
function coinRain() {
  for (var i = 0; i < 40; i++) {
    (function (delay) {
      setTimeout(function () {
        var c = document.createElement('div');
        c.className = 'rainc';
        c.innerHTML = '&#129689;';
        c.style.left = Math.random() * 100 + 'vw';
        c.style.top = '-40px';
        c.style.animationDuration = (2 + Math.random() * 2) + 's';
        document.body.appendChild(c);
        setTimeout(function () { if (c.parentNode) c.parentNode.removeChild(c); }, 4000);
      }, delay);
    })(i * 80);
  }
}

/* ===================== Q-BLOCK HIT ===================== */
function hitQ(el, pts) {
  registerClick();
  var rect = el.getBoundingClientRect();
  var cx = rect.left + rect.width / 2, cy = rect.top;
  spawnCoin(cx, cy);
  spawnPts(pts, cx, cy);
  addScore(pts);
  playSound('coin');
  el.style.transform = 'translateY(-16px)';
  setTimeout(function () { el.style.transform = ''; }, 160);
  blocksHit++;
  if (blocksHit >= 5) unlockAch('blocks5');
  unlockAch('first');
}

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('hq') || e.target.classList.contains('qb')) return;
  if (e.target.closest('a') || e.target.closest('button') || e.target.closest('form')) return;
  registerClick();
  addScore(5);
  unlockAch('first');
});

/* ===================== WORLD SELECT ===================== */
function openWS() { document.getElementById('ws').classList.add('open'); playSound('sel'); }
function closeWS() { document.getElementById('ws').classList.remove('open'); }
function goSec(id) { var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); }

/* ===================== INSERT COIN ===================== */
function legacyInit() {
  var ic = document.getElementById('ic');
  function dismiss() {
    ic.style.transition = 'opacity 0.5s';
    ic.style.opacity = '0';
    setTimeout(function () { ic.style.display = 'none'; showLT('WORLD 1-1', 'INICIO'); }, 500);
  }
  setTimeout(dismiss, 2800);
  ic.addEventListener('click', function () { dismiss(); playSound('coin'); });
  document.addEventListener('keydown', function k() { dismiss(); document.removeEventListener('keydown', k); }, { once: true });

  var h = new Date().getHours();
  if (h >= 22 || h < 6) setTimeout(function () { unlockAch('night'); }, 3200);

  startTimer();
  buildAch();
  buildViz();
  buildInv();
  buildBoss();
}

if (document.readyState === 'complete') {
  legacyInit();
} else {
  window.addEventListener('load', legacyInit);
}

/* ===================== LEVEL TRANSITION ===================== */
function showLT(w, n) {
  var el = document.getElementById('lt');
  document.getElementById('lt-w').textContent = w;
  document.getElementById('lt-n').textContent = n;
  el.classList.add('show');
  playSound('lvlup');
  setTimeout(function () { el.classList.remove('show'); }, 2000);
}

/* ===================== INVENTORY ===================== */
function buildInv() {
  var g = document.getElementById('inv-grid');
  g.innerHTML = '';
  SKILLS.forEach(function (s) {
    var d = document.createElement('div');
    d.className = 'itm ' + s.r;
    d.setAttribute('draggable', 'true');
    d.innerHTML = '<div class="rb ' + s.r + '">' + s.r.toUpperCase() + '</div><span class="itm-ico">' + s.ico + '</span><div class="itm-n">' + s.n + '</div><div class="itm-bar"><div class="itm-fill" style="width:' + s.pct + '%"></div></div><div class="itm-lvl">' + s.lvl + '</div>';
    d.addEventListener('dragstart', function (e) { e.dataTransfer.setData('text', s.n); playSound('sel'); });
    g.appendChild(d);
  });
}
function openInv() { document.getElementById('inv').classList.add('open'); playSound('lvlup'); unlockAch('inv'); }
function closeInv() { document.getElementById('inv').classList.remove('open'); }

/* ===================== PROJECT MAP ===================== */
function openPm(i) {
  var p = PROJECTS[i];
  document.getElementById('pm-w').textContent = p.w;
  document.getElementById('pm-t').textContent = p.t;
  document.getElementById('pm-d').textContent = p.d;
  var tags = document.getElementById('pm-tags');
  tags.innerHTML = '';
  p.tags.forEach(function (t) { var s = document.createElement('span'); s.className = 'pm-tag'; s.textContent = t; tags.appendChild(s); });
  document.getElementById('pm-demo').href = p.demo;
  document.getElementById('pm-gh').href = p.gh;
  document.getElementById('pm').classList.add('open');
  playSound('sel');
  addScore(200);
}
function closePm() { document.getElementById('pm').classList.remove('open'); }

/* ===================== BOSS FIGHT ===================== */
function buildBoss() {
  var container = document.getElementById('bqs');
  container.innerHTML = '';
  BOSS_QS.forEach(function (q, qi) {
    var div = document.createElement('div');
    div.className = 'bq';
    var opts = '';
    q.opts.forEach(function (o, oi) {
      opts += '<button class="bopt" onclick="answerBoss(' + qi + ',' + oi + ',' + q.a + ',this)">' + String.fromCharCode(65 + oi) + ') ' + o + '</button>';
    });
    div.innerHTML = '<div class="bq-t">' + q.q + '</div><div class="bopts">' + opts + '</div>';
    container.appendChild(div);
  });
}
function answerBoss(qi, picked, correct, btn) {
  var bq = btn.closest('.bq');
  bq.querySelectorAll('.bopt').forEach(function (b) { b.style.pointerEvents = 'none'; });
  var msg = document.getElementById('bmsg');
  if (picked === correct) {
    btn.className = 'bopt ok';
    bossHp--;
    var pct = Math.max(0, (bossHp / 5) * 100);
    document.getElementById('bhpf').style.width = pct + '%';
    document.getElementById('bhpl').textContent = 'HP: ' + bossHp + ' / 5';
    msg.textContent = 'RESPUESTA CORRECTA! -1 HP';
    msg.style.color = 'var(--green)';
    addScore(500);
    playSound('coin');
    bossAnswered++;
    if (bossHp <= 0) {
      setTimeout(function () {
        document.getElementById('bres').classList.add('show');
        unlockAch('boss');
        coinRain();
        addScore(5000);
        playSound('lvlup');
      }, 800);
    }
  } else {
    btn.className = 'bopt ng';
    bq.querySelectorAll('.bopt')[correct].className = 'bopt ok';
    msg.textContent = 'INCORRECTO. La respuesta era: ' + String.fromCharCode(65 + correct);
    msg.style.color = 'var(--red)';
    playSound('sel');
  }
  setTimeout(function () { msg.textContent = ''; }, 2500);
}

/* ===================== ACHIEVEMENTS ===================== */
function buildAch() {
  var l = document.getElementById('achl');
  l.innerHTML = '';
  ACHIEVEMENTS.forEach(function (a) {
    var d = document.createElement('div');
    d.className = 'ai ' + (a.u ? 'unlocked' : 'locked');
    d.id = 'a-' + a.id;
    d.innerHTML = '<div class="ai-i">' + a.ico + '</div><div><div class="ai-n">' + a.n + '</div><div class="ai-d">' + a.d + '</div></div>';
    l.appendChild(d);
  });
}
function unlockAch(id) {
  var a = ACHIEVEMENTS.find(function (x) { return x.id === id; });
  if (!a || a.u) return;
  a.u = true;
  var el = document.getElementById('a-' + id);
  if (el) el.className = 'ai unlocked';
  document.getElementById('ati').innerHTML = a.ico;
  document.getElementById('atn').textContent = a.n;
  var t = document.getElementById('acht');
  t.classList.add('show');
  setTimeout(function () { t.classList.remove('show'); }, 3200);
  addScore(800);
  var allSecs = ['story', 'about', 'cvsec', 'skillsec', 'mapsec', 'bosssec'];
  if (allSecs.every(function (s) { return sectSeen[s]; })) unlockAch('allworlds');
}
function toggleAch() {
  achOpen = !achOpen;
  document.getElementById('achp').classList.toggle('open', achOpen);
  playSound('sel');
}

/* ===================== CONTACT FORM ===================== */
function sendForm(e) {
  e.preventDefault();
  var btn = document.getElementById('sbtn');
  btn.textContent = 'MISION RECIBIDA!';
  btn.style.background = 'var(--green)';
  addScore(1000);
  playSound('lvlup');
  unlockAch('contact');
  coinRain();
  setTimeout(function () { btn.textContent = 'ENVIAR MISION'; btn.style.background = 'var(--gold)'; }, 3000);
}

/* ===================== SCROLL REVEAL + SECTION TRACKING ===================== */
var revObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) { entry.target.classList.add('on'); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.rev').forEach(function (el) { revObs.observe(el); });

var slObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      var lines = entry.target.querySelectorAll('.sl');
      lines.forEach(function (l, i) { setTimeout(function () { l.classList.add('on'); }, i * 200); });
    }
  });
}, { threshold: 0.2 });
var sw = document.querySelector('.sl-wrap');
if (sw) slObs.observe(sw);

var secObs = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting && entry.target.id) { sectSeen[entry.target.id] = true; }
  });
}, { threshold: 0.25 });
['story', 'about', 'cvsec', 'skillsec', 'mapsec', 'bosssec', 'testsec', 'consec'].forEach(function (id) {
  var el = document.getElementById(id);
  if (el) secObs.observe(el);
});

/* HOVER SOUNDS */
document.querySelectorAll('a,.btn,.wb,.hbtn,.mn,.itm,.bopt').forEach(function (el) {
  el.addEventListener('mouseenter', function () { playSound('hov'); });
});

/* ===================== MINIGAME ===================== */
var gcv = document.getElementById('gc');
var gctx = gcv.getContext('2d');
var gameOn = false, gsc = 0, ghi = 0, gaf = null;
var gp = { x: 70, y: 148, vy: 0, ground: true, w: 22, h: 26 };
var genms = [], gspd = 3, gframe = 0, gover = false;

function openMg() { document.getElementById('mg').classList.add('open'); document.body.style.overflow = 'hidden'; startMg(); playSound('lvlup'); }
function closeMg() { document.getElementById('mg').classList.remove('open'); document.body.style.overflow = ''; gameOn = false; cancelAnimationFrame(gaf); }
function startMg() { gp.y = 148; gp.vy = 0; gp.ground = true; genms = []; gsc = 0; gspd = 3; gframe = 0; gover = false; gameOn = true; mgLoop(); }
function mgJump() { if (gp.ground && !gover) { gp.vy = -13; gp.ground = false; playSound('hov'); } if (gover) startMg(); }

document.addEventListener('keydown', function (e) {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    if (document.getElementById('mg').classList.contains('open')) { e.preventDefault(); mgJump(); }
  }
  if (e.code === 'Escape') {
    if (document.getElementById('mg').classList.contains('open')) closeMg();
    if (document.getElementById('inv').classList.contains('open')) closeInv();
    if (document.getElementById('pm').classList.contains('open')) closePm();
    if (document.getElementById('ws').classList.contains('open')) closeWS();
  }
});
gcv.addEventListener('click', mgJump);

function drawDev(x, y) {
  gctx.fillStyle = '#3382F6'; gctx.fillRect(x + 3, y, 14, 5);
  gctx.fillStyle = '#ffe0b0'; gctx.fillRect(x + 2, y + 5, 18, 7);
  gctx.fillStyle = '#1a1a2e'; gctx.fillRect(x + 5, y + 7, 3, 3); gctx.fillRect(x + 14, y + 7, 3, 3);
  gctx.fillStyle = '#3382F6'; gctx.fillRect(x + 2, y + 12, 18, 8);
  gctx.fillStyle = '#512BD4'; gctx.fillRect(x + 5, y + 13, 5, 7); gctx.fillRect(x + 12, y + 13, 5, 7);
  gctx.fillStyle = '#222'; gctx.fillRect(x + 4, y + 20, 6, 4); gctx.fillRect(x + 12, y + 20, 6, 4);
}
function drawBug(bx, by) {
  gctx.fillStyle = '#d63031'; gctx.fillRect(bx + 4, by, 20, 6);
  gctx.fillStyle = '#800000'; gctx.fillRect(bx, by + 6, 28, 14);
  gctx.fillStyle = '#ff0'; gctx.fillRect(bx + 5, by + 8, 4, 4); gctx.fillRect(bx + 19, by + 8, 4, 4);
  gctx.fillStyle = '#d63031'; gctx.fillRect(bx + 8, by + 14, 12, 4);
  gctx.fillStyle = '#600000'; gctx.fillRect(bx + 4, by + 20, 8, 7); gctx.fillRect(bx + 16, by + 20, 8, 7);
}
function mgLoop() {
  if (!gameOn) return;
  gctx.clearRect(0, 0, 620, 190);
  gctx.fillStyle = '#5c94fc'; gctx.fillRect(0, 0, 620, 160);
  gctx.fillStyle = '#c84c0c'; gctx.fillRect(0, 160, 620, 30);
  gctx.fillStyle = '#e06020'; gctx.fillRect(0, 160, 620, 5);
  if (!gover) {
    gframe++;
    gsc = Math.floor(gframe * gspd / 10);
    gspd = 3 + gframe / 350;
    document.getElementById('gs').textContent = gsc;
    gp.vy += 0.75; gp.y += gp.vy;
    if (gp.y >= 148) { gp.y = 148; gp.vy = 0; gp.ground = true; }
    if (gframe % Math.max(55, 95 - Math.floor(gframe / 90)) === 0) genms.push({ x: 640, y: 130, w: 28, h: 28 });
    genms.forEach(function (e) { e.x -= gspd; });
    genms = genms.filter(function (e) { return e.x > -50; });
    genms.forEach(function (e) {
      if (gp.x + gp.w - 6 > e.x + 4 && gp.x + 6 < e.x + e.w - 4 && gp.y + gp.h - 3 > e.y + 4) {
        gover = true;
        if (gsc > ghi) { ghi = gsc; document.getElementById('gh').textContent = ghi; }
        addScore(gsc);
      }
    });
    drawDev(gp.x, gp.y);
    genms.forEach(function (e) { drawBug(e.x, e.y); });
    gctx.fillStyle = '#f8b800';
    gctx.font = '9px "Press Start 2P",monospace';
    gctx.fillText('SCORE:' + gsc, 8, 18);
    gctx.fillText('HI:' + ghi, 420, 18);
  } else {
    gctx.fillStyle = 'rgba(0,0,0,0.75)'; gctx.fillRect(0, 0, 620, 190);
    gctx.fillStyle = '#f8b800';
    gctx.font = '18px "Press Start 2P",monospace';
    gctx.textAlign = 'center'; gctx.fillText('GAME OVER', 310, 75);
    gctx.font = '8px "Press Start 2P",monospace';
    gctx.fillStyle = '#fff'; gctx.fillText('SCORE: ' + gsc, 310, 110);
    gctx.fillText('CLICK O ESPACIO PARA REINICIAR', 310, 145);
    gctx.textAlign = 'left';
  }
  gaf = requestAnimationFrame(mgLoop);
}

/* ===================== SOUND ENGINE ===================== */
function initAudio() { if (!audioCtx) { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); buildViz(); } }
function buildViz() {
  var v = document.getElementById('mviz');
  if (vbars.length) return;
  for (var i = 0; i < 50; i++) { var b = document.createElement('div'); b.className = 'vb'; v.appendChild(b); vbars.push(b); }
}
function beep(f, d, t, v, dl) {
  if (!audioCtx || !sfxOn) return;
  t = t || 'square'; v = v || 0.1; dl = dl || 0;
  var o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.connect(g); g.connect(audioCtx.destination);
  o.type = t;
  var ts = audioCtx.currentTime + dl;
  o.frequency.setValueAtTime(f, ts);
  g.gain.setValueAtTime(v, ts);
  g.gain.exponentialRampToValueAtTime(0.001, ts + d);
  o.start(ts); o.stop(ts + d + 0.01);
}
var SND = {
  coin: function () { beep(988, 0.05); beep(1319, 0.1, 'square', 0.1, 0.06); },
  hov: function () { beep(440, 0.03, 'square', 0.04); },
  sel: function () { beep(523, 0.05, 'square', 0.07); },
  lvlup: function () { [523, 659, 784, 1047].forEach(function (f, i) { beep(f, 0.09, 'square', 0.09, i * 0.08); }); }
};
function playSound(n) { if (!sfxOn && n !== 'lvlup') return; initAudio(); if (SND[n]) SND[n](); }

var BGM_N = [[659, 0.15], [659, 0.15], [0, 0.15], [659, 0.15], [0, 0.15], [523, 0.15], [659, 0.15], [784, 0.3], [0, 0.3], [392, 0.3], [523, 0.3], [0, 0.15], [392, 0.3], [0, 0.15], [330, 0.3], [0, 0.15], [440, 0.3], [494, 0.15], [466, 0.15], [440, 0.3], [392, 0.22], [659, 0.22], [784, 0.22], [880, 0.3], [698, 0.15], [784, 0.15], [0, 0.15], [659, 0.3], [523, 0.15], [587, 0.15], [494, 0.3]];
function playBGM() {
  if (!audioCtx || bgmOn) return;
  bgmOn = true;
  function loop() {
    if (!bgmOn) return;
    var t = audioCtx.currentTime + 0.05, tot = 0;
    BGM_N.forEach(function (n) { if (n[0] > 0) beep(n[0], n[1] * 0.88, 'square', 0.05, t - audioCtx.currentTime); t += n[1]; tot += n[1]; });
    bgmTmr = setTimeout(loop, tot * 1000 + 120);
  }
  loop();
  function vl() {
    if (!bgmOn) return;
    vbars.forEach(function (b) { var h = 3 + Math.random() * 28; b.style.height = h + 'px'; b.style.background = 'hsl(' + (Math.random() * 60 + 30) + ',100%,50%)'; });
    vizTmr = setTimeout(vl, 90);
  }
  vl();
}
function stopBGM() { bgmOn = false; clearTimeout(bgmTmr); clearTimeout(vizTmr); vbars.forEach(function (b) { b.style.height = '3px'; b.style.background = 'var(--gold)'; }); }
function toggleSfx() {
  initAudio(); sfxOn = !sfxOn;
  var btn = document.getElementById('sfxbtn');
  var viz = document.getElementById('mviz');
  if (sfxOn) { btn.textContent = 'SFX ON'; btn.classList.add('active'); viz.classList.add('on'); playBGM(); }
  else { btn.textContent = 'SFX'; btn.classList.remove('active'); viz.classList.remove('on'); stopBGM(); }
}

/* ===================== DARK MODE ===================== */
var dmOn = false;
function toggleDM() {
  dmOn = !dmOn;
  document.body.classList.toggle('dark-mode', dmOn);
  var btn = document.getElementById('dm-btn');
  btn.textContent = dmOn ? '\u2600\uFE0F DIA' : '\u263E NOCHE';
  if (dmOn) {
    document.querySelectorAll('.sky-l,.cloud-row,.hill-row,.plat-row,.gnd').forEach(function (el) { el.style.filter = 'hue-rotate(200deg) brightness(0.3)'; });
    document.querySelector('#hero').style.background = '#0a0a20';
    if (!document.getElementById('stars-layer')) {
      var sl = document.createElement('div'); sl.id = 'stars-layer'; sl.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;';
      for (var i = 0; i < 80; i++) { var s = document.createElement('div'); s.style.cssText = 'position:absolute;width:2px;height:2px;background:#fff;left:' + Math.random() * 100 + '%;top:' + Math.random() * 60 + '%;opacity:' + (0.3 + Math.random() * 0.7) + ';' + (Math.random() > 0.5 ? 'animation:blink ' + (1 + Math.random() * 2) + 's step-end infinite;' : ''); sl.appendChild(s); }
      document.getElementById('hero').insertBefore(sl, document.getElementById('hero').firstChild);
    }
    document.getElementById('stars-layer').style.display = 'block';
  } else {
    document.querySelectorAll('.sky-l,.cloud-row,.hill-row,.plat-row,.gnd').forEach(function (el) { el.style.filter = ''; });
    document.querySelector('#hero').style.background = '';
    var sl = document.getElementById('stars-layer'); if (sl) sl.style.display = 'none';
  }
  playSound('sel');
}

/* ===================== ALDEANOS FORM ===================== */
function submitAld(e) {
  e.preventDefault();
  var name = document.getElementById('ald-name').value;
  var role = document.getElementById('ald-role').value || 'Visitante';
  var msg = document.getElementById('ald-msg-inp').value;
  if (!name || !msg) return;
  var colors = ['#3382F6', '#f8b800', '#00b300', '#a040ff', '#d63031'];
  var col = colors[Math.floor(Math.random() * colors.length)];
  var card = document.createElement('div');
  card.className = 'ald-card';
  card.style.borderColor = col;
  card.innerHTML = '<div class="ald-hdr"><div class="ald-ava"><svg width="52" height="52" viewBox="0 0 20 20" style="image-rendering:pixelated"><rect x="6" y="0" width="8" height="2" fill="' + col + '"/><rect x="4" y="2" width="12" height="4" fill="' + col + '"/><rect x="3" y="6" width="14" height="6" fill="#ffe0b0"/><rect x="5" y="8" width="2" height="2" fill="#222"/><rect x="13" y="8" width="2" height="2" fill="#222"/><rect x="3" y="12" width="14" height="6" fill="' + col + '"/></svg></div><div class="ald-info"><div class="ald-name">' + name.toUpperCase().substring(0, 18) + '</div><div class="ald-role">' + role.toUpperCase().substring(0, 20) + '</div><div class="ald-rel">VISITANTE</div></div></div><div class="ald-quote">' + msg.substring(0, 200) + '</div><div class="ald-stars">&#11088;&#11088;&#11088;&#11088;&#11088;</div>';
  document.getElementById('ald-grid').appendChild(card);
  document.getElementById('ald-msg').textContent = 'TESTIMONIO AGREGADO! GRACIAS, ' + name.toUpperCase() + '!';
  document.getElementById('ald-name').value = '';
  document.getElementById('ald-role').value = '';
  document.getElementById('ald-msg-inp').value = '';
  addScore(500); playSound('lvlup'); coinRain();
  setTimeout(function () { document.getElementById('ald-msg').textContent = ''; }, 3000);
}

/* ===================== KONAMI CODE ===================== */
var KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
var konamiIdx = 0;
document.addEventListener('keydown', function (e) {
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
function showKonami() {
  document.getElementById('konami-screen').classList.add('show');
  addScore(9999); coinRain(); playSound('lvlup');
}
function closeKonami() {
  document.getElementById('konami-screen').classList.remove('show');
}

/* ===================== CV PDF DOWNLOAD ===================== */
function downloadCV() {
  var cvContent = 'DANIEL CARRASCO\n' + 'Software Developer | .NET & Angular\n' + 'dsotillo20@gmail.com | github.com/DanielC-04\nPanama\n\n' + '== EXPERIENCIA ==\n' + 'Desarrollador de Software - Pasantia\nLogicStudio | Panama | 2024-2025\n.NET 8 + Angular 21, Clean Architecture, JWT, Azure Entra ID, SQL Server\n\n' + '== EDUCACION ==\n' + 'Ing. en Sistemas de Informacion (4to ano)\nUniversidad Tecnologica de Panama - Sede Cocle | 2020-Presente\n\n' + '== SKILLS PRINCIPALES ==\nC# / .NET 8 / Angular 21 / TypeScript / SQL Server / Entity Framework\nClean Architecture / JWT / Azure / Docker / Kotlin / Python / Git\n\n' + '== CONTACTO ==\nEmail: dsotillo20@gmail.com\nGitHub: github.com/DanielC-04';
  var blob = new Blob([cvContent], { type: 'text/plain' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href = url; a.download = 'Daniel_Carrasco_CV.txt';
  document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  addScore(300); playSound('coin');
  var btn = document.getElementById('cv-btn');
  if (btn) { btn.textContent = 'DESCARGADO!'; setTimeout(function () { btn.textContent = 'DESCARGAR CV'; }, 2000); }
}
