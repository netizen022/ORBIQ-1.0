// Escenas con opciones clicables: construcción de menús, hit-test y navegación.
// COPIA LITERAL del original (solo cambian los identificadores de estado). Se adelanta desde el Paso 8 porque input.js necesita items().
import {W,SKINS,INVULN} from '../config.js';
import {state,go} from '../state.js';
import {store} from '../storage.js';
import {sfx} from '../audio.js';
import {newGame,gameOver} from './game.js';

// Menú principal: solo 5 opciones; los modos viven en la subpantalla 'playmenu'
function buildMenu(){
 return [
  {label:'Jugar',c:'#7dffb2',d:'Elige un modo de juego.',act:()=>go('playmenu')},
  {label:'Récords',c:'#ffd166',d:'Top 10 de jugadores guardado en este navegador.',act:()=>go('records')},
  {label:'Logros',c:'#ff8a3d',d:'Consulta tus logros desbloqueados.',act:()=>go('achievements')},
  {label:'Skins',c:'#a07bff',d:'Elige el aspecto de tu cursor.',act:()=>go('skins')},
  {label:'Cómo jugar',c:'#e8ecff',d:'Instrucciones y controles.',act:()=>go('howto')}]}
// Submenú de modos: "Oleada infinita" aparece siempre, con candado hasta desbloquearla
function buildPlayMenu(){
 return [
  {label:'Modo Normal',c:'#7dffb2',d:'3 vidas · dificultad progresiva · récord propio.',act:()=>newGame('normal')},
  {label:'Modo Hardcore',c:'#ff3d5a',d:'1 vida · oleadas más frecuentes · sin revivir · récord propio.',act:()=>newGame('hardcore')},
  {label:'Oleada infinita',c:'#2de2e6',
   d:state.unlockedEndless?'Sobrevive el máximo tiempo posible. Récord de tiempo propio.':'Desbloqueado al llegar a nivel 10 en Normal.',
   locked:!state.unlockedEndless,
   act:()=>{if(state.unlockedEndless)newGame('endless');else sfx.miss()}}]}
const BACK=y=>({label:'Volver',c:'#7dffb2',sz:17,x:W/2-100,y,w:200,h:34,act:()=>go('menu')});
// Opciones clicables de la escena actual, con su rectángulo (se usan para dibujar, hover y clic)
export function items(){
 if(state.scene==='menu')return buildMenu().map((m,i)=>({...m,x:W/2-200,y:214+i*44,w:400,h:38}));
 if(state.scene==='playmenu')return buildPlayMenu().map((m,i)=>({...m,x:W/2-200,y:190+i*70,w:400,h:52}))
  .concat([{label:'Volver',c:'#7dffb2',sz:16,x:W/2-100,y:460,w:200,h:34,act:()=>go('menu')}]);
 if(state.scene==='records')return [BACK(520)];
 if(state.scene==='achievements')return [BACK(540)];
 if(state.scene==='skins')return SKINS.map((s,i)=>({label:s.n,c:'#a07bff',skin:s,x:50+i*220,y:190,w:200,h:140,
  act:()=>{if(state.unlockedSkins.includes(s.id)){state.selSkin=s.id;store.set('skin',state.selSkin);sfx.collect(1)}else sfx.miss()}})).concat([BACK(520)]);
 if(state.scene==='revive')return [
  {label:'Revivir (mitad de puntos)',c:'#7dffb2',sz:16,x:W/2-260,y:400,w:240,h:50,
   act:()=>{state.G.score=Math.floor(state.G.score/2);state.G.lives=1;state.G.reviveUsed=true;state.G.pendingRevive=false;
    state.G.inv=INVULN;state.G.phase=state.G.endless?'wave':'calm';state.G.waveT=state.G.endless?9999:3;go('play')}},
  {label:'Aceptar derrota',c:'#ff3d5a',sz:16,x:W/2+20,y:400,w:240,h:50,
   act:()=>{state.G.reviveUsed=true;go('over');gameOver()}}];   // gameOver hace su trabajo normal (récords, nombre...)
 return []}
export const hit=it=>state.mouse.x>=it.x&&state.mouse.x<=it.x+it.w&&state.mouse.y>=it.y&&state.mouse.y<=it.y+it.h;
export const NAVS=['menu','playmenu','records','achievements','skins','revive'];   // escenas con opciones clicables
export function backToMenu(){state.G=null;go('menu')}   // del resultado al menú principal
