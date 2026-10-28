// Aparición de orbes y power-ups. COPIA LITERAL del original (solo cambian los identificadores de estado).
// spawnCircle / waveCount / chooseTheme llegan en el Paso 4. Depende solo de la base y de entities/; NO importa de render/.
import {W,H,ORB_LIFE,ORB_MIN,ORB_MAX,PUK} from '../config.js';
import {rnd,dist,clamp,pick} from '../utils.js';
import {state} from '../state.js';
import {createOrb} from '../entities/orb.js';

/* ===== SPAWN: orbes, power-ups y círculos ===== */
export function spawnOrb(){
 for(let i=0;i<10;i++){const x=rnd(50,W-50),y=rnd(90,H-50);
  if(state.G.orbs.every(o=>dist(o.x,o.y,x,y)>70)){const golden=Math.random()<0.05;   // 5% dorados: 3x valor, mitad de vida
   state.G.orbs.push(createOrb(x,y,ORB_LIFE*state.G.mod.life*Math.max(.4,1-.05*(state.G.lvl-1))*(golden?0.5:1),rnd(0,6),golden));return}}}   // la vida del orbe se acorta con el nivel (tope 40%: 2.4 s)
export const orbVal=o=>{const base=Math.round((ORB_MAX-(ORB_MAX-ORB_MIN)*clamp(o.age/o.life,0,1))*(1+.1*(state.G.lvl-1))*state.G.mod.val);return Math.round(base*(o.golden?3:1))};
export function spawnPU(){state.G.puOrb={x:rnd(80,W-80),y:rnd(110,H-80),k:pick(PUK),age:0,life:8}}
