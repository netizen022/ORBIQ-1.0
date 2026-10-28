// Entidad orbe: función pura que construye el objeto (sin estado, sin DOM, sin azar).
// HELPER NUEVO (pedido en el Paso 3): en el original esto era el literal dentro de spawnOrb(); se extrae sin cambiar campos ni valores.
// El azar (posición, golden, ph) y la vida siguen decidiéndose en systems/spawn.js, en el mismo orden que el original.
export const createOrb=(x,y,life,ph,golden)=>({x,y,age:0,life,ph,golden});
