// Efectos visuales: estela, partículas, textos flotantes y polvo de fondo. COPIA LITERAL del original
// (solo cambian los identificadores de estado: trail/parts/texts/dust/mouse -> state.X).
// Depende solo de la base (config, utils, state); NO importa de render/.
import {W,H,DT} from '../config.js';
import {rnd,dist} from '../utils.js';
import {state} from '../state.js';

export function updateFX(){
 state.trail.push({x:state.mouse.x,y:state.mouse.y,l:.4});state.trail.forEach(p=>p.l-=DT);state.trail=state.trail.filter(p=>p.l>0);
 state.parts.forEach(p=>{p.x+=p.vx*DT;p.y+=p.vy*DT;p.vx*=.97;p.vy*=.97;p.l-=DT});state.parts=state.parts.filter(p=>p.l>0);
 state.texts.forEach(t=>{t.y-=30*DT;t.l-=DT});state.texts=state.texts.filter(t=>t.l>0);
 state.dust.forEach(d=>{const dd=dist(d.x,d.y,state.mouse.x,state.mouse.y);if(dd<110&&dd>1){d.x+=(d.x-state.mouse.x)/dd*1.6;d.y+=(d.y-state.mouse.y)/dd*1.6}
  d.x=(d.x+d.vx*DT+W)%W;d.y=(d.y+d.vy*DT+H)%H})}
export function burst(x,y,c,n,sp=160,life=.6){for(let i=0;i<n;i++){const a=rnd(0,6.283),s=rnd(.2,1)*sp;
 state.parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:rnd(.3,1)*life,m:life,c,s:rnd(1.5,3.5)})}}
export const ft=(x,y,s,c,sz=16)=>state.texts.push({x,y,s,c,sz,l:1});
