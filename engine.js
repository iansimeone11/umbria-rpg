'use strict';
(() => {
 const A=AO,T=A.TILE;
 class Game {
  constructor(){this.reset();}
  reset(){
   this.player={x:8,y:10,px:8*T,py:10*T,fromX:8*T,fromY:10*T,step:1,duration:.16,dir:2,kind:'player',hp:360,maxHp:360,mana:240,maxMana:240,energy:100,maxEnergy:100,paralyzed:0};
   this.enemies=A.ENEMIES.map((e,i)=>({...e,id:i,maxHp:e.hp,px:e.x*T,py:e.y*T,fromX:e.x*T,fromY:e.y*T,step:1,duration:e.kind==='acolyte'?.45:.37,dir:2,paralyzed:0,attack:1+i*.2,think:i*.15}));
   this.inventory=[{kind:'health',count:18},{kind:'mana',count:24},{kind:'sword',count:1},{kind:'robe',count:1},{kind:'key',count:1},{kind:'helm',count:1},{kind:'shield',count:1}];
   this.loot=[{x:11,y:10,kind:'gold',count:45},{x:5,y:6,kind:'mana',count:3},{x:18,y:8,kind:'health',count:2}];
   this.gold=240;this.kills=0;this.target=null;this.effects=[];this.floating=[];this.cooldowns=Array(8).fill(0);this.time=0;this.logs=[];this.paused=false;this.dead=false;this.won=false;this.questAwarded=false;this.lastError='';this.lastErrorAt=-10;this.log('Has entrado en Las criptas del olvido.');this.log('Selecciona un enemigo y lanza tu primer hechizo.');
  }
  log(text){this.logs.push({text,time:this.time});if(this.logs.length>4)this.logs.shift();this.logVersion=(this.logVersion||0)+1;}
  error(text){if(this.lastError!==text||this.time-this.lastErrorAt>1){this.log(text);this.lastError=text;this.lastErrorAt=this.time;}return false;}
  walkable(x,y){return Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&y>=0&&x<A.WIDTH&&y<A.HEIGHT&&A.MAP[y][x]==='.';}
  occupied(x,y,actor){return[this.player,...this.enemies].some(e=>e!==actor&&e.hp>0&&((e.x===x&&e.y===y)||(e.step<1&&Math.round(e.fromX/T)===x&&Math.round(e.fromY/T)===y)));}
  move(actor,dx,dy){if(actor.step<1||actor.paralyzed>0||(!dx&&!dy))return false;actor.dir=dy<0?0:dx>0?1:dy>0?2:3;const x=actor.x+dx,y=actor.y+dy;if(!this.walkable(x,y)||this.occupied(x,y,actor))return false;actor.fromX=actor.px;actor.fromY=actor.py;actor.x=x;actor.y=y;actor.step=0;return true;}
  lineOfSight(a,b){let x=a.x,y=a.y,dx=Math.abs(b.x-x),dy=-Math.abs(b.y-y),sx=x<b.x?1:-1,sy=y<b.y?1:-1,err=dx+dy;while(x!==b.x||y!==b.y){const e2=2*err;if(e2>=dy){err+=dy;x+=sx;}if(e2<=dx){err+=dx;y+=sy;}if(!this.walkable(x,y))return false;}return true;}
  distance(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}
  select(id){this.target=this.enemies.find(e=>e.id===id&&e.hp>0)||null;}
  cycle(){const list=this.enemies.filter(e=>e.hp>0&&this.distance(this.player,e)<=10).sort((a,b)=>a.id-b.id);if(!list.length){this.target=null;return;}this.target=list[(list.indexOf(this.target)+1)%list.length];}
  text(actor,text,color){this.floating.push({x:actor.px+16,y:actor.py-9,text,color,life:1.4,max:1.4});}
  addEffect(type,source,target,color){this.effects.push({type,sx:source.px+16,sy:source.py+6,tx:target.px+16,ty:target.py+12,life:type==='apocalypse'?.65:.45,max:type==='apocalypse'?.65:.45,color,seed:this.time*1000|0});}
  damage(enemy,amount){if(enemy.hp<=0)return;enemy.hp=Math.max(0,enemy.hp-amount);this.text(enemy,'−'+amount,'#ffcf7d');if(enemy.hp===0){this.kills++;this.loot.push({x:enemy.x,y:enemy.y,kind:'gold',count:35+enemy.id*7});this.loot.push({x:enemy.x,y:enemy.y,kind:enemy.id%2?'health':'mana',count:2});this.log(`${enemy.name} ha caído. Hay objetos en el suelo.`);if(this.target===enemy)this.target=null;if(this.kills===this.enemies.length&&!this.questAwarded){this.questAwarded=true;this.gold+=350;this.won=true;this.log('Encargo completado: recibes 350 monedas de oro.');this.text(this.player,'CRIPTA LIBERADA','#d7d595');}}}
  cast(index){
   if(this.paused||this.dead)return false;const s=A.SPELLS[index],p=this.player;if(!s)return false;
   if(this.cooldowns[index]>0)return this.error(`${s.name} todavía se está recargando.`);
   if(s.id==='health'||s.id==='mana')return this.drink(s.id,index);
   let target=p;
   if(s.range){target=this.target;if(!target||target.hp<=0)return this.error('Selecciona un objetivo con clic o Tab.');if(this.distance(p,target)>s.range)return this.error(`Objetivo fuera de alcance (${s.range} casillas).`);if(!this.lineOfSight(p,target))return this.error('Un obstáculo bloquea la línea de visión.');}
   if(p.mana<(s.mana||0))return this.error('No tienes suficiente maná. Usa una poción [7].');
   if(s.id==='melee'&&p.energy<8)return this.error('No tienes suficiente energía.');
   if(s.id==='heal'&&p.hp===p.maxHp)return this.error('Tu vida ya está completa.');
   p.mana-=s.mana||0;this.cooldowns[index]=s.cooldown;
   if(s.words)this.text(p,s.words,s.color);
   this.addEffect(s.id,p,target,s.color);if(this.onSound)this.onSound(s.sound||330);
   if(s.id==='paralyze'){target.paralyzed=4;this.log(`${target.name} está paralizado durante 4 segundos.`);}
   else if(s.id==='heal'){const amount=Math.min(s.heal,p.maxHp-p.hp);p.hp+=amount;this.text(p,'+'+amount,'#adf29c');this.log(`Has recuperado ${amount} puntos de vida.`);}
   else if(s.id==='cleanse'){p.paralyzed=0;this.log('Has removido la parálisis. Puedes moverte.');}
   else if(s.damage){if(s.id==='melee')p.energy-=8;this.damage(target,s.damage);this.log(`Has lanzado ${s.name} por ${s.damage} puntos de daño.`);}
   return true;
  }
  drink(kind,index=kind==='health'?5:6){const p=this.player,stat=kind==='health'?'hp':'mana',max=kind==='health'?'maxHp':'maxMana';if(p[stat]===p[max])return this.error(`Tu ${kind==='health'?'vida':'maná'} ya está al máximo.`);const item=this.inventory.find(i=>i.kind===kind&&i.count>0);if(!item)return this.error('No te quedan pociones de ese tipo.');const amount=Math.min(100,p[max]-p[stat]);item.count--;p[stat]+=amount;this.cooldowns[index]=A.SPELLS[index].cooldown;this.text(p,'+'+Math.ceil(amount)+' '+(kind==='health'?'VIDA':'MANÁ'),kind==='health'?'#fc9b86':'#9fcfff');this.addEffect('heal',p,p,kind==='health'?'#d2766d':'#6fa9ea');this.log(`Has bebido una poción de ${kind==='health'?'vida':'maná'}.`);this.inventory=this.inventory.filter(i=>i.count>0);if(this.onSound)this.onSound(520);return true;}
  pickup(){if(this.paused||this.dead||this.player.step<1)return;const p=this.player;for(let i=this.loot.length-1;i>=0;i--){const item=this.loot[i];if(item.x!==p.x||item.y!==p.y)continue;if(item.kind==='gold')this.gold+=item.count;else{let stack=this.inventory.find(s=>s.kind===item.kind);if(stack)stack.count+=item.count;else if(this.inventory.length<20)this.inventory.push({kind:item.kind,count:item.count});else{this.error('El inventario está lleno.');continue;}}this.loot.splice(i,1);this.log(`Has recogido ${item.count} × ${A.ITEMS[item.kind].name}.`);if(this.onSound)this.onSound(1200);}}
  // A short breadth-first search prevents monsters getting permanently stuck behind tombs.
  chase(enemy){const p=this.player,queue=[[enemy.x,enemy.y,0,0]],seen=new Set([enemy.x+','+enemy.y]);for(let i=0;i<queue.length&&i<450;i++){let [x,y,firstX,firstY]=queue[i];if(Math.abs(x-p.x)+Math.abs(y-p.y)===1){if(i)this.move(enemy,firstX,firstY);return;}for(const [dx,dy]of [[0,-1],[1,0],[0,1],[-1,0]]){const nx=x+dx,ny=y+dy,k=nx+','+ny;if(seen.has(k)||!this.walkable(nx,ny)||this.occupied(nx,ny,enemy))continue;seen.add(k);queue.push([nx,ny,i?firstX:dx,i?firstY:dy]);}}}
  update(dt,keys){if(this.paused||this.dead)return;this.time+=dt;const p=this.player;this.cooldowns=this.cooldowns.map(v=>Math.max(0,v-dt));
   for(const e of [p,...this.enemies]){e.paralyzed=Math.max(0,e.paralyzed-dt);if(e.step<1){e.step=Math.min(1,e.step+dt/e.duration);e.px=e.fromX+(e.x*T-e.fromX)*e.step;e.py=e.fromY+(e.y*T-e.fromY)*e.step;}}
   if(p.step===1){if(keys.has('w')||keys.has('arrowup'))this.move(p,0,-1);else if(keys.has('s')||keys.has('arrowdown'))this.move(p,0,1);else if(keys.has('a')||keys.has('arrowleft'))this.move(p,-1,0);else if(keys.has('d')||keys.has('arrowright'))this.move(p,1,0);}
   p.mana=Math.min(p.maxMana,p.mana+dt*3);p.energy=Math.min(p.maxEnergy,p.energy+dt*6);
   this.pickup();
   for(const e of this.enemies){if(e.hp<=0||e.paralyzed>0)continue;e.attack-=dt;e.think-=dt;const dist=this.distance(e,p);if(dist<1.5&&e.attack<=0&&this.lineOfSight(e,p)){e.attack=1.3;const damage=e.kind==='acolyte'?22:16;p.hp=Math.max(0,p.hp-damage);this.text(p,'−'+damage,'#ff8070');this.addEffect('melee',e,p,'#e08c75');if(p.hp===0){this.dead=true;this.log('Has caído en la cripta. Reinicia para volver a intentarlo.');break;}}
    else if(e.kind==='acolyte'&&dist<5&&dist>1.5&&e.attack<=0&&this.lineOfSight(e,p)){e.attack=4;p.paralyzed=2;this.addEffect('paralyze',e,p,'#ad92d0');this.text(p,'PARALIZADO · 5 REMOVER','#c9b5f5');this.log('El acólito te paralizó. Usa Remover [5].');}
    if(dist<8&&dist>=1.5&&e.think<=0&&e.step===1){e.think=.22;this.chase(e);}
   }
   this.effects=this.effects.filter(e=>(e.life-=dt)>0);this.floating=this.floating.filter(e=>(e.life-=dt)>0);
  }
 }
 A.Game=Game;
})();

