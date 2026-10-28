// Arranque: inicializa el estado, registra la entrada y corre el bucle de paso fijo (acumulador, DT=1/60).
// update() y render() son TEMPORALES (Paso 3): FX + partida parcial + fondo/orbes/power-up. Se reemplazan por game/game.js y render/render.js en los pasos 4-9.
import './state.js';                       // efecto de módulo: lee localStorage, migra y construye `state` (una sola vez, antes del primer frame)
import {W,H,DT} from './config.js';
import {rnd} from './utils.js';
import {ctx} from './canvas.js';
import {state,live} from './state.js';
import {initInput} from './input.js';
import {updateFX} from './systems/fx.js';
import {updateGame} from './game/game.js';
import {drawBackground,drawOrbs,drawPUOrb,drawTrail,drawParticlesAndTexts} from './render/world.js';

// TEMPORAL (Paso 3). Copia literal del update() original; updateGame es PARCIAL hasta el Paso 6.
function update(){updateFX();state.sceneT+=DT;
 if(state.hl&&state.scene==='records'&&state.hl.t>0)state.hl.t-=DT;               // el resaltado corre mientras se ve la tabla completa
 if(state.G&&state.scene!=='play')state.G.shake*=.9;                              // el temblor se apaga también fuera de la partida
 if(state.scene==='play')updateGame(DT)}

// TEMPORAL (Paso 3). Copia literal del arranque del render() original + las capas hechas hasta ahora, en el mismo orden:
// fondo -> mundo (zona segura, orbes, power-up, jefe, círculos) -> estela -> (cursor: pendiente) -> partículas/textos -> (HUD y escenas: pendientes).
function render(){
 ctx.setTransform(state.K,0,0,state.K,0,0);ctx.fillStyle='#07080d';ctx.fillRect(0,0,W,H);
 if(state.G&&state.G.shake>.3)ctx.translate(rnd(-state.G.shake,state.G.shake),rnd(-state.G.shake,state.G.shake));
 drawBackground();
 if(live()){
  // (pendiente) zona segura -> Paso 4
  drawOrbs();
  drawPUOrb();
  // (pendiente) jefe -> Paso 5 · círculos -> Paso 4
 }
 drawTrail();
 drawParticlesAndTexts();
 ctx.setTransform(state.K,0,0,state.K,0,0)}

initInput();   // mousemove, mousedown, keydown y resize (+ primer resize()), todo en input.js
/* ===== BUCLE PRINCIPAL (paso fijo) ===== */
let last=0,acc=0;
function frame(ts){requestAnimationFrame(frame);const d=Math.min(.1,(ts-last)/1000||0);last=ts;acc+=d;
 while(acc>=DT){update();acc-=DT}render()}
requestAnimationFrame(frame);
