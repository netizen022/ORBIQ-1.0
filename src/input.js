// Entrada: puntero, teclado y resize. UN solo listener de mousemove, uno de mousedown, uno de keydown y uno de resize.
// COPIA LITERAL del original (solo cambian los identificadores de estado); los listeners se registran en initInput(), en el mismo orden que el original.
// Cambios mecánicos: click() -> playClick() (vive en game/game.js) y 'muted=!muted' -> toggleMute().
import {W,H,NAME_MAX} from './config.js';
import {clamp} from './utils.js';
import {state,go} from './state.js';
import {initAudio,toggleMute,sfx} from './audio.js';
import {cv,resize} from './canvas.js';
import {items,hit,NAVS,backToMenu} from './game/scenes.js';
import {saveEntry,playClick} from './game/game.js';

/* ===== ENTRADA DE NOMBRE ===== */
function nameKey(e){ // teclado del input de nombre: solo letras, números y espacios, máx. NAME_MAX
 if(state.sceneT<.3)return;                       // evita que una pulsación suelta al morir se cuele en el nombre
 if(e.code==='Enter'||e.code==='NumpadEnter'){e.preventDefault();if(!e.repeat)saveEntry(false)}
 else if(e.code==='Escape'){e.preventDefault();if(!e.repeat)saveEntry(true)}
 else if(e.code==='Backspace'){e.preventDefault();state.nm.text=state.nm.text.slice(0,-1)}
 else if(e.key.length===1&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&/^[\p{L}\p{N} ]$/u.test(e.key)){
  e.preventDefault();if(state.nm.text.length<NAME_MAX)state.nm.text+=e.key}}

/* ===== INPUT ===== */
function pos(e){const r=cv.getBoundingClientRect();state.mouse.x=clamp((e.clientX-r.left)*W/r.width,0,W);state.mouse.y=clamp((e.clientY-r.top)*H/r.height,0,H)}
function hover(){if(!NAVS.includes(state.scene))return;const i=items().findIndex(hit);if(i>=0&&i!==state.sel){state.sel=i;sfx.nav()}}

// Registra los listeners globales (mismo orden que el original: mousemove, mousedown, keydown, resize).
export function initInput(){
cv.addEventListener('mousemove',e=>{pos(e);hover()});
cv.addEventListener('mousedown',e=>{pos(e);initAudio();
 if(state.scene==='play')playClick();
 else if(state.scene==='howto'){if(state.sceneT>.25)go('menu')}
 else if(state.scene==='menu'||state.scene==='playmenu'||state.scene==='records'||state.scene==='achievements'||state.scene==='skins'){const it=items().find(hit);if(it)it.act()}
 else if(state.scene==='revive'){if(state.sceneT>.4){const it=items().find(hit);if(it)it.act()}}   // pequeña guarda: evita un clic accidental al morir
 else if(state.scene==='over'&&state.sceneT>.6)backToMenu()});
addEventListener('keydown',e=>{
 initAudio();
 if(state.scene==='name'){nameKey(e);return}          // en el input de nombre la M es una letra más
 // Easter egg: buffer de las últimas 3 teclas; 'egg' activa/desactiva el modo huevo
 if(e.key&&e.key.length===1){state.eggBuf=(state.eggBuf+e.key.toLowerCase()).slice(-3);if(state.eggBuf==='egg'){state.eggMode=!state.eggMode;state.eggBuf=''}}
 if(e.code==='KeyM'){toggleMute();return}        // silenciar: funciona en todas las demás escenas
 const up=e.code==='ArrowUp'||e.code==='KeyW',dn=e.code==='ArrowDown'||e.code==='KeyS',
  lf=e.code==='ArrowLeft'||e.code==='KeyA',rt=e.code==='ArrowRight'||e.code==='KeyD',
  enter=(e.code==='Enter'||e.code==='NumpadEnter')&&!e.repeat,esc=e.code==='Escape'&&!e.repeat;
 if(state.scene==='menu'||state.scene==='playmenu'||state.scene==='records'||state.scene==='skins'||state.scene==='revive'){
  const n=items().length;
  if(up||dn||(state.scene!=='menu'&&state.scene!=='playmenu'&&(lf||rt))){e.preventDefault();state.sel=(state.sel+(dn||rt?1:-1)+n)%n;sfx.nav()}
  else if(enter){if(state.scene!=='revive'||state.sceneT>.4)items()[state.sel].act()}
  else if((state.scene==='records'||state.scene==='skins'||state.scene==='playmenu')&&esc)go('menu')}   // en 'revive' no hay Esc: hay que elegir
 else if(state.scene==='achievements'){if(enter||esc)go('menu')}
 else if(state.scene==='howto'){if(enter||esc)go('menu')}
 else if(state.scene==='over'){if((enter||esc)&&state.sceneT>.6)backToMenu()}});
addEventListener('resize',resize);resize();
}
