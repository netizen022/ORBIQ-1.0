// Entidad círculo enemigo: función pura que construye el objeto (sin estado, sin DOM, sin azar).
// HELPER NUEVO (pedido en el Paso 3): en el original esto era el literal dentro de spawnCircle(); se extrae sin cambiar campos ni valores.
// Aún NO la usa nadie: spawnCircle llega en el Paso 4. 'bounce' se deriva de 'type' igual que en el original.
export const createCircle=(x,y,r,vx,vy,type,turn,color)=>({x,y,r,vx,vy,type,turn,age:0,rot:0,tr:[],bounce:type==='bounce',color});
