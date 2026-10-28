// Utilidades puras (sin estado, sin DOM). COPIA LITERAL del original (solo se añadió 'export').
/* ===== MATEMÁTICAS / AZAR ===== */
export const rnd=(a,b)=>a+Math.random()*(b-a),ri=(a,b)=>Math.floor(rnd(a,b+1)),pick=a=>a[Math.floor(Math.random()*a.length)];
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),dist=(a,b,c,d)=>Math.hypot(a-c,b-d);
/* ===== FORMATO ===== */
export function fdate(ms){const d=new Date(ms);if(isNaN(d))return '--/--/--';const p=n=>String(n).padStart(2,'0');
 return p(d.getDate())+'/'+p(d.getMonth()+1)+'/'+p(d.getFullYear()%100)}   // fecha corta dd/mm/aa
export function fmtTime(s){s=Math.max(0,s);return Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0')}   // mm:ss
/* ===== ORDEN DE TABLAS ===== */
export const byScore=(a,b)=>b.score-a.score||(a.date||0)-(b.date||0);   // mayor puntuación primero; empate: la más antigua
/* ===== COLOR ===== */
export const orbHue=o=>120-120*clamp(o.age/o.life,0,1),orbColor=o=>o.golden?'#ffd166':'hsl('+orbHue(o)+',90%,60%)';
export const darken=(h,f)=>{const n=parseInt(h.slice(1),16);return 'rgb('+[n>>16&255,n>>8&255,n&255].map(v=>Math.round(v*f)).join(',')+')'};
export const hexA=(h,a)=>{const n=parseInt(h.slice(1),16);return 'rgba('+(n>>16&255)+','+(n>>8&255)+','+(n&255)+','+a+')'};
