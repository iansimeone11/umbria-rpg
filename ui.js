'use strict';
(() => {
 const A=AO;
 class Renderer {
  constructor(canvas){this.canvas=canvas;this.c=canvas.getContext('2d');this.c.imageSmoothingEnabled=false;}
  draw(game){const c=this.c,a=A.Art,t=game.time;c.clearRect(0,0,832,608);c.drawImage(a.map,0,0);
   for(const item of game.loot){const x=item.x*32,y=item.y*32;const g=c.createRadialGradient(x+16,y+19,1,x+16,y+19,23);g.addColorStop(0,'#b6a65c40');g.addColorStop(1,'#b6a65c00');c.fillStyle=g;c.fillRect(x-8,y-8,48,48);c.drawImage(a.icons[item.kind],x+3,y+5,26,26);}
   // Y-sort the world actors so characters overlap naturally.
   const actors=[game.player,...game.enemies.filter(e=>e.hp>0)].sort((a,b)=>a.py-b.py);
   for(const e of actors){const x=Math.round(e.px),y=Math.round(e.py);c.fillStyle='#060c0990';c.beginPath();c.ellipse(x+16,y+26,12,5,0,0,7);c.fill();
    if(game.target===e){c.strokeStyle='#cda666';c.lineWidth=1;c.beginPath();c.ellipse(x+16,y+27,16,7,0,0,7);c.stroke();for(const dx of [-2,30]){c.fillStyle='#d4ad64';c.fillRect(x+dx,y+13,2,5);} }
    const frame=e.step<1?Math.floor(e.step*4)%4:0;c.drawImage(a.sprites[e.kind][e.dir][frame],x,y-12);
    if(e.paralyzed>0){c.strokeStyle='#a3bac6';c.lineWidth=1;for(let i=0;i<3;i++){c.beginPath();c.ellipse(x+16,y+19-i*9,13,4,0,0,Math.PI*2);c.stroke();}for(let i=0;i<5;i++){c.fillStyle='#c5d9ee';c.fillRect(x+(i*7+t*14)%32,y+((i*11+t*16)%35)-10,1,2);}}
   }
   c.drawImage(a.dark,0,0);
   // Warm torch pools are independent of the pixel-sharp world textures.
   for(const [tx,ty]of A.TORCHES){const x=tx*32+16,y=ty*32+20,f=Math.sin(t*11+tx*3)*2;const g=c.createRadialGradient(x,y,2,x,y,90+f);g.addColorStop(0,'#fcb74a25');g.addColorStop(.35,'#ed982d14');g.addColorStop(1,'#f58b2200');c.fillStyle=g;c.fillRect(x-94,y-94,188,188);A.Art.rect(c,x-3,y,6,11,'#27251b');A.Art.rect(c,x-1,y-2,2,10,'#a5803e');A.Art.rect(c,x-3,y-7+f,6,8-f,'#c9712f');A.Art.rect(c,x-2,y-5+f,4,5-f,'#ffbb5e');A.Art.rect(c,x-1,y-3,2,4,'#ffedb4');}
   // Names and health bars are drawn above darkness for legibility.
   for(const e of actors){const x=e.px+16,y=e.py-18;if(e===game.player){this.label('Aldren',x,y,'#c8d9b3',10);if(e.paralyzed>0)this.label(e.paralyzed.toFixed(1)+' s',x,e.py+43,'#c4b6fa',10);}else if(game.target===e||e.hp<e.maxHp){this.label(e.name,x,y-2,'#d2c49c',9);A.Art.rect(c,x-17,y+4,34,4,'#19211b');A.Art.rect(c,x-16,y+5,32*e.hp/e.maxHp,2,'#b37457');}}
   for(const fx of game.effects)this.effect(fx,t);
   for(const f of game.floating){c.globalAlpha=Math.min(1,f.life*2);this.label(f.text,f.x,f.y-(f.max-f.life)*31,f.color,11);c.globalAlpha=1;}
   if(game.player.hp<game.player.maxHp*.25){const v=c.createRadialGradient(416,304,180,416,304,470);v.addColorStop(0,'#6f140000');v.addColorStop(1,'#a51a164f');c.fillStyle=v;c.fillRect(0,0,832,608);}
  }
  label(text,x,y,color,size){const c=this.c;c.font=`bold ${size}px monospace`;c.textAlign='center';c.textBaseline='bottom';const half=c.measureText(text).width/2;x=Math.max(half+4,Math.min(828-half,x));c.fillStyle='#0a110d';c.fillText(text,Math.round(x)+1,Math.round(y)+1);c.fillStyle=color;c.fillText(text,Math.round(x),Math.round(y));}
  effect(fx,t){const c=this.c,p=1-fx.life/fx.max,r=A.Art.rng(fx.seed+Math.floor(t*24));c.save();c.globalAlpha=Math.min(1,fx.life*4);c.strokeStyle=fx.color;c.fillStyle=fx.color;
   if(fx.type==='bolt'||fx.type==='paralyze'){c.shadowColor=fx.color;c.shadowBlur=8;c.lineWidth=3;c.beginPath();c.moveTo(fx.sx,fx.sy);for(let i=1;i<11;i++){const k=i/10;c.lineTo(Math.round(fx.sx+(fx.tx-fx.sx)*k+(i<10?(r()-.5)*18:0)),Math.round(fx.sy+(fx.ty-fx.sy)*k+(i<10?(r()-.5)*18:0)));}c.stroke();c.shadowBlur=0;c.lineWidth=1;c.strokeStyle='#e6fbff';c.stroke();}
   else if(fx.type==='apocalypse'){c.shadowColor='#f98a32';c.shadowBlur=18;for(let i=0;i<30;i++){const x=fx.tx+(r()-.5)*42,y=fx.ty+10-r()*62*p;c.fillStyle=['#ffde93','#ffac4d','#cc5c38','#f48743'][i%4];c.fillRect(Math.round(x),Math.round(y),3+r()*5|0,5+r()*10|0);}c.shadowBlur=0;c.strokeStyle='#f8b361';c.beginPath();c.ellipse(fx.tx,fx.ty+14,15+18*p,7+7*p,0,0,7);c.stroke();}
   else if(fx.type==='melee'){c.lineWidth=2;c.beginPath();c.moveTo(fx.tx-12,fx.ty-10);c.lineTo(fx.tx+12,fx.ty+14);c.moveTo(fx.tx+12,fx.ty-10);c.lineTo(fx.tx-12,fx.ty+14);c.stroke();}
   else{for(let i=0;i<15;i++){const angle=i*2.4+t*3;const x=fx.tx+Math.cos(angle)*(10+p*20),y=fx.ty+Math.sin(angle)*(10+p*10)-p*25;c.fillRect(Math.round(x),Math.round(y),2,4);}c.beginPath();c.ellipse(fx.tx,fx.ty+12,12+p*20,5+p*8,0,0,7);c.stroke();}
   c.restore();
  }
 }
 class UI {
  constructor(game){this.game=game;this.lastInventory='';this.lastLog=-1;this.overlayKind='';this.statElements={};
   for(const [key,name,css,max]of [['hp','Vida','health','maxHp'],['mana','Maná','mana','maxMana'],['energy','Energía','energy','maxEnergy']]){const el=document.createElement('div');el.className='stat '+css;el.innerHTML=`<div class="stat-label"><span>${name}</span><span class="value"></span></div><div class="stat-track" role="meter" aria-label="${name}" aria-valuemin="0"><i></i></div>`;document.querySelector('#stats').append(el);this.statElements[key]={value:el.querySelector('.value'),bar:el.querySelector('i'),meter:el.querySelector('.stat-track'),max};}
   this.actions=A.SPELLS.map((s,i)=>{const el=document.createElement('button');el.className='action';el.title=`${s.name} [${s.key}] · ${s.mana||0} maná · ${s.cooldown}s${s.range?' · alcance '+s.range:''}`;el.setAttribute('aria-label',el.title);el.innerHTML=`<span class="binding">${s.key}</span><span class="action-name">${s.name}</span><span class="cooldown" hidden></span>`;el.insertBefore(this.icon(s.id),el.querySelector('.action-name'));el.onclick=()=>game.cast(i);document.querySelector('#hotbar').append(el);return el;});
   for(const [kind,label]of [['helm','Cabeza'],['robe','Torso'],['sword','Arma'],['shield','Escudo']]){const el=document.createElement('div');const slot=document.createElement('div');slot.className='slot';slot.title=A.ITEMS[kind].name;slot.append(this.icon(kind));const text=document.createElement('small');text.textContent=label;el.append(slot,text);document.querySelector('#equipment').append(el);}
   const ctx=document.querySelector('#portrait').getContext('2d');ctx.imageSmoothingEnabled=false;ctx.drawImage(A.Art.sprites.player[2][0],4,0,48,63);
  }
  icon(kind){const c=document.createElement('canvas');c.width=c.height=32;c.getContext('2d').drawImage(A.Art.icons[kind],0,0);return c;}
  update(){const g=this.game,p=g.player;
   for(const [key,el]of Object.entries(this.statElements)){el.value.textContent=`${Math.ceil(p[key])} / ${p[el.max]}`;el.bar.style.width=p[key]/p[el.max]*100+'%';el.meter.setAttribute('aria-valuenow',Math.ceil(p[key]));el.meter.setAttribute('aria-valuemax',p[el.max]);}
   document.querySelector('#gold').textContent=g.gold.toLocaleString('es');document.querySelector('#kills').textContent=`${g.kills} / ${g.enemies.length} almas`;document.querySelector('#quest-progress').textContent=`${g.kills} de ${g.enemies.length} guardianes`;document.querySelector('#quest-fill').style.width=g.kills/g.enemies.length*100+'%';document.querySelector('#coords').textContent=`X: ${String(p.x).padStart(2,'0')} · Y: ${String(p.y).padStart(2,'0')}`;
   document.querySelector('#objective').textContent=g.won?'Cripta liberada · Recoge tu botín':p.paralyzed>0?'Estás paralizado · Usa Remover [5]':'Elimina a los guardianes de la cripta';
   this.actions.forEach((el,i)=>{const cd=el.querySelector('.cooldown');cd.hidden=g.cooldowns[i]<=0;cd.textContent=g.cooldowns[i].toFixed(1);});
   const hash=JSON.stringify(g.inventory);if(hash!==this.lastInventory){this.lastInventory=hash;const inv=document.querySelector('#inventory');inv.replaceChildren();for(let i=0;i<20;i++){const item=g.inventory[i];const el=document.createElement(item?'button':'div');el.className='slot'+(item?'':' empty');if(item){el.title=A.ITEMS[item.kind].name+(A.ITEMS[item.kind].description?' · '+A.ITEMS[item.kind].description:'');el.setAttribute('aria-label',el.title+' × '+item.count);el.append(this.icon(item.kind));const n=document.createElement('span');n.className='quantity';n.textContent=item.count>1?item.count:'';el.append(n);el.onclick=()=>{if(item.kind==='health')g.cast(5);else if(item.kind==='mana')g.cast(6);else g.log(A.ITEMS[item.kind].name+' · objeto del inventario.');};}inv.append(el);}document.querySelector('#capacity').textContent=g.inventory.length+' / 20';}
   if(this.lastLog!==g.logVersion){this.lastLog=g.logVersion;const log=document.querySelector('#log');log.replaceChildren();for(const l of g.logs){const el=document.createElement('p'),time=document.createElement('time');time.textContent=`${String(Math.floor(l.time/60)).padStart(2,'0')}:${String(Math.floor(l.time%60)).padStart(2,'0')}`;el.append(time,document.createTextNode(l.text));log.append(el);}}
   const target=document.querySelector('#target');target.hidden=!g.target;if(g.target){target.replaceChildren(document.createTextNode(g.target.name));const bar=document.createElement('div');bar.className='target-bar';const fill=document.createElement('i');fill.style.width=g.target.hp/g.target.maxHp*100+'%';bar.append(fill);target.append(bar);}
   if(g.dead&&this.overlayKind!=='dead')this.overlay('dead');
  }
  overlay(kind){const g=this.game,el=document.querySelector('#overlay');this.overlayKind=kind;el.hidden=!kind;g.paused=!!kind;if(!kind){document.querySelector('#game').focus({preventScroll:true});return;}
   let heading='',body='';if(kind==='help'){heading='El arte de sobrevivir';body='<div class="keys"><span><kbd>W A S D</kbd> / <kbd>↑ ↓ ← →</kbd> Mover</span><span><kbd>CLIC</kbd> Seleccionar objetivo</span><span><kbd>1</kbd> Descarga eléctrica</span><span><kbd>2</kbd> Paralizar al enemigo</span><span><kbd>3</kbd> Apocalipsis</span><span><kbd>4</kbd> Curar vida</span><span><kbd>5</kbd> Remover parálisis</span><span><kbd>6</kbd> Poción de vida</span><span><kbd>7</kbd> Poción de maná</span><span><kbd>8</kbd> Ataque cuerpo a cuerpo</span><span><kbd>TAB</kbd> Cambiar objetivo</span><span><kbd>E</kbd> Recoger / automático</span></div><p>Puedes beber y lanzar hechizos mientras te mueves. Las paredes bloquean los hechizos. Los acólitos pueden paralizarte. Escape pausa la partida.</p>';}
   else if(kind==='dead'){heading='La cripta reclama otra alma';body=`<p>Has derrotado a ${g.kills} guardianes.<br>El camino permanece abierto para quien vuelva a intentarlo.</p>`;}
   else{heading='Un instante de silencio';body='<p>Tu aventura está en pausa.</p>';}
   el.innerHTML=`<span class="diamond" style="font-size:32px">ᛟ</span><h2>${heading}</h2>${body}`;const button=document.createElement('button');button.textContent=kind==='dead'?'Volver a la cripta':'Continuar aventura';button.onclick=()=>{if(kind==='dead'){g.reset();this.lastLog=-1;}this.overlay('');};el.append(button);button.focus({preventScroll:true});
  }
 }
 A.Renderer=Renderer;A.UI=UI;
})();
