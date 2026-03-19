# Portfolio Daniel Carrasco - Software Developer

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:3382F6,100:512BD4&height=200&section=header&text=DEV.WORLD%20%E2%80%94%20Portfolio&fontSize=40&fontColor=fff&animation=fadeIn&fontAlignY=38&desc=Daniel%20Carrasco%20%7C%20Pixel%20Art%20%7C%20DEV&descAlignY=55&descSize=18" width="100%"/>

#   DEV.WORLD — Portfolio de Daniel Carrasco

[![Angular](https://img.shields.io/badge/Angular_21-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)]()
[![Google Sheets](https://img.shields.io/badge/Google_Sheets-34A853?style=for-the-badge&logo=google-sheets&logoColor=white)]()
[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://portfoliodaniel.blazeops.tech)
[![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red?style=for-the-badge)]()

> Portfolio personal con estética **pixel art retro** inspirada en videojuegos clásicos.
> Construido en Angular 21 con contenido dinámico, boss fight, inventarioy más.

[🕹️ Ver Demo](https://portfoliodaniel.blazeops.tech) &nbsp;·&nbsp; [📬 Contacto](mailto:danielcc.dev@gmail.com) &nbsp;·&nbsp; [💼 LinkedIn](https://linkedin.com/in/danielcarrasco02)

</div>

---

## 🖼️ Preview

```
╔══════════════════════════════════════╗
║  DEV.WORLD          SCORE: 001200    ║
║  ────────────────────────────────    ║
║         INSERT COIN TO PLAY          ║
║                                      ║
║   [?] [?] [!]   ↑↑........  = 👀║
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
| 👥 **Aldeanos** | Testimonios reales con moderación + form para dejar opiniones |
| 📊 **GitHub Stats** | Tarjetas en vivo desde `github-profile-summary-cards` |
| 🌙 **Modo Oscuro** | Toggle día/noche con estrellas animadas en el hero |
| 💾 **Descargar CV** | Descarga directa del CV en PDF |
| ⚡ **Combo System** | Multiplicador de puntos por clicks rápidos |
| 🪙 **Lluvia de Monedas** | Se activa al ganar el boss o enviar mensajes |
| 🏆 **10 Logros** | Sistema de achievements desbloqueables |
| 🕹️ **Easter Egg** | ???? activar modo secreto |
| 🎯 **Cursor Custom** | Cursor pixel art en forma de cruz dorada |
| 📈 **Barra de Progreso** | Scroll progress bar en la parte superior |
| 📋 **CMS Dinámico** | Skills, proyectos, trayectoria y testimonios |

---

## 🗂️ Estructura

```
src/app/
├── components/
│   ├── hero/
│   ├── story/
│   ├── about/
│   ├── cv/
│   ├── skills-inventory/
│   ├── projects-map/
│   ├── boss-fight/
│   ├── testimonials/
│   ├── github-stats/
│   └── contact/
├── shared/
│   ├── topbar/
│   ├── insert-coin/
│   ├── achievements/
│   └── minigame/
├── services/
│   ├── score.service.ts
│   ├── audio.service.ts
│   └── achievements.service.ts
├── config/
│   └── portfolio-api.ts
└── legacy/
    └── legacy.ts
```

> Construido en **Angular 21 + TypeScript** con componentes standalone.


---

## 🚀 Instalación local

```bash
# 1. Clona el repo
git clone https://github.com/DanielC-04/Portfolio.git

# 2. Instala dependencias
npm install

# 3. Configura el environment de desarrollo
cp src/environments/environment.development.example.ts src/environments/environment.development.ts
# Edita environment.development.ts y agrega la URL de Apps Script

# 4. Configura el proxy
cp proxy.conf.example.json proxy.conf.json
# Edita proxy.conf.json y agrega la URL de Apps Script

# 5. Levanta el servidor
ng serve
```

---

## 🕹️ Easter Eggs

| Código | Efecto |
|---|---|
| `↑↑.....` | Activa el modo secreto ???(+9999 pts) |
| Golpear 5 bloques `?` | Desbloquea el logro "Rompe Bloques" |
| Visitar de noche (22:00–06:00) | Desbloquea el logro "Búho Nocturno" |
| Derrotar al boss | Lluvia de monedas + logro "Boss Slayer" |

---

## 🛠️ Stack Tecnológico

- **Angular 21** — componentes standalone
- **TypeScript** — tipado estricto
- **SCSS** — estilos por componente
- **Google Sheets + Apps Script** — CMS dinámico sin backend propio
- **Netlify** — hosting con CI/CD automático desde GitHub
- **Google Fonts** — Press Start 2P + VT323

---

## 📬 Contacto

<div align="center">

[![Gmail](https://img.shields.io/badge/danielcc.dev@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:danielcc.dev@gmail.com)
[![GitHub](https://img.shields.io/badge/DanielC--04-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/DanielC-04)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/danielcarrasco02)

</div>

---

## 📄 Licencia

© 2026 Daniel Carrasco — All Rights Reserved

Este proyecto es de uso exclusivo de su autor. No se permite copiar, modificar ni redistribuir sin autorización expresa. Ver archivo [LICENSE](./LICENSE) para más detalles.

---

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:3382F6,100:512BD4&height=120&section=footer" width="100%"/>

*GAME OVER? NUNCA. THE PORTFOLIO IS ALWAYS IN THIS CASTLE.*

</div>