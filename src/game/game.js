// Lógica de la partida. COPIA LITERAL del original (solo cambian los identificadores de estado).
// Paso 3: newGame, need, updateGame (PARCIAL) y saveEntry. Los bloques que dependen de pasos futuros están COMENTADOS con '//'
// (texto ORIGINAL sin convertir, para poder compararlo línea a línea): oleadas, zona segura y círculos (Paso 4), jefe (Paso 5), música (Paso 6).
// STUBS pendientes (console.warn): gameOver y playClick (Paso 6). hurt, collectOrb y levelUp también llegan en el Paso 6.
import {state,go} from '../state.js';
import {store,addScore} from '../storage.js';
import {MODS} from '../config.js';
import {rnd,dist} from '../utils.js';
import {sfx} from '../audio.js';
import {burst} from '../systems/fx.js';
import {spawnOrb,spawnPU} from '../systems/spawn.js';

export function newGame(modo='normal'){
 // Normal: modificador 'Normal' · Hardcore: fuerza el modificador Hardcore
 const hc=modo==='hardcore',endless=modo==='endless',
  mod=hc?MODS.find(m=>m.hc):endless?MODS.find(m=>m.endless):MODS.find(m=>m.n==='Normal');state.parts=[];state.texts=[];state.hl=null;state.eggMode=false;
 state.G={t:0,score:0,lives:mod.hp,lvl:1,energy:0,streak:0,combo:1,comboT:0,orbs:[],circles:[],mod,inv:0,shake:0,
  pu:null,armed:false,puOrb:null,orbT:.5,puT:rnd(10,16),
  phase:endless?'wave':'calm',waveT:endless?9999:rnd(12,18),total:endless?9999:0,spawned:0,dur:endless?9999:10,theme:['line'],
  waves:0,miniT:10,got:0,maxCombo:1,banner:{t:3.5,a:'Modificador: '+mod.n,b:mod.d},flash:0,mt:0,mstep:0,newAch:[],alarmT:0,
  hc,mode:modo,
  perfectStreak:0,                 // Bloque A: orbes seguidos sin fallar ni recibir daño
  runT:0,                          // Bloque D: tiempo de la partida (s)
  reviveUsed:false,pendingRevive:false,   // Bloque E: crédito de revivir
  safeZone:null,safeT:rnd(25,35),  // Bloque G: zona segura
  boss:null,bossSpawned:{},        // Bloque K: jefe cada 10 niveles
  endless,endT:0,endWaveT:20,endSpawnT:0,endlessUnlockedNow:false};   // Bloque C: Oleada infinita
 // if(endless)chooseTheme();   // TEMPORAL (Paso 3): chooseTheme llega en el Paso 4 (waves.js). Descomentar entonces.
 go('play');
}
export const need=()=>100+state.G.lvl*100;   // nivel 2→300, nivel 5→600, nivel 10→1100

