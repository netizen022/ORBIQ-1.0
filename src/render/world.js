// Dibujo del mundo. COPIA LITERAL del original (solo cambian los identificadores de estado).
// Parte 1 (Paso 2): fondo, estela, partículas y textos. Parte 2 (Paso 3): orbes y power-up en pantalla.
// Pendiente: zona segura, jefe, círculos y cursor. Depende de la base y de render/draw.js; NO importa de game/ ni systems/.
import {W,H,PU} from '../config.js';
import {clamp,orbColor} from '../utils.js';
import {ctx} from '../canvas.js';
import {state} from '../state.js';
import {txt,glow,puShape} from './draw.js';

// fondo: cuadrícula, resplandor bajo el cursor y partículas que reaccionan
export function drawBackground(){
 ctx.strokeStyle='rgba(120,140,200,.07)';ctx.lineWidth=1;ctx.beginPath();
 for(let x=0;x<=W;x+=40){ctx.moveTo(x,0);ctx.lineTo(x,H)}for(let y=0;y<=H;y+=40){ctx.moveTo(0,y);ctx.lineTo(W,y)}ctx.stroke();
 const gr=ctx.createRadialGradient(state.mouse.x,state.mouse.y,0,state.mouse.x,state.mouse.y,180);gr.addColorStop(0,'rgba(90,120,255,.14)');gr.addColorStop(1,'rgba(90,120,255,0)');
 ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);ctx.fillStyle='rgba(180,200,255,.35)';state.dust.forEach(d=>ctx.fillRect(d.x,d.y,2,2))}
// orbes: rombo que cambia de verde a rojo, con anillo de vida restante
// ('t' es la misma línea que abre render() en el original; aquí solo se llama con la partida viva, así que equivale a state.G.t)
export function drawOrbs(){
 const t=state.G?state.G.t:performance.now()/1000;
 state.G.orbs.forEach(o=>{const c=orbColor(o),p=9+2*Math.sin(t*6+o.ph);glow(c);ctx.fillStyle=c;ctx.beginPath();
  ctx.moveTo(o.x,o.y-p);ctx.lineTo(o.x+p*.7,o.y);ctx.lineTo(o.x,o.y+p);ctx.lineTo(o.x-p*.7,o.y);ctx.fill();ctx.shadowBlur=0;
  ctx.strokeStyle=c;ctx.globalAlpha=.5;ctx.lineWidth=2;ctx.beginPath();ctx.arc(o.x,o.y,16,-1.57,-1.57+6.283*(1-o.age/o.life));ctx.stroke();ctx.globalAlpha=1;
  if(o.golden){ctx.strokeStyle='rgba(255,209,102,'+(0.5+0.5*Math.sin(t*8))+')';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(o.x,o.y,20,0,6.283);ctx.stroke()}})}   // anillo dorado parpadeante
// power-up en pantalla (parpadea durante sus últimos 2 s)
export function drawPUOrb(){
 const t=state.G?state.G.t:performance.now()/1000;
 if(state.G.puOrb){const p=state.G.puOrb,f=p.age>p.life-2&&Math.floor(t*8)%2;if(!f)puShape(p.k,p.x,p.y,15+2*Math.sin(t*5),PU[p.k].c,t)}}
// estela del cursor (el original la dibuja antes del cursor)
export function drawTrail(){
 state.trail.forEach(p=>{ctx.fillStyle='rgba(140,170,255,'+p.l+')';ctx.beginPath();ctx.arc(p.x,p.y,2+p.l*5,0,6.283);ctx.fill()})}
// partículas y textos flotantes (el original los dibuja después del cursor)
export function drawParticlesAndTexts(){
 state.parts.forEach(p=>{ctx.globalAlpha=clamp(p.l/p.m,0,1);ctx.fillStyle=p.c;ctx.fillRect(p.x,p.y,p.s,p.s)});ctx.globalAlpha=1;
 state.texts.forEach(f=>txt(f.s,f.x,f.y,f.sz,f.c,'center',clamp(f.l,0,1)))}
