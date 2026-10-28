// Helpers de dibujo sobre el canvas 2D compartido. COPIA LITERAL del original (solo cambian los identificadores de estado).
// Depende solo de la base (canvas, state, utils); NO importa de game/ ni systems/.
import {ctx} from '../canvas.js';
import {state} from '../state.js';
import {pick,darken} from '../utils.js';

export function txt(s,x,y,sz,c,al='left',a=1){ctx.globalAlpha=a;ctx.fillStyle=c;ctx.font='600 '+sz+'px "Trebuchet MS",Segoe UI,sans-serif';ctx.textAlign=al;ctx.fillText(s,x,y);ctx.globalAlpha=1}
export function poly(x,y,r,n,rot=0){ctx.beginPath();for(let i=0;i<n;i++){const a=rot+i*6.283/n;ctx[i?'lineTo':'moveTo'](x+Math.cos(a)*r,y+Math.sin(a)*r)}ctx.closePath()}
export function glow(c,b=14){ctx.shadowColor=c;ctx.shadowBlur=b}
export function puShape(k,x,y,r,c,t){ // formas distintivas de cada power-up
 ctx.strokeStyle=c;ctx.lineWidth=2.5;glow(c);ctx.beginPath();
 if(k==='shield'){poly(x,y,r,6,t)}
 else if(k==='magnet'){for(let a=0;a<12;a+=.3){const rr=a*r/12;ctx[a?'lineTo':'moveTo'](x+Math.cos(a+t)*rr,y+Math.sin(a+t)*rr)}}
 else if(k==='slow'){ctx.arc(x,y,r,0,6.283);ctx.moveTo(x,y);ctx.lineTo(x,y-r*.7);ctx.moveTo(x,y);ctx.lineTo(x+r*.5,y)}
 else if(k==='freeze'){for(let i=0;i<3;i++){const a=i*Math.PI/3+t*.5;ctx.moveTo(x-Math.cos(a)*r,y-Math.sin(a)*r);ctx.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r)}}
 else if(k==='combo'){poly(x,y,r,5,t)}   // pentágono rosa
 else{for(let i=0;i<16;i++){const a=i*Math.PI/8+t,rr=i%2?r*.5:r;ctx[i?'lineTo':'moveTo'](x+Math.cos(a)*rr,y+Math.sin(a)*rr)}ctx.closePath()}
 ctx.stroke();ctx.shadowBlur=0}
/* ===== EASTER EGG: círculos dibujados como huevos de Pascua ===== */
const EGG_C=['#ffb3c8','#b3e5ff','#c8ffb3','#fff0b3','#e0b3ff'];   // paleta pastel
export function drawEgg(c,pk){
 if(!c.eggColor)c.eggColor=pick(EGG_C);                  // color estable por círculo (no parpadea)
 const rx=c.r*.85,ry=c.r*1.15,dk=darken(c.eggColor,.7);
 ctx.fillStyle=c.eggColor;glow(c.eggColor,12);ctx.beginPath();ctx.ellipse(c.x,c.y,rx,ry,0,0,6.283);ctx.fill();ctx.shadowBlur=0;
 ctx.save();ctx.beginPath();ctx.ellipse(c.x,c.y,rx,ry,0,0,6.283);ctx.clip();       // las franjas no se salen del óvalo
 ctx.strokeStyle=dk;ctx.lineWidth=Math.max(2,c.r*.14);
 for(let k=0;k<4;k++){const y0=c.y+(k-1.5)*ry*.5;ctx.beginPath();                    // 4 franjas en zigzag
  for(let j=0;j<=8;j++){const x=c.x-rx+j*rx/4,y=y0+(j%2?-1:1)*c.r*.14;ctx[j?'lineTo':'moveTo'](x,y)}ctx.stroke()}
 ctx.restore();
 ctx.strokeStyle=pk==='freeze'?'#ffffff':darken(c.eggColor,.55);ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(c.x,c.y,rx,ry,0,0,6.283);ctx.stroke()}
/* Bloque J: cursor según la skin elegida (x,y,skin opcionales para las vistas previas) */
export function drawCursor(sc,x=state.mouse.x,y=state.mouse.y,skin=state.selSkin){
 const col=sc?'#ffd166':'#e8ecff';
 ctx.fillStyle='rgba(120,160,255,.18)';ctx.beginPath();ctx.arc(x,y,14,0,6.283);ctx.fill();
 glow(sc?'#ffd166':'#9db4ff',sc?26:12);ctx.fillStyle=col;ctx.strokeStyle=col;ctx.lineWidth=2;
 if(skin==='star'){ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?4:9;ctx[i?'lineTo':'moveTo'](x+Math.cos(a)*q,y+Math.sin(a)*q)}ctx.closePath();ctx.fill()}
 else if(skin==='ring'){ctx.beginPath();ctx.arc(x,y,4,0,6.283);ctx.stroke();ctx.beginPath();ctx.arc(x,y,9,0,6.283);ctx.stroke()}
 else if(skin==='diamond'){poly(x,y,8,4,0);ctx.fill()}
 else{ctx.beginPath();ctx.arc(x,y,5,0,6.283);ctx.fill()}
 ctx.shadowBlur=0;
 if(sc){ctx.strokeStyle='#ffd166';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,18,0,6.283);ctx.stroke()}}
// Rectángulo redondeado (no depende de ctx.roundRect para ser compatible con navegadores viejos)
export function rr(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