/* ===== UPDATE (PARCIAL: ver bloques comentados) ===== */
export function updateGame(dt){
 state.G.t+=dt;state.G.runT+=dt;if(state.G.endless)state.G.endT+=dt;if(state.G.inv>0)state.G.inv-=dt;state.G.shake*=.9;if(state.G.flash>0)state.G.flash-=dt;if(state.G.banner.t>0)state.G.banner.t-=dt;
 if(state.G.streak>0){state.G.comboT-=dt;if(state.G.comboT<=0){state.G.streak=0;state.G.combo=1}}
 if(state.G.pu){state.G.pu.t-=dt;if(state.G.pu.t<=0)state.G.pu=null}
 const pk=state.G.pu&&state.G.pu.k,spd=pk==='freeze'?0:pk==='slow'?.4:1;   // 'spd' lo usa el bucle de círculos (Paso 4); se conserva literal
 // orbes normales: spawn, envejecer, imán y expiración (rompe combo)
 state.G.orbT-=dt;if(state.G.orbT<=0){if(state.G.orbs.length<6)spawnOrb();state.G.orbT=rnd(.8,1.5)/(1+.03*state.G.lvl)}
 for(const o of state.G.orbs.slice()){o.age+=dt;
  if(pk==='magnet'){const d=dist(o.x,o.y,state.mouse.x,state.mouse.y);if(d<150&&d>2){o.x+=(state.mouse.x-o.x)/d*200*dt;o.y+=(state.mouse.y-o.y)/d*200*dt}}
  if(o.age>=o.life){state.G.orbs.splice(state.G.orbs.indexOf(o),1);state.G.streak=0;state.G.combo=1;state.G.perfectStreak=0;sfx.miss();burst(o.x,o.y,'#555a70',8,60)}}
 // power-up en pantalla (máximo uno)
 if(state.G.puOrb){state.G.puOrb.age+=dt;if(state.G.puOrb.age>=state.G.puOrb.life)state.G.puOrb=null}
 else{state.G.puT-=dt;if(state.G.puT<=0){spawnPU();state.G.puT=rnd(14,22)}}
 /* ---- PASO 4 · safezone.js: zona segura (define también 'inSafe', que usan círculos y jefe) ---- */
// // Bloque G: zonas seguras temporales (sin daño, pero tampoco se recoge nada)
// G.safeT-=dt;
// if(G.safeZone){G.safeZone.t-=dt;if(G.safeZone.t<=0)G.safeZone=null}
// else if(G.safeT<=0){
//  for(let i=0;i<10;i++){const x=rnd(120,W-120),y=rnd(120,H-120);
//   if(dist(x,y,mouse.x,mouse.y)>150){G.safeZone={x,y,r:90,t:4};G.safeT=rnd(25,35);sfx.power();break}}}
// const inSafe=G.safeZone&&dist(mouse.x,mouse.y,G.safeZone.x,G.safeZone.y)<G.safeZone.r;
 /* ---- PASO 4 · waves.js: oleadas (calm / tele / wave) y Oleada infinita ---- */
// // oleadas: calma -> telegraph -> oleada
// if(G.endless){   // Oleada infinita: una sola oleada continua; cada 20 s sube el nivel
//  G.endWaveT-=dt;
//  if(G.endWaveT<=0){G.endWaveT=20;G.lvl++;chooseTheme();G.banner={t:2,a:'OLEADA '+(G.lvl-1),b:'¡Más rápido!'}}
//  G.endSpawnT-=dt;   // ritmo de aparición (cada vez más rápido) con tope de círculos simultáneos
//  if(G.endSpawnT<=0){G.endSpawnT=Math.max(.15,.9-.04*G.lvl)/G.mod.cnt;
//   if(G.circles.length<30+G.lvl*2&&spawnCircle(pick(G.theme)))G.spawned++}}
// else if(G.phase==='calm'){G.waveT-=dt;if(G.waveT<=0){G.phase='tele';G.waveT=TELEGRAPH;G.alarmT=0;chooseTheme()}
//  if(G.lvl>=5){G.miniT-=dt;if(G.miniT<=0){G.miniT=rnd(8,12);G.flash=.6;const n=Math.round((3+G.lvl/2)*G.mod.cnt);for(let i=0;i<n;i++)spawnCircle(pick(G.theme))}}}
// else if(G.phase==='tele'){G.waveT-=dt;G.alarmT-=dt;if(G.alarmT<=0){sfx.alarm(1-G.waveT/TELEGRAPH);G.alarmT=.25}
//  if(G.waveT<=0){G.phase='wave';G.dur=rnd(...WAVE_DUR);G.waveT=G.dur;G.total=waveCount();G.spawned=0}}
// else{G.waveT-=dt;const goal=G.total*Math.min(1,(G.dur-G.waveT)/(G.dur*.6));
//  while(G.spawned<goal){if(spawnCircle(pick(G.theme)))G.spawned++;else break}
//  if(G.waveT<=0){G.phase='calm';G.waves++;if(G.waves>=5)unlock('w5');
//   G.waveT=rnd(...WAVE_GAP)*G.mod.wave*Math.max(.4,1-.05*G.lvl);G.circles.forEach(c=>c.bounce=false)}}   // oleadas más seguidas por nivel (tope 40%)
 /* ---- PASO 4 · círculos: movimiento, atracción de orbes y colisión. Usa hurt() (Paso 6) e 'inSafe'. ---- */
// // círculos: movimiento por patrón, atracción de orbes viejos, colisión con el cursor
// for(const c of G.circles.slice()){
//  c.age+=dt;c.rot+=dt*2;const s=spd*dt;
//  const turn=c.type==='spiral'?c.turn/(1+c.age*.5):c.turn;
//  if(turn){const a=Math.atan2(c.vy,c.vx)+turn*s,sp=Math.hypot(c.vx,c.vy);c.vx=Math.cos(a)*sp;c.vy=Math.sin(a)*sp}
//  G.orbs.forEach(o=>{if(o.age/o.life>.5){const d=dist(o.x,o.y,c.x,c.y);if(d<160&&d>1){c.vx+=(o.x-c.x)/d*35*s;c.vy+=(o.y-c.y)/d*35*s}}});
//  c.x+=c.vx*s;c.y+=c.vy*s;
//  if(c.bounce){if((c.x<c.r&&c.vx<0)||(c.x>W-c.r&&c.vx>0))c.vx*=-1;if((c.y<c.r&&c.vy<0)||(c.y>H-c.r&&c.vy>0))c.vy*=-1}
//  c.tr.push({x:c.x,y:c.y});if(c.tr.length>10)c.tr.shift();
//  if(c.age>2&&(c.x<-c.r-60||c.x>W+c.r+60||c.y<-c.r-60||c.y>H+c.r+60))G.circles.splice(G.circles.indexOf(c),1);
//  else if(G.inv<=0&&pk!=='shield'&&!inSafe&&dist(c.x,c.y,mouse.x,mouse.y)<c.r+4){hurt();if(scene!=='play')return}}
 /* ---- PASO 5 · boss.js: jefe ---- */
// // Bloque K: jefe (3 fases según vida restante)
// if(G.boss){
//  const b=G.boss;b.t+=dt;
//  if(b.entering){b.y+=60*dt;if(b.y>=120)b.entering=false}
//  else{
//   if(b.phase===1){b.x=W/2+Math.sin(b.t*0.8)*250;b.y=120+Math.cos(b.t*1.2)*40}
//   if(b.phase===2){b.x=W/2+Math.sin(b.t*1.2)*300;b.y=140+Math.sin(b.t*2)*60;
//    b.shootT-=dt;
//    if(b.shootT<=0){b.shootT=1.5;const a=Math.atan2(mouse.y-b.y,mouse.x-b.x),sp=180;   // dispara hacia el cursor
//     G.circles.push({x:b.x,y:b.y,r:10,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,type:'line',turn:0,age:0,rot:0,tr:[],bounce:false,color:'#ff3d5a'})}}
//   if(b.phase===3){b.x=W/2+Math.cos(b.t*1.5)*200;b.y=160+Math.sin(b.t*1.8)*80}
//   if(G.inv<=0&&pk!=='shield'&&!inSafe&&dist(b.x,b.y,mouse.x,mouse.y)<b.r+4){hurt();if(scene!=='play')return}}}
 /* ---- PASO 6 · music.js: música ---- */
// // música: arpegio que se acelera durante la oleada
// G.mt+=dt;const iv=G.phase==='wave'?.14:.22;
// if(G.mt>=iv){G.mt-=iv;G.mstep++;tone(ARP[G.mstep%6]*(G.phase==='wave'?2:1),.18,'sine',.03)}}
}   // cierra updateGame (en el original esta llave es la última de la línea anterior)

/* ===== ENTRADA DE NOMBRE Y GUARDADO DE RÉCORD (nuevo) ===== */
export function saveEntry(skip){ // skip=true: omitir (Esc) y no guardar la puntuación
 if(!skip){const name=state.nm.text.trim()||'Anónimo';store.set('name',name);
  const e=addScore(state,{name,score:state.G.score,mode:state.G.mode,level:state.G.lvl,combo:state.G.maxCombo,waves:state.G.waves,date:Date.now()});
  state.hl=e?{e,t:6}:null}                       // resalta la entrada nueva unos segundos (si entró al top 10)
 go('over')}

/* ===== STUBS (se reemplazan por la copia literal en el Paso 6) ===== */
export function gameOver(){console.warn('TODO: gameOver (migrar en un paso posterior)')}
export function playClick(){console.warn('TODO: playClick (migrar en un paso posterior)')}
