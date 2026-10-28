// Audio (Web Audio, osciladores). COPIA LITERAL del original; 'muted' se expone con isMuted()/toggleMute().
/* ===== AUDIO (Web Audio, osciladores) ===== */
let ac=null,muted=false;
export function initAudio(){if(!ac){try{ac=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(ac&&ac.state==='suspended')ac.resume()}
export function tone(f,d=.12,type='sine',v=.08,slide=0){
 if(!ac||muted)return;const t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain();
 o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),t+d);
 g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g);g.connect(ac.destination);o.start(t);o.stop(t+d)}
export const seq=(fs,gap,type,v)=>fs.forEach((f,i)=>setTimeout(()=>tone(f,.15,type,v),i*gap));
export const sfx={collect:m=>tone(520+m*90,.12,'triangle',.09),miss:()=>tone(200,.2,'sawtooth',.06,-100),
 power:()=>seq([660,990],90,'square',.06),hit:()=>tone(120,.3,'sawtooth',.12,-60),level:()=>seq([523,659,784,1047],90,'triangle',.08),
 die:()=>tone(300,.9,'sawtooth',.12,-260),alarm:p=>tone(300+p*500,.12,'square',.05),boom:()=>tone(160,.4,'sawtooth',.12,-120),
 nav:()=>tone(420,.06,'triangle',.05)}; // nav: sonido suave al moverse por el menú
export const ARP=[220,261.6,329.6,392,329.6,261.6]; // arpegio de fondo
export const isMuted=()=>muted;          // reemplaza las lecturas directas de 'muted' (drawMenu)
export const toggleMute=()=>{muted=!muted};   // reemplaza 'muted=!muted' del keydown (tecla M)
