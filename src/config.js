// Constantes de balance y datos estáticos. COPIA LITERAL del original (solo se añadió 'export').
/* ===== CONSTANTES (ajusta el balance aquí) ===== */
export const W=960,H=600,DT=1/60;               // resolución lógica y paso fijo (60 FPS lógicos)
export const ORB_LIFE=6, ORB_MIN=5, ORB_MAX=50; // vida del orbe (s) y rango de valor
export const WAVE_GAP=[20,30], WAVE_DUR=[8,15], TELEGRAPH=2, INVULN=1.5, COMBO_TIME=7;
export const PU={shield:{n:'Escudo',c:'#ffd166',d:4},magnet:{n:'Imán',c:'#2de2e6',d:6},slow:{n:'Tiempo lento',c:'#a07bff',d:4},freeze:{n:'Congelar',c:'#ffffff',d:2},bomb:{n:'Detonador',c:'#ff8a3d',d:0},combo:{n:'Combo x2',c:'#ff5ea8',d:5}};
export const PUK=Object.keys(PU);
/* Solo 2 modos con el mismo sistema de puntos (val:1). Hardcore (flag hc): 1 vida y oleadas más frecuentes (wave:.65) */
export const MODS=[
 {n:'Normal',d:'3 vidas · dificultad progresiva',wave:1,cnt:1,val:1,life:1,hp:3,spd:1,cmb:1},
 {n:'Hardcore',d:'1 vida · oleadas más frecuentes',wave:.65,cnt:1,val:1,life:1,hp:1,spd:1,cmb:1,hc:true},
 {n:'Oleada infinita',d:'Sobrevive el máximo tiempo posible',wave:1,cnt:1.4,val:1,life:1,hp:1,spd:1.1,cmb:1,endless:true}
];
export const ACH=[
 {id:'w5',n:'Sobrevive 5 oleadas',ic:'🌊',d:'Llega a la oleada 5 en Normal o Hardcore.'},
 {id:'c8',n:'Alcanza combo x8',ic:'🔥',d:'Encadena orbes hasta combo x8 (racha perfecta).'},
 {id:'c15',n:'Alcanza combo x15',ic:'💥',d:'Encadena orbes hasta combo x15 (requiere power-up Combo x2).'},
 {id:'o100',n:'Recoge 100 orbes en una partida',ic:'💎',d:'Recoge 100 orbes sin morir.'},
 {id:'boss1',n:'Derrota a un jefe',ic:'👑',d:'Derrota al jefe del nivel 10.'},
 {id:'hc1000',n:'Hardcore: más de 1000 puntos',ic:'💀',d:'Termina una partida Hardcore con más de 1000 puntos.'}
];
export const SKINS=[
 {id:'default',n:'Clásico',req:null,d:'El cursor de siempre.'},
 {id:'star',n:'Estrella',req:'c15',d:'Desbloqueado con combo x15.'},
 {id:'ring',n:'Anillo doble',req:'o100',d:'Desbloqueado con 100 orbes en una partida.'},
 {id:'diamond',n:'Rombo',req:'w5',d:'Desbloqueado con 5 oleadas.'}
];
/* --- Constantes de menú y récords (nuevo) --- */
export const NAME_MAX=12, SCORES_MAX=10;                        // longitud máxima del nombre y tamaño de la tabla
export const MODE_C={normal:'#7dffb2',hardcore:'#ff3d5a',endless:'#2de2e6'};      // color de la etiqueta de cada modo
export const LVMSG={2:'¡Oleadas más frecuentes!',3:'¡Patrones combinados!',5:'¡Mini-oleadas!',7:'¡Círculos rebotadores!'};
