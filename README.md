# PortfolioDanielC

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:3382F6,100:512BD4&height=200&section=header&text=DEV.WORLD%20%E2%80%94%20Portfolio&fontSize=40&fontColor=fff&animation=fadeIn&fontAlignY=38&desc=Daniel%20Carrasco%20%7C%20Pixel%20Art%20%7C%20Interactive&descAlignY=55&descSize=18" width="100%"/>

# 🎮 DEV.WORLD — Portfolio de Daniel Carrasco

[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)]()
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)]()
[![Angular](https://img.shields.io/badge/Angular_21-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)]()

> Portfolio personal con estética **pixel art retro** inspirada en videojuegos clásicos.
> Un archivo HTML interactivo con minijuego, boss fight, inventario RPG y más.

[🕹️ Ver Demo](#) &nbsp;·&nbsp; [📬 Contacto](mailto:dsotillo20@gmail.com) &nbsp;·&nbsp; [💼 LinkedIn](https://linkedin.com/in/TU-USUARIO-LINKEDIN)

</div>

---

## 🖼️ Preview

```
╔══════════════════════════════════════╗
║  DEV.WORLD          SCORE: 001200    ║
║  ────────────────────────────────    ║
║         INSERT COIN TO PLAY          ║
║                                      ║
║   [?] [?] [!]   ↑↑↓↓←→←→BA = 👀   ║
╚══════════════════════════════════════╝
```

---

## ✨ Features

| Feature | Descripción |
|---|---|
| 🪙 **Insert Coin Screen** | Pantalla de inicio estilo arcade con barra de carga |
| 🗺️ **World Select** | Navegación entre secciones como mapa de mundos |
| 📜 **Historia Narrada** | Timeline animada contada por un narrador pixel art |
| 🎒 **Inventario RPG** | Skills clasificadas por rareza: Común / Raro / Épico / Legendario |
| 🗺️ **World Map** | Proyectos en un mapa con nodos clicables y rutas animadas |
| 🔥 **Boss Fight** | Quiz interactivo sobre el perfil del desarrollador |
| 👥 **Aldeanos** | Testimonios con 3 personajes + form para agregar nuevos |
| 📊 **GitHub Stats** | Tarjetas en vivo desde `github-profile-summary-cards` |
| 👾 **Minijuego Runner** | Esquiva bugs pixel art. Tiene hi-score |
| 🌙 **Modo Oscuro** | Toggle día/noche con estrellas animadas en el hero |
| 💾 **Descargar CV** | Genera y descarga el CV desde el browser |
| ⚡ **Combo System** | Multiplicador de puntos por clicks rápidos |
| 🪙 **Lluvia de Monedas** | Se activa al ganar el boss o enviar mensajes |
| 🏆 **10 Logros** | Sistema de achievements desbloqueables |
| 🎵 **BGM + Visualizador** | Música 8-bit con barras de visualización |
| 🕹️ **Easter Egg Konami** | ↑↑↓↓←→←→BA para activar modo secreto |
| 🎯 **Cursor Custom** | Cursor pixel art en forma de cruz dorada |
| 📈 **Barra de Progreso** | Scroll progress bar en la parte superior |

---

## 🗂️ Estructura

```
portfolio/
└── index.html          # Todo el portfolio en un solo archivo
```

> El portfolio está construido en **HTML/CSS/JS puro**, sin dependencias ni bundlers.
> Solo usa Google Fonts para las tipografías `Press Start 2P` y `VT323`.

---

## 🚀 Uso

### Opción 1 — Abrir directo

```bash
# Clona el repo
git clone https://github.com/DanielC-04/portfolio-devworld.git

# Abre el archivo en tu browser
open index.html
```

### Opción 2 — Live Server (recomendado)

```bash
# Con VS Code, instala la extensión Live Server
# Click derecho en index.html → "Open with Live Server"
```

---

## 🕹️ Easter Eggs

| Código | Efecto |
|---|---|
| `↑↑↓↓←→←→BA` | Activa el modo secreto Konami (+9999 pts) |
| Golpear 5 bloques `?` | Desbloquea el logro "Rompe Bloques" |
| Visitar de noche (22:00–06:00) | Desbloquea el logro "Búho Nocturno" |
| Derrotar al boss | Lluvia de monedas + logro "Boss Slayer" |

---

## 🛠️ Stack Tecnológico

- **HTML5** — estructura semántica en un único archivo
- **CSS3 puro** — variables CSS, flexbox, grid, `@keyframes`, `clamp()`
- **JavaScript vanilla** — sin frameworks, sin dependencias
- **Web Audio API** — motor de sonidos 8-bit y BGM
- **Canvas API** — minijuego runner pixel art
- **Google Fonts** — Press Start 2P + VT323

---

## 🔜 Próxima Versión — Angular 21

Este portfolio está siendo migrado a **Angular 21** como proyecto standalone.

```
src/app/
├── components/
│   ├── hero/
│   ├── story/
│   ├── about/
│   ├── cv/
│   ├── skills-inventory/
│   ├── world-map/
│   ├── boss-fight/
│   ├── aldeanos/
│   ├── github-stats/
│   └── contact/
├── shared/
│   ├── topbar/
│   ├── insert-coin/
│   ├── achievements/
│   └── minigame/
└── services/
    ├── score.service.ts
    ├── audio.service.ts
    └── achievements.service.ts
```

---

## 📬 Contacto

<div align="center">

[![Gmail](https://img.shields.io/badge/dsotillo20@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:dsotillo20@gmail.com)
[![GitHub](https://img.shields.io/badge/DanielC--04-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/DanielC-04)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/TU-USUARIO-LINKEDIN)

</div>

---

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:3382F6,100:512BD4&height=120&section=footer" width="100%"/>

*GAME OVER? NUNCA. THE PORTFOLIO IS ALWAYS IN THIS CASTLE.*

</div>