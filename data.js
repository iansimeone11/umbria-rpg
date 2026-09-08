'use strict';
window.AO = {};
AO.TILE = 32;
AO.WIDTH = 26;
AO.HEIGHT = 19;
// # stone wall, o solid pillar, ~ solid tomb, . walkable floor.
AO.MAP = [
 '##########################',
 '#.....#..................#',
 '#.....#....o........o....#',
 '#.....#..................#',
 '###.###.......~~.........#',
 '#........................#',
 '#.........o........o.....#',
 '#....~~..................#',
 '#........................#',
 '#..o..............~~.....#',
 '#........................#',
 '#.........o........o.....#',
 '#........................#',
 '#...~~...................#',
 '#..............##..#######',
 '#..o.......o...#.........#',
 '#..............#.........#',
 '#........................#',
 '##########################'
];
AO.TORCHES = [[2,0],[9,0],[16,0],[23,0],[0,6],[0,12],[25,5],[25,11],[6,2],[16,14],[22,14],[7,18],[13,18],[23,18]];
AO.SPELLS = [
 {id:'bolt',name:'Descarga',key:'1',mana:20,cooldown:.75,range:7,damage:65,color:'#a0e7ff',words:'VAX IN TAR',sound:660},
 {id:'paralyze',name:'Parálisis',key:'2',mana:25,cooldown:4,range:6,damage:0,color:'#9bb8ff',words:'AN HOAX VORP',sound:440},
 {id:'apocalypse',name:'Apocalipsis',key:'3',mana:55,cooldown:3,range:6,damage:180,color:'#ff9b49',words:'VAX CORP',sound:110},
 {id:'heal',name:'Curación',key:'4',mana:30,cooldown:2,heal:85,color:'#a3f59e',words:'IN VAS MANI',sound:880},
 {id:'cleanse',name:'Remover',key:'5',mana:15,cooldown:1.5,color:'#8bffb8',words:'AN EX POR',sound:990},
 {id:'health',name:'P. vida',key:'6',cooldown:.3,color:'#ff7971'},
 {id:'mana',name:'P. maná',key:'7',cooldown:.3,color:'#73b6ff'},
 {id:'melee',name:'Ataque',key:'8',cooldown:.6,range:1.5,damage:28,color:'#ffde86',sound:160}
];
AO.ITEMS = {health:{name:'Poción de vida',description:'Restaura 100 de vida · tecla 6'},mana:{name:'Poción de maná',description:'Restaura 100 de maná · tecla 7'},sword:{name:'Espada de hierro'},robe:{name:'Túnica del círculo gris'},key:{name:'Llave de la cripta'},helm:{name:'Capucha del errante'},shield:{name:'Escudo de roble'},gold:{name:'Monedas de oro'}};
AO.ENEMIES = [
 {x:14,y:8,name:'Esqueleto guardián',kind:'skeleton',hp:210},
 {x:19,y:4,name:'Acólito del vacío',kind:'acolyte',hp:260},
 {x:21,y:10,name:'Esqueleto guardián',kind:'skeleton',hp:210},
 {x:7,y:15,name:'Carcelero espectral',kind:'acolyte',hp:280},
 {x:3,y:2,name:'Esqueleto olvidado',kind:'skeleton',hp:180},
 {x:22,y:16,name:'Custodio de la cripta',kind:'acolyte',hp:340},
 {x:13,y:3,name:'Esqueleto guardián',kind:'skeleton',hp:210}
];
