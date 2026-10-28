// Persistencia en localStorage (prefijo 'av_'), migraciones y tablas de récords.
// COPIA LITERAL del original, con DOS adaptaciones mecánicas (ver sección E del plan):
//  - addScore recibe el estado como primer parámetro (st) para evitar un import circular storage<->state.
//  - la migración de logros y el chequeo de localStorage se envuelven en funciones (mismo cuerpo).
import {SCORES_MAX} from './config.js';
import {byScore} from './utils.js';

export const store={get(k,d){try{const v=localStorage.getItem('av_'+k);return v===null?d:JSON.parse(v)}catch(e){return d}},
 set(k,v){try{localStorage.setItem('av_'+k,JSON.stringify(v));return true}catch(e){return false}}};

// Migración de ids de logros antiguos a los nuevos
export const ACH_MIG={'w3':'w5','c5':'c8','c10':'c15','o50':'o100','hc500':'hc1000'};
// Muta 'ach' en el sitio y persiste solo si hubo cambios (idéntico al bloque inline original).
export function migrateAch(ach){
let achChanged=false;
Object.keys(ACH_MIG).forEach(oldId=>{
 if(ach[oldId]){ach[ACH_MIG[oldId]]=1;delete ach[oldId];achChanged=true}
});
if(achChanged)store.set('ach',ach);
}

// ¿Funciona localStorage? (en modo privado puede fallar). Si no, el juego sigue y avisamos en pantalla.
export function probeStore(){try{const k='av__test';localStorage.setItem(k,'1');localStorage.removeItem(k);return true}catch(e){return false}}

// Carga las dos tablas independientes ('av_scores_normal' y 'av_scores_hardcore').
// Migración: si existe el antiguo 'av_scores' (mezclado), reparte sus entradas por modo, guarda y lo elimina.
export function loadScores(){
 const ok=e=>e&&typeof e.name==='string'&&typeof e.score==='number';
 const list=k=>{const a=store.get(k,[]);return Array.isArray(a)?a.filter(ok):[]};
 let n=list('scores_normal'),h=list('scores_hardcore');
 const old=store.get('scores',null);
 if(Array.isArray(old))old.filter(ok).forEach(e=>{if(e.mode==='hardcore')h.push(e);else if(e.mode==='normal')n.push(e)});
 const top=(a,m)=>a.filter(e=>e.mode===m).sort(byScore).slice(0,SCORES_MAX);
 n=top(n,'normal');h=top(h,'hardcore');
 if(Array.isArray(old)){const x=store.set('scores_normal',n),y=store.set('scores_hardcore',h);
  if(x&&y){try{localStorage.removeItem('av_scores')}catch(e){}}}
 return [n,h]}

// Agrega la entrada a la tabla de su modo, ordena, recorta al top 10 y guarda solo esa tabla.
// Devuelve la entrada si quedó dentro del top 10, o null si no entró.
export function addScore(st,e){const hc=e.mode==='hardcore',t=(hc?st.scoresHardcore:st.scoresNormal).concat(e).sort(byScore).slice(0,SCORES_MAX);
 if(hc)st.scoresHardcore=t;else st.scoresNormal=t;
 if(!store.set(hc?'scores_hardcore':'scores_normal',t))st.storeOK=false;return t.includes(e)?e:null}
