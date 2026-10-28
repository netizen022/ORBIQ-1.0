# ORBIQ

Juego de arena en HTML5 (canvas 2D). Recoges orbes, esquivas círculos, encadenas combos. Modos Normal, Hardcore y Oleada infinita; logros, skins, power-ups, jefe cada 10 niveles, zona segura, top 10 de récords con nombre, audio con WebAudio.
**Stack:** JavaScript moderno (ES2020+) con módulos ES6 nativos. Sin frameworks, sin dependencias, sin build, sin TypeScript (por ahora).

## Ejecutar en local
Los módulos ES no funcionan con `file://`; hay que servir por HTTP:

    python -m http.server 8000      # desde la raíz del proyecto
    # abrir http://localhost:8000/

`localStorage` es por origen (esquema + host + puerto): los récords guardados en `file://` o en otro puerto NO aparecen aquí.

## Estructura (objetivo final; ver el plan de migración)
    index.html              solo <canvas id="c"> + <script type="module" src="src/main.js">
    src/main.js             arranque y bucle de paso fijo (DT=1/60, acumulador, requestAnimationFrame)
    src/config.js           constantes de balance y datos (W,H,DT,ORB_*,WAVE_*,PU,MODS,ACH,SKINS,...)
    src/state.js            objeto `state` + go(), live(), curRec(); lee localStorage una sola vez al evaluarse
    src/utils.js            funciones puras (rnd, ri, pick, clamp, dist, fmtTime, fdate, byScore, orbHue, orbColor, hexA, darken)
    src/storage.js          store ('av_*'), migraciones, loadScores, addScore(st, e), probeStore
    src/audio.js            WebAudio: initAudio, tone, seq, sfx, ARP, isMuted/toggleMute
    src/canvas.js           cv, ctx, resize()
    src/input.js            pos, hover, mousedown/mousemove, keydown global, nameKey
    src/systems/            fx, spawn, powerups, waves, boss, safezone, achievements, music
    src/render/             draw (helpers), world, hud, menus, render (orquestador)
    src/game/               game (newGame, update, hurt, gameOver...), scenes (items, NAVS, backToMenu...)

## Reglas absolutas
1. No cambiar constantes de balance, colores, velocidades, fórmulas (need, waveCount, orbVal...).
2. No cambiar textos visibles ni el idioma (español).
3. No cambiar el orden ni el comportamiento de las escenas: menu, playmenu, howto, records, achievements, skins, play, revive, name, over.
4. No cambiar claves `av_*` de localStorage ni las migraciones (ACH_MIG, av_scores -> scores_normal/hardcore, skins por logros, fallback si falla localStorage).
5. No usar `ctx.roundRect`; usar el helper `rr()`.
6. Sin dependencias externas; solo módulos ES6 nativos.
7. Sin TypeScript todavía.
8. Mantener el bucle de paso fijo (acumulador, DT=1/60) y requestAnimationFrame.
9. No reordenar las capas de render: fondo -> mundo -> estela/cursor -> partículas/textos -> HUD -> pantalla de escena.
10. Si algo es ambiguo, preguntar antes de asumir. Nada de comportamiento nuevo ni refactors "de paso".

## Convenciones
- Módulos ES6 con rutas relativas y extensión `.js`. Comentarios en español, nombres en inglés.
- Estado mutable SOLO en `state`. Leer y escribir siempre `state.X`; nunca desestructurar propiedades reasignables (G, scene, parts, trail, scoresNormal...).
- Los módulos no usan imports en tiempo de evaluación salvo constantes/utilidades puras (evita ciclos peligrosos). `game/` y `systems/` nunca importan de `render/`.
- Un solo listener global de `keydown` (en input.js) que conserva el orden: initAudio -> nombre -> easter egg -> mute -> navegación.
- Al mover código: copia literal, solo cambian los identificadores de estado (`G` -> `state.G`). Nada de limpiar, renombrar ni optimizar en el mismo paso.
- Tests con `node:test` más adelante (sin dependencias); las funciones puras y storage son los primeros candidatos.

## Flujo de trabajo
1. Un paso de migración por vez (ver plan). Un commit por paso.
2. Antes de seguir: pasar la checklist manual del paso comparando contra `orbiq_original.html` servido en el mismo origen.
3. Si la checklist falla, revertir el paso; no arreglar encima.
4. Antes de marcar un paso como terminado: consola sin errores, `localStorage` con las mismas claves `av_*` que el original.
