'use strict';
(() => {
 const A=AO;
 const canvas=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
 const rect=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
 // Seeded texture generator: map artwork remains stable between frames and runs.
 function rng(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return(seed>>>0)/4294967296;};}
 function tile(kind,seed){const cv=canvas(32,32),c=cv.getContext('2d'),r=rng(seed);
  if(kind==='floor'){
   rect(c,0,0,32,32,'#343c31');
   for(let y=0;y<32;y+=16)for(let x=0;x<32;x+=16){const n=Math.floor(r()*13);rect(c,x+1,y+1,15,15,`rgb(${48+n},${56+n},${45+n})`);rect(c,x+1,y+1,15,1,'#56604a');rect(c,x,y+15,16,1,'#252e23');}
   for(let i=0;i<70;i++){const v=r();rect(c,Math.floor(r()*32),Math.floor(r()*32),v>.85?2:1,1,v>.5?'#72755a33':'#111e154f');}
   if(r()>.5){c.strokeStyle='#242e23';c.beginPath();c.moveTo(4,4);c.lineTo(9,8);c.lineTo(8,11);c.lineTo(13,15);c.stroke();}
  }else{
   rect(c,0,0,32,32,'#202720');
   for(let y=0;y<32;y+=8)for(let x=-((y/8)%2)*8;x<32;x+=16){let n=Math.floor(r()*18);rect(c,x+1,y+1,14,6,`rgb(${70+n},${76+n},${65+n})`);rect(c,x+1,y+1,14,1,'#858977');rect(c,x+2,y+2,1,3,'#737d65');rect(c,x+1,y+6,14,1,'#303b30');}
   for(let i=0;i<30;i++)rect(c,r()*32|0,r()*32|0,2,1,'#15241950');
  }return cv;
 }
 function sprite(kind,dir,frame){const cv=canvas(32,42),c=cv.getContext('2d');const moving=frame!==0;const step=moving?[0,2,0,-2][frame]:0,bob=frame%2;const side=dir===1||dir===3,back=dir===0;
  const p=(x,y,w,h,col)=>rect(c,x,y-bob,w,h,col);
  // Feet are animated separately from the upper body, with four directional silhouettes.
  const boot=kind==='skeleton'?'#acaa86':'#3c3021';
  p(10,33+step,5,6,boot);p(18,33-step,5,6,boot);p(9,38+step,7,2,'#171d17');p(18,38-step,7,2,'#171d17');
  if(kind==='skeleton'){
   p(11,17,12,17,'#484b3a');p(15,18,3,17,'#c0b992');
   for(let y=19;y<29;y+=4){p(10,y,14,2,'#b6b18c');p(12,y+2,10,1,'#747961');}
   p(7,20+step,3,13,'#b2b292');p(24,20-step,3,13,'#a5a88a');p(11,5,12,12,'#d0c7a0');p(10,7,14,7,'#b3b28f');p(12,5,10,2,'#e0d7b0');
   if(!back){p(side?(dir===1?19:10):12,10,side?4:3,3,'#262c24');if(!side)p(19,10,3,3,'#262c24');p(14,15,7,2,'#5b5b45');p(16,12,2,3,'#343d30');}
   p(27,19-step,2,20,'#59573e');p(27,19-step,2,13,'#a5b5ac');p(26,32-step,5,2,'#8f7843');
  }else{
   const player=kind==='player',dark=player?'#2e4651':'#393248',mid=player?'#4e6e79':'#62516c',light=player?'#829591':'#8d7690';
   p(8,18,17,18,dark);p(6,30,21,7,dark);p(11,18,10,17,mid);p(14,20,3,15,light);p(9,33,2,5,mid);p(20,33,2,5,mid);p(10,26,13,3,'#4a3b24');p(16,26,3,3,'#c6ac67');
   p(6,18+step,4,12,mid);p(24,18-step,4,12,dark);p(7,29+step,3,4,'#b09a6c');p(25,29-step,3,4,'#b09a6c');
   p(10,5,14,14,dark);p(12,3,10,3,mid);p(9,8,16,8,dark);p(11,5,3,10,mid);p(13,4,7,2,light);
   if(!back){const faceX=side?(dir===1?18:10):13;p(faceX,9,side?5:8,8,player?'#c5af7c':'#242b27');p(faceX,9,side?5:8,2,'#625c46');p(faceX+1,12,2,1,player?'#282d29':'#95e7b6');if(!side)p(faceX+5,12,2,1,player?'#282d29':'#95e7b6');p(faceX+2,16,4,2,player?'#8a7857':'#26342b');}
   if(back){p(13,8,8,12,mid);p(14,10,2,11,light);}
   let staffX=dir===3?3:29;p(staffX,14-step,2,27,'#7a6440');p(staffX-2,10-step,5,6,'#9a8d61');p(staffX-1,8-step,3,5,player?'#85cbd7':'#a197dd');p(staffX,9-step,1,2,'#e6f9dc');
  }return cv;
 }
 function icon(kind){const cv=canvas(32,32),c=cv.getContext('2d'),p=(x,y,w,h,col)=>rect(c,x,y,w,h,col);
  if(kind==='health'||kind==='mana'){
   const col=kind==='health'?'#ba4841':'#548ec2';p(13,4,7,4,'#b3a070');p(12,8,9,5,'#a6aa92');p(9,13,15,13,'#718577');p(11,12,11,15,'#a1b1a0');p(11,16,11,9,col);p(13,13,2,10,'#e4ede0aa');p(12,27,9,1,'#15291e');p(17,18,4,5,kind==='health'?'#e06d55':'#77b7d4');
  }else if(kind==='sword'||kind==='melee'){p(15,3,3,18,'#d0d5ba');p(18,3,2,17,'#728d87');p(14,5,1,16,'#728d87');p(10,21,15,3,'#b39956');p(16,24,3,5,'#806347');p(14,29,6,2,'#bea166');
  }else if(kind==='robe'||kind==='helm'){p(12,4,9,4,'#9ca999');p(9,8,15,9,'#536d73');p(12,9,9,5,'#1d302e');p(7,17,19,12,'#395764');p(11,18,10,11,'#75918c');p(15,18,3,11,'#a3b6a2');if(kind==='helm')c.clearRect(0,21,32,11);
  }else if(kind==='shield'){p(8,6,18,17,'#bbaa6a');p(10,8,14,15,'#6c7551');p(13,23,8,4,'#a49b64');p(16,8,3,18,'#b7ad7e');p(10,15,14,3,'#a69c66');
  }else if(kind==='key'){p(7,7,11,9,'#cbb16c');p(10,9,5,4,'#263324');p(15,15,3,12,'#d1ad56');p(18,23,6,3,'#c9a656');p(22,20,3,5,'#dbc17b');
  }else if(kind==='gold'){for(let i=0;i<4;i++){p(7+i*3,18-i*3,11,6,'#94762d');p(7+i*3,17-i*3,11,4,'#d4b354');p(9+i*3,17-i*3,5,1,'#f0d780');}
  }else if(kind==='bolt'){[[19,3,7,4],[15,7,8,5],[11,12,12,4],[15,16,5,4],[11,20,6,4],[7,24,6,4]].forEach(v=>p(...v,'#8dcced'));p(16,8,3,6,'#e5ffff');p(15,15,4,7,'#dcffff');
  }else if(kind==='apocalypse'){p(11,10,11,17,'#be5033');p(8,18,18,6,'#ad4535');p(17,3,3,13,'#e8893e');p(10,7,3,11,'#f3a252');p(13,15,8,11,'#f7ae52');p(15,20,4,8,'#ffe295');p(22,12,3,9,'#eb783f');
  }else if(kind==='paralyze'){p(6,8,4,15,'#6d8cb4');p(22,8,4,15,'#6d8cb4');p(10,4,12,4,'#8eb5d4');p(10,24,12,4,'#8eb5d4');p(15,9,3,13,'#c7d7ef');p(11,14,11,3,'#b5c9e7');
  }else{const col=kind==='heal'?'#a2d38a':'#7acaa3';p(14,5,5,22,col);p(6,13,21,5,col);if(kind==='cleanse'){p(5,6,4,4,'#caf5bf');p(23,22,4,4,'#caf5bf');}p(15,13,3,5,'#ecf7cf');}
  return cv;
 }
 A.Art={canvas,rng,rect,tiles:[],sprites:{},icons:{}};
 A.Art.init=()=>{
  const a=A.Art;a.tiles=Array.from({length:16},(_,i)=>tile('floor',99+i*37));a.walls=Array.from({length:5},(_,i)=>tile('wall',120+i*17));
  for(const kind of ['player','skeleton','acolyte'])a.sprites[kind]=Array.from({length:4},(_,d)=>Array.from({length:4},(_,f)=>sprite(kind,d,f)));
  for(const kind of new Set([...Object.keys(A.ITEMS),...A.SPELLS.map(s=>s.id)]))a.icons[kind]=icon(kind);
  a.map=canvas(A.WIDTH*32,A.HEIGHT*32);const c=a.map.getContext('2d');
  for(let y=0;y<A.HEIGHT;y++)for(let x=0;x<A.WIDTH;x++)c.drawImage(a.tiles[(x*7+y*13)%16],x*32,y*32);
  const r=rng(2026);
  // Moss, scattered gravel and bones are painted into the static map cache.
  for(let i=0;i<750;i++){let x=r()*832|0,y=r()*608|0;rect(c,x,y,r()*3+1|0,1,r()>.55?'#83906b44':'#142c1c50');}
  for(const [x,y] of [[7,5],[16,12],[12,7],[20,15],[3,11],[21,7]]){rect(c,x*32+9,y*32+18,13,3,'#90927b');rect(c,x*32+7,y*32+16,3,6,'#a4a389');rect(c,x*32+22,y*32+16,3,6,'#999e82');rect(c,x*32+8,y*32+8,7,6,'#a6a68b');rect(c,x*32+9,y*32+10,2,2,'#353f2f');rect(c,x*32+13,y*32+10,2,2,'#353f2f');}
  // Central ritual mosaic.
  c.strokeStyle='#6b715044';c.lineWidth=2;c.beginPath();c.arc(10.5*32,9.5*32,86,0,Math.PI*2);c.stroke();c.beginPath();c.arc(10.5*32,9.5*32,73,0,Math.PI*2);c.stroke();
  for(let i=0;i<12;i++){const t=i*Math.PI/6;rect(c,336+Math.cos(t)*80,304+Math.sin(t)*80,3,3,'#8e95644a');}
  for(let y=0;y<A.HEIGHT;y++)for(let x=0;x<A.WIDTH;x++){const t=A.MAP[y][x],px=x*32,py=y*32;
   if(t==='#'){c.drawImage(a.walls[(x+y)%5],px,py);if(A.MAP[y+1]?.[x]==='.'){rect(c,px,py+24,32,8,'#1a251b');rect(c,px,py+24,32,2,'#59634b');rect(c,px,py+32,32,6,'#070e0960');}}
   if(t==='o'){rect(c,px+6,py+7,25,29,'#050d0970');rect(c,px+5,py+25,23,5,'#69735a');rect(c,px+8,py+5,17,21,'#555e4a');rect(c,px+9,py+5,4,20,'#7f866c');rect(c,px+21,py+5,4,20,'#3b4836');rect(c,px+5,py+1,23,8,'#7c8168');rect(c,px+5,py+1,23,2,'#a1a48a');rect(c,px+4,py+29,25,2,'#303c2e');}
   if(t==='~'){rect(c,px,py+9,32,22,'#18261a');rect(c,px+1,py+5,30,21,'#68705b');rect(c,px+3,py+6,26,2,'#8a8f74');rect(c,px+3,py+8,26,16,'#4a5643');rect(c,px+14,py+9,4,13,'#7a8268');rect(c,px+9,py+12,14,3,'#7a8268');}
  }
  a.dark=canvas(832,608);const d=a.dark.getContext('2d');rect(d,0,0,832,608,'rgba(3,10,7,.64)');d.globalCompositeOperation='destination-out';
  for(const [tx,ty] of [...A.TORCHES,[10,9],[4,15],[20,8]]){const x=tx*32+16,y=ty*32+24;const g=d.createRadialGradient(x,y,8,x,y,150);g.addColorStop(0,'rgba(0,0,0,.95)');g.addColorStop(.4,'rgba(0,0,0,.6)');g.addColorStop(1,'rgba(0,0,0,0)');d.fillStyle=g;d.fillRect(x-150,y-150,300,300);}
 };
})();
