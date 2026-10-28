// Estado mutable del juego en UN solo objeto `state` (los `let` del original pasan a ser propiedades).
// REGLA: nunca desestructurar propiedades reasignables (G, scene, parts, trail, scoresNormal...) en otros módulos;
// leer y escribir siempre como state.X. Este módulo se evalúa UNA vez, antes del primer frame.
import {W,H,SKINS} from './config.js';
import {rnd} from './utils.js';
import {store,migrateAch,probeStore,loadScores} from './storage.js';

/* ===== LECTURA INICIAL DE localStorage (mismo orden que el original) ===== */
let rec=store.get('rec',0),bestCombo=store.get('bc',1),ach=store.get('ach',{});
migrateAch(ach);   // migración de ids de logros antiguos (ACH_MIG) — ver storage.js
let recHC=store.get('rec_hardcore',0);                    // récord separado del modo Hardcore
let recHCTime=store.get('rec_hc_time',0);                 // mejor tiempo sobrevivido en Hardcore (s)
let unlockedEndless=store.get('endless',0)?true:false;    // modo Oleada infinita desbloqueado (nivel 10 en Normal)
let recEndless=store.get('rec_endless',0);                // récord de tiempo en Oleada infinita (s)
let unlockedSkins=store.get('skins',['default']);         // ids de skins desbloqueadas
let selSkin=store.get('skin','default');                  // skin elegida
if(!Array.isArray(unlockedSkins)||!unlockedSkins.includes('default'))unlockedSkins=['default'];
SKINS.forEach(s=>{if(s.req&&ach[s.req]&&!unlockedSkins.includes(s.id))unlockedSkins.push(s.id)});   // logros ya obtenidos antes
if(!unlockedSkins.includes(selSkin))selSkin='default';
// ¿Funciona localStorage? (en modo privado puede fallar). Si no, el juego sigue y avisamos en pantalla.
let storeOK=probeStore();
let [scoresNormal,scoresHardcore]=loadScores();   // tablas en memoria (siguen funcionando aunque localStorage falle)

/* ===== ESTADO ===== */
export const state={
 scene:'menu',G:null,K:1,parts:[],texts:[],trail:[],   // escenas: menu, playmenu, howto, records, achievements, skins, play, revive, name, over
 mouse:{x:W/2,y:H/2},
 rec,bestCombo,ach,recHC,recHCTime,unlockedEndless,recEndless,unlockedSkins,selSkin,
 /* ===== ESTADO DE MENÚ Y RÉCORDS ===== */
 eggMode:false,eggBuf:'',            // easter egg: escribir 'egg' cambia los círculos por huevos de Pascua
 sel:0,sceneT:0,                     // opción seleccionada y segundos en la escena actual
 nm:{text:''},                       // texto del input de nombre
 hl:null,                            // entrada recién agregada a resaltar: {e:entrada, t:segundos restantes}
 storeOK,scoresNormal,scoresHardcore,
 dust:Array.from({length:50},()=>({x:rnd(0,W),y:rnd(0,H),vx:rnd(-6,6),vy:rnd(-6,6)}))};

/* ===== SELECTORES Y TRANSICIÓN DE ESCENA (solo leen/escriben `state`; viven aquí para no crear ciclos game<->scenes<->render) ===== */
export const curRec=()=>state.G&&state.G.hc?state.recHC:state.rec;    // récord del modo de la partida actual
export function go(s){state.scene=s;state.sel=0;state.sceneT=0}      // cambia de escena y reinicia el estado de menú
export const live=()=>state.G&&(state.scene==='play'||state.scene==='name'||state.scene==='over'||state.scene==='revive');   // ¿se dibuja la partida (mundo + HUD)?
