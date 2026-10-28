// Canvas 2D compartido (cv, ctx) y ajuste de tamaño. Los módulos son diferidos: el DOM ya existe al evaluarse.
import {W,H} from './config.js';
import {state} from './state.js';

export const cv=document.getElementById('c'),ctx=cv.getContext('2d');
export function resize(){const s=Math.min(innerWidth/W,innerHeight/H),d=window.devicePixelRatio||1;
 cv.style.width=W*s+'px';cv.style.height=H*s+'px';cv.style.left=(innerWidth-W*s)/2+'px';cv.style.top=(innerHeight-H*s)/2+'px';
 cv.width=Math.round(W*s*d);cv.height=Math.round(H*s*d);state.K=cv.width/W}
