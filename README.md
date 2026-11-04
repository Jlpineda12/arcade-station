# 🕹️ Arcade Station (Master Hub 1984)

[![Deploy to GitHub Pages](https://github.com/Jlpineda12/arcade-station/actions/workflows/deploy.yml/badge.svg)](https://github.com/Jlpineda12/arcade-station/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Demo-Play%20Now-orange?style=flat&logo=google-chrome)](https://jlpineda12.github.io/arcade-station/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Arcade Station Master Hub:** Gabinete virtual retro que unifica **5 juegos clásicos de arcade** en una única experiencia interactiva, desarrollado con **JavaScript Vanilla (ES6+)** y síntesis musical en tiempo real con **Web Audio API** (cero archivos de audio externos).

Diseñado con la estética visual Game Boy / Arcade CRT de referencia: perspectiva en 4 paredes, monitor CRT en proporción 4:3 con filtro dot-matrix LCD, deck decorativo con palanca y botones, selector de cartuchos interactivo y pantalla de controles integrada dentro del monitor.

🎮 **Jugar en vivo:** [https://jlpineda12.github.io/arcade-station/](https://jlpineda12.github.io/arcade-station/)

---

## 🎮 Los 5 Juegos Integrados

| # | Juego | Género | Repositorio Dedicado | Demo Independiente |
| :-: | :--- | :--- | :--- | :--- |
| **1** | 🐍 **Pixel Snake Arcade** | Slither clásico 1976 | [`pixel-snake-arcade`](https://github.com/Jlpineda12/pixel-snake-arcade) | [Jugar](https://jlpineda12.github.io/pixel-snake-arcade/) |
| **2** | 🥊 **Pixel Combat Arcade** | 1v1 Brawler Fighter | [`pixel-combat-arcade`](https://github.com/Jlpineda12/pixel-combat-arcade) | [Jugar](https://jlpineda12.github.io/pixel-combat-arcade/) |
| **3** | 🚀 **Pixel Space Arcade** | Space Invaders 1984 | [`pixel-space-arcade`](https://github.com/Jlpineda12/pixel-space-arcade) | [Jugar](https://jlpineda12.github.io/pixel-space-arcade/) |
| **4** | 🧱 **Pixel Breaker Arcade**| Arkanoid & Power-Ups | [`pixel-breaker-arcade`](https://github.com/Jlpineda12/pixel-breaker-arcade) | [Jugar](https://jlpineda12.github.io/pixel-breaker-arcade/) |
| **5** | 🍒 **Pixel Maze Arcade** | Pac-Chaser & 4 Ghosts | [`pixel-maze-arcade`](https://github.com/Jlpineda12/pixel-maze-arcade) | [Jugar](https://jlpineda12.github.io/pixel-maze-arcade/) |

---

## 🕹️ Controles de la Estación

### En el Selector de Cartuchos (Menú Principal):
- **`←` / `→` o `[A]` / `[D]`**: Navegar entre los 5 cartuchos.
- **`[1]` - `[5]`**: Selección rápida de cartucho directamente.
- **`[ENTER]` o `[ESPACIO]`**: Insertar cartucho y comenzar a jugar.
- **`[C]`**: Abrir la **Guía Universal de Controles** dentro de la pantalla.

### Durante la Partida:
- Cada juego cuenta con sus controles retro arcade optimizados.
- Para volver al menú principal en cualquier momento: presiona el botón superior **`[◀ SALIR AL ARCADE HUB]`** o pulsa **`[SHIFT + ESC]`**.

---

## 🎵 Arquitectura de Audio Procedural

- Cada juego y la estación central sintetizan su propia banda sonora y efectos de sonido en tiempo real utilizando la **Web Audio API** nativa de los navegadores.
- No se cargan archivos pesados `.mp3` ni `.wav`:
  - Osciladores cuadrados y senoidales para melodías y bajos de 8 bits.
  - Generadores de ruido blanco pseudoaleatorio para explosiones, golpes y percusión retro.
  - Modulación dinámica de tempo (BPM) y escala pentatónica según el rendimiento del jugador.

---

## 🧪 Pruebas Automatizadas de QA

Para ejecutar la suite de pruebas unitarias y de integración de la estación:

```bash
npm test
```

---

## 👤 Autor

**Jose Luis Pineda ([@Jlpineda12](https://github.com/Jlpineda12))**  
Estudiante de Ingeniería en Multimedia  
Especializado en interfaces interactivas, síntesis de audio computacional y videojuegos para la web moderna.
