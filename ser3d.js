/* =========================================================
   SER 3D · BIOFERIA 2027
   El cuerpo 3D (miles de puntos con luz) y los elementos del "ser" de la app Catálisis,
   extraídos tal cual de la versión 3D publicada. Se usan para dibujar las semillas de la web.
   Origen: catalisis-one.vercel.app (app3d.html). No editar a mano: se regenera con build-ser3d.js.
   ========================================================= */
(function () {
  const isDark = () => (window.__serDark !== undefined ? window.__serDark : document.documentElement.dataset.tema === "oscuro");
  const V = { rot: 0 };
const CONCEPTS=[
 {id:'aire',name:'Aire',word:'conectar',color:'#79F2F4',cls:'w-aire',intro:'Hilos finos que unen cosas que estaban lejos.',
  elements:[
   {label:'Flujo',desc:'Filamentos que fluyen a tu alrededor.',delta:{filaments:6}},
   {label:'Libélula',desc:'Alas finas y translúcidas.',delta:{dragonfly:1}},
   {label:'Red',desc:'Una malla hexagonal que te conecta por dentro.',delta:{lattice:1}},
   {label:'Marca',desc:'Facetas geométricas, nítidas.',delta:{facets:2}},
   {label:'Mariposa',desc:'Alas azules con ojos y un corazón rojo.',delta:{wings:1}}]},
 {id:'tierra',name:'Tierra',word:'cuidar',color:'#EFD74F',cls:'w-tierra',intro:'Lo que se cuida echa raíces.',
  elements:[
   {label:'Rama',desc:'Ramas de tinta que se bifurcan.',delta:{branches:4}},
   {label:'Rueda',desc:'Una rueda con rayos que te hace girar.',delta:{wheels:1,spin:.6}},
   {label:'Huella',desc:'Textura de sello y grano sobre tu piel.',delta:{grain:1}},
   {label:'Raíz',desc:'Raíces finas hacia abajo.',delta:{fibers:14}},
   {label:'Brote',desc:'Hojas que buscan la luz.',delta:{lobes:3}}]},
 {id:'agua',name:'Agua',word:'transformar',color:'#4F8FEF',cls:'w-agua',intro:'Nada queda igual después de pasar por el agua.',
  elements:[
   {label:'Caracol',desc:'Una espiral grabada en tu centro.',delta:{spiral:1}},
   {label:'Estrella',desc:'Cinco brazos, como una estrella de mar.',delta:{arms:5}},
   {label:'Cuadrado',desc:'Cuadrados anidados que giran.',delta:{squares:1}},
   {label:'Gota',desc:'Gotas que caen de vos.',delta:{drops:6}},
   {label:'Onda',desc:'Ondas que se expanden y te vuelven fluido.',delta:{ripples:1,wobble:.3}}]},
 {id:'fuego',name:'Fuego',word:'hacer',color:'#FF0000',cls:'w-fuego',intro:'Hacer es dejar marca.',
  elements:[
   {label:'Trama',desc:'Una espiral de puntos de medio tono.',delta:{dots:28}},
   {label:'Pincelada',desc:'Un trazo rojo que te atraviesa.',delta:{brush:1}},
   {label:'Grieta',desc:'Barras rotas, como un collage.',delta:{glitch:4}},
   {label:'Chispa',desc:'Chispas que no paran de saltar.',delta:{sparks:1}},
   {label:'Rombo',desc:'Rombos de línea, precisos.',delta:{diamonds:2}}]},
 {id:'corazon',name:'Corazón',word:'celebrar',color:'#FF00B2',cls:'w-corazon',intro:'Celebrar es hacerse ver.',
  elements:[
   {label:'Erizo',desc:'Púas magenta hacia todos lados.',delta:{spikes:9}},
   {label:'Mármol',desc:'Vetas rosas y rojas por dentro.',delta:{marble:1}},
   {label:'Latido',desc:'Un halo que late.',delta:{glow:1}},
   {label:'Confeti',desc:'Papelitos de colores en el aire.',delta:{confetti:1}},
   {label:'Brillo',desc:'Destellos que titilan.',delta:{shine:1}}]},
];
const BASE={core:1.55,wobble:.25,filaments:0,dragonfly:0,lattice:0,facets:0,wings:0,branches:0,wheels:0,spin:0,grain:0,fibers:0,lobes:0,spiral:0,arms:0,squares:0,drops:0,ripples:0,dots:0,brush:0,glitch:0,sparks:0,diamonds:0,spikes:0,marble:0,glow:0,confetti:0,shine:0};
const TRAITS=Object.keys(BASE);
const STAGES=[[0,'Semilla','Todavía no reaccionaste con nada.'],[1,'Brote','Empezaste a transformarte.'],[3,'Organismo','Ya tenés una forma propia.'],[6,'Ser','Nadie más en la feria es como vos.']];
const INK='#111111',SEED='#B4B4BE',PAPER='#F7F7F4';

function hex2rgb(h){const n=parseInt(h.slice(1),16);return [n>>16,n>>8&255,n&255]}
function rgb2hex(r){return '#'+r.map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('')}
function hexA(h,a){const [r,g,b]=hex2rgb(h);return `rgba(${r},${g},${b},${a})`}

function mixColor(mix){let tot=0,acc=[0,0,0];for(const c of CONCEPTS){const w=mix[c.id]||0;if(!w)continue;tot+=w;const rgb=hex2rgb(c.color);for(let i=0;i<3;i++)acc[i]+=rgb[i]*w}
 return tot?rgb2hex(acc.map(v=>v/tot)):SEED}
function topConcepts(mix){return CONCEPTS.filter(c=>mix[c.id]).sort((a,b)=>mix[b.id]-mix[a.id])}

function rnd(seed){let s=seed%2147483647;if(s<=0)s+=2147483646;return()=>(s=s*16807%2147483647)/2147483647}
let FX={dentA:0,dentM:0,squash:0,bubble:0};
function blobPath(ctx,cx,cy,R,T,t,seed){
 ctx.beginPath();const wob=T.wobble*(1+FX.squash*2.2)*(1-FX.bubble*.6);const arms=Math.round(T.arms);
 for(let i=0;i<=120;i++){const a=i/120*Math.PI*2;
  let r=R*(1+wob*.38*Math.sin(3*a+seed)+wob*.18*Math.sin(5*a-t*1.3)+.025*Math.sin(t*2)+FX.squash*.12*Math.sin(11*a+t*9));
  if(arms>0)r*=1+Math.min(1,T.arms)*.9*Math.max(0,Math.cos(arms*(a-t*.15)))**3;
  if(FX.dentM>0){const c=Math.cos(a-FX.dentA);r*=1-FX.dentM*.55*Math.max(0,c)**2+FX.dentM*.25*Math.max(0,-c)**2}
  const x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}
 ctx.closePath()}
function draw(ctx,size,T,t,mix,seed,paper){
 const cx=size/2,cy=size/2,R=size*.13*T.core*(1+FX.bubble*.25)*(1-FX.squash*.2);
 const rr=rnd(seed+7);const base=mixColor(mix);const tc=topConcepts(mix);const c2=tc[1]?tc[1].color:base;const c1=tc[0]?tc[0].color:base;
 const dark=!paper&&isDark(),BL=dark?'#6FA2F5':'#1E3BC2',OUT=dark?"#F2F2EE":INK,PA=paper||(dark?"#121214":PAPER);
 const A3=!!(window.B3D&&size>120);
 if(window.B3D&&size>200){ctx.save();ctx.translate(cx,cy);ctx.rotate(-(V.rot||0));ctx.translate(0,R*2.25);ctx.scale(1,.2);
  let gs=ctx.createRadialGradient(0,0,0,0,0,R*1.6);gs.addColorStop(0,hexA(base,.28));gs.addColorStop(1,hexA(base,0));ctx.fillStyle=gs;ctx.beginPath();ctx.arc(0,0,R*1.6,0,7);ctx.fill();
  gs=ctx.createRadialGradient(0,0,0,0,0,R*1.1);gs.addColorStop(0,'rgba(0,0,0,.5)');gs.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=gs;ctx.beginPath();ctx.arc(0,0,R*1.1,0,7);ctx.fill();ctx.restore()}
 // halo (corazón)
 if(T.glow>0){const g=ctx.createRadialGradient(cx,cy,R*.6,cx,cy,R*(2.3+.2*Math.sin(t*2.4)));g.addColorStop(0,hexA('#FF00B2',.5*Math.min(1,T.glow)));g.addColorStop(.6,hexA('#FF4F7A',.15*T.glow));g.addColorStop(1,hexA('#FF00B2',0));ctx.fillStyle=g;ctx.fillRect(cx-size,cy-size,size*2,size*2)}
 // ondas (agua)
 if(T.ripples>0){ctx.strokeStyle=hexA('#4F8FEF',.6);ctx.lineWidth=size*.004;for(let i=0;i<3;i++){const f=((t*.3+i/3)%1);ctx.globalAlpha=(1-f)*.7*Math.min(1,T.ripples);ctx.beginPath();ctx.arc(cx,cy,R*(1.1+f*1.4),0,7);ctx.stroke()}ctx.globalAlpha=1}
 // filamentos (aire)
 if(T.filaments>0&&!A3){const n=Math.round(T.filaments);ctx.strokeStyle=hexA('#4F8FEF',.55);ctx.lineWidth=size*.0025;ctx.lineCap='round';
  for(let i=0;i<n;i++){const a0=i/n*Math.PI*2+seed*.01;ctx.beginPath();for(let k=0;k<=40;k++){const f=k/40;const a=a0+f*1.6+.25*Math.sin(t*.8+i+f*6);const d=R*(1.05+f*1.6);k?ctx.lineTo(cx+Math.cos(a)*d,cy+Math.sin(a)*d):ctx.moveTo(cx+Math.cos(a)*d,cy+Math.sin(a)*d)}ctx.stroke()}}
 // estela de puntos (fuego)
 if(T.dots>0&&!A3){const n=Math.round(T.dots);const a0=t*(.15+.5*T.spin)+seed;for(let i=0;i<n;i++){const f=i/n;const a=a0+f*Math.PI*1.8;const d=R*(1.35+f*1.1);const r=R*.13*(1-f)+1.2;ctx.fillStyle='#FF2A00';ctx.beginPath();ctx.arc(cx+Math.cos(a)*d,cy+Math.sin(a)*d,r,0,7);ctx.fill()}}
 // rueda (tierra)
 if(T.wheels>0&&!A3){ctx.save();ctx.translate(cx,cy);ctx.rotate(t*.6);ctx.strokeStyle=BL;ctx.lineWidth=size*.006;ctx.globalAlpha=Math.min(1,T.wheels);ctx.beginPath();ctx.arc(0,0,R*1.55,0,7);ctx.stroke();ctx.lineWidth=size*.003;for(let i=0;i<16;i++){const a=i/16*Math.PI*2;ctx.beginPath();ctx.moveTo(Math.cos(a)*R*.5,Math.sin(a)*R*.5);ctx.lineTo(Math.cos(a)*R*1.55,Math.sin(a)*R*1.55);ctx.stroke()}ctx.restore()}
 // cuadrados anidados (agua)
 if(T.squares>0&&!A3){ctx.save();ctx.translate(cx,cy);ctx.strokeStyle=OUT;ctx.lineWidth=size*.003;ctx.globalAlpha=Math.min(1,T.squares)*.85;for(let i=0;i<3;i++){ctx.save();ctx.rotate(t*.2*(i%2?-1:1)+i*.4);const s=R*(1.5+i*.35);ctx.strokeRect(-s,-s,s*2,s*2);ctx.restore()}ctx.restore()}
 // rombos (fuego)
 if(T.diamonds>0&&!A3){const n=Math.round(T.diamonds);ctx.strokeStyle=OUT;ctx.lineWidth=size*.004;for(let i=0;i<n;i++){const a=Math.PI*.75+i*2.3;const d=R*1.75;const x=cx+Math.cos(a)*d,y=cy+Math.sin(a)*d;const s=R*.32;ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t+i)*.2);for(let k=0;k<3;k++){const q=s*(1-k*.3);ctx.beginPath();ctx.moveTo(0,-q);ctx.lineTo(q*.7,0);ctx.lineTo(0,q);ctx.lineTo(-q*.7,0);ctx.closePath();ctx.stroke()}ctx.restore()}}
 // púas (corazón)
 if(T.spikes>0&&!A3){const n=Math.round(T.spikes);ctx.save();ctx.shadowColor='#FF00B2';ctx.shadowBlur=size*.02;ctx.fillStyle='#FF00B2';for(let i=0;i<n;i++){const a=i/n*Math.PI*2+seed*.01+t*.08*T.spin;const len=R*1.3*(1+.08*Math.sin(t*1.7+i));const w=R*.18;const sx=cx+Math.cos(a)*R*.7,sy=cy+Math.sin(a)*R*.7;const tx=cx+Math.cos(a)*(R*.7+len),ty=cy+Math.sin(a)*(R*.7+len);const px=-Math.sin(a)*w,py=Math.cos(a)*w;ctx.beginPath();ctx.moveTo(sx+px,sy+py);ctx.lineTo(tx,ty);ctx.lineTo(sx-px,sy-py);ctx.closePath();ctx.fill()}ctx.restore()}
 // raíces y ramas (tierra)
 if((T.fibers>0||T.branches>0)&&!A3){ctx.strokeStyle=hexA(OUT,.85);ctx.lineWidth=Math.max(1.2,size*.0045);ctx.lineCap='round';
  const n=Math.round(T.fibers);for(let i=0;i<n;i++){const a=rr()*Math.PI*2;const l=R*(.5+rr()*1.1);const k=(rr()-.5)*.8;const x0=cx+Math.cos(a)*R*.85,y0=cy+Math.sin(a)*R*.85;const x1=cx+Math.cos(a+k*.4)*(R*.85+l),y1=cy+Math.sin(a+k*.4)*(R*.85+l);const mx=cx+Math.cos(a+k)*(R*.85+l*.5),my=cy+Math.sin(a+k)*(R*.85+l*.5);ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo(mx,my,x1,y1);ctx.stroke()}
  const b=Math.round(T.branches);const r2=rnd(seed+21);const branch=(x,y,a,l,d)=>{if(d>3||l<R*.1)return;const x1=x+Math.cos(a)*l,y1=y+Math.sin(a)*l;ctx.lineWidth=Math.max(.8,size*.004*(1-d*.25));ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x1,y1);ctx.stroke();branch(x1,y1,a-.5+r2()*.3,l*.65,d+1);branch(x1,y1,a+.5-r2()*.3,l*.65,d+1)};
  for(let i=0;i<b;i++){const a=-Math.PI/2+i*1.9+seed*.02;branch(cx+Math.cos(a)*R*.9,cy+Math.sin(a)*R*.9,a,R*.9,0)}}
 // alas libélula (aire)
 if(T.dragonfly>0&&!A3){const fl=.85+.15*Math.sin(t*14);for(const s of[-1,1])for(const u of[-1,1]){ctx.save();ctx.translate(cx,cy);ctx.scale(s*fl*Math.min(1,T.dragonfly),1);ctx.rotate(u*.35);ctx.fillStyle=hexA('#79F2F4',.45);ctx.strokeStyle=hexA(BL,.5);ctx.lineWidth=size*.002;ctx.beginPath();ctx.ellipse(R*1.6,0,R*1.5,R*.32,0,0,7);ctx.fill();ctx.stroke();for(let i=1;i<6;i++){ctx.beginPath();ctx.moveTo(R*.3+i*R*.45,-R*.3);ctx.lineTo(R*.3+i*R*.45,R*.3);ctx.stroke()}ctx.restore()}}
 // alas mariposa (aire)
 if(T.wings>0&&!A3){const fl=1+.06*Math.sin(t*3);for(const s of[-1,1]){ctx.save();ctx.translate(cx,cy);ctx.scale(s*fl*Math.min(1,T.wings),1);ctx.fillStyle=BL;ctx.beginPath();ctx.moveTo(R*.2,-R*.1);ctx.bezierCurveTo(R*1.3,-R*2.1,R*2.9,-R*1.1,R*2.4,R*.1);ctx.bezierCurveTo(R*2.6,R*1.3,R*1.2,R*1.7,R*.2,R*.6);ctx.closePath();ctx.fill();ctx.fillStyle='#FF0000';ctx.beginPath();ctx.moveTo(R*.2,-R*.1);ctx.lineTo(R*1.3,-R*.5);ctx.lineTo(R*1.5,R*.2);ctx.lineTo(R*1.0,R*.8);ctx.lineTo(R*.2,R*.6);ctx.closePath();ctx.fill();const r3=rnd(seed+3);for(let i=0;i<7;i++){const x=R*(1.6+r3()*.9),y=R*(-1.3+r3()*2.2);ctx.fillStyle='#0B1070';ctx.beginPath();ctx.ellipse(x,y,R*.11,R*.15,0,0,7);ctx.fill();ctx.fillStyle='#BFE8FF';ctx.beginPath();ctx.ellipse(x,y,R*.05,R*.07,0,0,7);ctx.fill()}ctx.restore()}}
 // hojas (tierra)
 if(T.lobes>0&&!A3){const n=Math.ceil(T.lobes);for(let i=0;i<n;i++){const sc=Math.min(1,T.lobes-i);if(sc<=0)continue;const a=-Math.PI/2+i*2.1+seed*.01+.08*Math.sin(t*1.4+i);ctx.save();ctx.translate(cx+Math.cos(a)*R*.8,cy+Math.sin(a)*R*.8);ctx.rotate(a);ctx.scale(sc,sc);const L=R*1.25,W=R*.5;ctx.fillStyle='#EFD74F';ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(L*.5,-W,L,0);ctx.quadraticCurveTo(L*.5,W,0,0);ctx.fill();ctx.strokeStyle=PA;ctx.lineWidth=size*.006;ctx.beginPath();ctx.moveTo(L*.15,W*.12);ctx.quadraticCurveTo(L*.55,W*.1,L*.92,0);ctx.stroke();ctx.restore()}}
 // gotas (agua)
 if(T.drops>0&&!A3){const n=Math.round(T.drops);const r3=rnd(seed+11);for(let i=0;i<n;i++){const a=Math.PI*.35+r3()*Math.PI*.3;const ph=r3();const f=((t*.25+ph)%1);const d=R*(1.05+f*1.3);const x=cx+Math.cos(a)*d,y=cy+Math.sin(a)*d;const s=R*.12*(1-f*.5);ctx.fillStyle=hexA('#4F8FEF',1-f*.8);ctx.beginPath();ctx.moveTo(x,y-s*1.6);ctx.quadraticCurveTo(x+s,y,x,y+s);ctx.quadraticCurveTo(x-s,y,x,y-s*1.6);ctx.fill()}}
 // pincelada (fuego)
 if(T.brush>0&&!A3){ctx.save();ctx.translate(cx,cy);ctx.rotate(-.5+.05*Math.sin(t));ctx.globalAlpha=Math.min(1,T.brush);const g=ctx.createLinearGradient(-R*2.2,0,R*2.2,0);g.addColorStop(0,hexA('#FF0000',0));g.addColorStop(.3,'#FF0000');g.addColorStop(.7,'#FF6A00');g.addColorStop(1,hexA('#FF6A00',0));ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-R*2.2,-R*.1);ctx.quadraticCurveTo(0,-R*.5,R*2.2,-R*.15);ctx.quadraticCurveTo(0,R*.45,-R*2.2,R*.1);ctx.fill();ctx.restore()}
 // halo de luz del núcleo (color de la mezcla, con degradé)
 {const m=ctx.getTransform(),sc=Math.hypot(m.a,m.b)||1,sx=m.a*cx+m.c*cy+m.e,sy=m.b*cx+m.d*cy+m.f,cw=ctx.canvas.width,ch=ctx.canvas.height,room=Math.max(0,Math.min(sx,sy,cw-sx,ch-sy))/sc;const hr=Math.min(R*(2.7+.12*Math.sin(t*1.6)),room);if(hr>R){const hg=ctx.createRadialGradient(cx,cy,R*.8,cx,cy,hr);hg.addColorStop(0,hexA(base,.6));hg.addColorStop(.35,hexA(base,.28));hg.addColorStop(.7,hexA(base,.08));hg.addColorStop(1,hexA(base,0));ctx.fillStyle=hg;ctx.beginPath();ctx.arc(cx,cy,hr,0,7);ctx.fill()}}
 // núcleo
 if(A3)att3D(ctx,cx,cy,R,T,t,seed,0,size);
 const pat=(ctx)=>{ctx.save();
 if(T.marble>0){ctx.globalAlpha=Math.min(1,T.marble)*.75;for(let i=0;i<7;i++){ctx.strokeStyle=i%2?'#FF00B2':'#FF2A3A';ctx.lineWidth=R*.07;ctx.beginPath();for(let k=0;k<=30;k++){const f=k/30;const x=cx-R*1.3+f*R*2.6;const y=cy-R*.9+i*R*.3+Math.sin(f*7+i+t*.6)*R*.18;k?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke()}ctx.globalAlpha=1}
 if(T.glitch>0){const n=Math.round(T.glitch);const r4=rnd(seed+5);for(let i=0;i<n;i++){const x=cx-R+r4()*2*R;const w=R*(.1+r4()*.22);const off=Math.sin(t*5+i)*R*.08;ctx.fillStyle=i%2?'#FF0000':INK;ctx.globalAlpha=.9;ctx.fillRect(x,cy-R*1.3+off,w,R*2.6);ctx.globalAlpha=1}}
 if(T.lattice>0){ctx.strokeStyle=hexA(BL,.55*Math.min(1,T.lattice));ctx.lineWidth=size*.002;const h=R*.3;for(let row=-5;row<=5;row++)for(let col=-5;col<=5;col++){const x=cx+col*h*1.5+(row%2?h*.75:0),y=cy+row*h*.87;ctx.beginPath();for(let k=0;k<6;k++){const a=k/6*Math.PI*2+t*.1;k?ctx.lineTo(x+Math.cos(a)*h*.5,y+Math.sin(a)*h*.5):ctx.moveTo(x+Math.cos(a)*h*.5,y+Math.sin(a)*h*.5)}ctx.closePath();ctx.stroke()}}
 if(T.grain>0){const r5=rnd(seed+13);ctx.fillStyle=hexA(INK,.55*Math.min(1,T.grain));for(let i=0;i<160;i++){const a=r5()*7,d=r5()*R*1.1;ctx.fillRect(cx+Math.cos(a)*d,cy+Math.sin(a)*d,size*.004+r5()*size*.004,size*.003)}}
 if(T.spiral>0){ctx.strokeStyle=hexA(INK,.85);ctx.lineWidth=size*.004;ctx.beginPath();for(let i=0;i<220;i++){const a=i*.09+t*.2;const d=R*.92*(i/220);i?ctx.lineTo(cx+Math.cos(a)*d,cy+Math.sin(a)*d):ctx.moveTo(cx+Math.cos(a)*d,cy+Math.sin(a)*d)}ctx.stroke();for(let i=0;i<60;i++){const a=i*.33+t*.2;const d=R*.92*(i/60);ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*d,cy+Math.sin(a)*d);ctx.lineTo(cx+Math.cos(a)*(d+R*.07),cy+Math.sin(a)*(d+R*.07));ctx.stroke()}}
 ctx.restore()};
 if(window.B3D&&(size>120||B3.mini))body3D(ctx,size,cx,cy,R,T,t,seed,base,c1,c2,pat,!!window.B3HQ);
 else{
 ctx.save();ctx.shadowColor=hexA(base,.35);ctx.shadowBlur=size*.012;blobPath(ctx,cx,cy,R,T,t,seed);
 const g=ctx.createRadialGradient(cx-R*.3,cy-R*.3,R*.1,cx,cy,R*1.2);g.addColorStop(0,rgb2hex(hex2rgb(c1).map(v=>v+(255-v)*.2)));g.addColorStop(.3,c1);g.addColorStop(.75,base);g.addColorStop(1,c2);ctx.fillStyle=g;ctx.fill();ctx.restore();
 ctx.save();blobPath(ctx,cx,cy,R,T,t,seed);ctx.clip();
 pat(ctx);
 ctx.restore();
 ctx.strokeStyle=hexA(INK,.9);ctx.lineWidth=size*.0035;blobPath(ctx,cx,cy,R,T,t,seed);ctx.stroke();}
 if(A3)att3D(ctx,cx,cy,R,T,t,seed,1,size);
 // facetas (aire)
 if(T.facets>0&&!A3){const n=Math.round(T.facets);const s=R*.45;for(let i=0;i<n;i++){const x=cx+R*.5+i*s*.55,y=cy-R*.9-i*s*.35;ctx.fillStyle=OUT;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+s,y+s*.55);ctx.lineTo(x,y+s*1.1);ctx.closePath();ctx.fill();ctx.fillStyle=PA;ctx.beginPath();ctx.moveTo(x+s*.3,y+s*.55);ctx.lineTo(x+s*.6,y+s*.38);ctx.lineTo(x+s*.6,y+s*.72);ctx.closePath();ctx.fill()}}
 // brillo (corazón)
 if(T.shine>0&&!A3){const r6=rnd(seed+17);ctx.fillStyle='#FFFFFF';for(let i=0;i<8;i++){const a=r6()*7,d=R*(.6+r6()*1.6);const x=cx+Math.cos(a)*d,y=cy+Math.sin(a)*d;const s=R*.14*Math.max(0,Math.sin(t*3+i*1.3))*Math.min(1,T.shine);if(s<1)continue;ctx.beginPath();ctx.moveTo(x,y-s);ctx.quadraticCurveTo(x,y,x+s,y);ctx.quadraticCurveTo(x,y,x,y+s);ctx.quadraticCurveTo(x,y,x-s,y);ctx.quadraticCurveTo(x,y,x,y-s);ctx.fill();ctx.strokeStyle=hexA('#FF00B2',.8);ctx.lineWidth=size*.002;ctx.stroke()}}
 // confeti (corazón)
 if(T.confetti>0&&!A3){const r7=rnd(seed+19);const cols=['#FF00B2','#79F2F4','#EFD74F','#FF0000','#4F8FEF'];for(let i=0;i<22;i++){const ph=r7(),ax=r7();const f=((t*.12+ph)%1);const x=cx+(ax-.5)*R*4.4+Math.sin(t*2+i)*R*.2,y=cy-R*2.4+f*R*4.8;ctx.save();ctx.translate(x,y);ctx.rotate(t*2+i);ctx.fillStyle=cols[i%5];ctx.globalAlpha=Math.min(1,T.confetti);ctx.fillRect(-R*.06,-R*.035,R*.12,R*.07);ctx.restore()}}
}

/*B3D_START*/
// CUERPO 3D: el núcleo del ser es una superficie en el espacio (miles de puntos) que se gira con el dedo, con luz fija.
// Los patrones (mármol, grieta, red, huella, caracol) viven sobre esa superficie y giran con ella.
const B3={on:true,off:false,M:[1,0,0,0,1,0,0,0,1],wx:0,wy:0,tier:0,ms:0,n:0,since:0,ortho:0};
const B3_TIERS=[4600,3200,2200],B3_HQ=15000,B3_NB=110,B3_CL=22;
const b3Rx=a=>{const c=Math.cos(a),s=Math.sin(a);return[1,0,0,0,c,-s,0,s,c]},b3Ry=a=>{const c=Math.cos(a),s=Math.sin(a);return[c,0,s,0,1,0,-s,0,c]};
const b3mul=(A,B)=>{const R=new Array(9);for(let i=0;i<3;i++)for(let j=0;j<3;j++)R[i*3+j]=A[i*3]*B[j]+A[i*3+1]*B[3+j]+A[i*3+2]*B[6+j];return R};
function b3Ortho(M){let a=[M[0],M[1],M[2]],b=[M[3],M[4],M[5]];const n=v=>{const l=Math.hypot(v[0],v[1],v[2])||1;return[v[0]/l,v[1]/l,v[2]/l]};a=n(a);const d=a[0]*b[0]+a[1]*b[1]+a[2]*b[2];b=n([b[0]-d*a[0],b[1]-d*a[1],b[2]-d*a[2]]);const c=[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];return[...a,...b,...c]}
B3.M=b3mul(b3Rx(.25),b3Ry(-.4));
const B3_L=(()=>{const v=[-.45,.55,.7],n=Math.hypot(...v);return v.map(x=>x/n)})();
const B3_H=(()=>{const v=[B3_L[0],B3_L[1],B3_L[2]+1],n=Math.hypot(...v);return v.map(x=>x/n)})();
const b3cache={};
function b3Sphere(N){if(b3cache[N])return b3cache[N];
 const U=new Float32Array(N*3),T1=new Float32Array(N*3),T2=new Float32Array(N*3);
 for(let i=0;i<N;i++){const y=1-2*(i+.5)/N,r=Math.sqrt(1-y*y),a=i*2.399963229728653,x=Math.cos(a)*r,z=Math.sin(a)*r;U[i*3]=x;U[i*3+1]=y;U[i*3+2]=z;
  let rx=0,ry=1,rz=0;if(Math.abs(y)>.95){rx=1;ry=0}
  let tx=ry*z-rz*y,ty=rz*x-rx*z,tz=rx*y-ry*x;const l=Math.hypot(tx,ty,tz)||1;tx/=l;ty/=l;tz/=l;
  T1[i*3]=tx;T1[i*3+1]=ty;T1[i*3+2]=tz;T2[i*3]=y*tz-z*ty;T2[i*3+1]=z*tx-x*tz;T2[i*3+2]=x*ty-y*tx}
 return b3cache[N]={U,T1,T2,xs:new Float32Array(N),ys:new Float32Array(N),bk:new Uint16Array(N),ord:new Uint32Array(N),rd:new Float32Array(N)}}
// paleta de sombreado del cuerpo y, por cada clase de patrón, el color mezclado (se arma una sola vez y se guarda)
const b3pal={};
function b3Pal(base,c1){const key=base+c1;if(b3pal[key])return b3pal[key];
 const bc=hex2rgb(base),lc=hex2rgb(c1),mx=(a,b,f)=>a.map((v,i)=>v+(b[i]-v)*f),sh=(c,k)=>c.map(v=>v*k);
 const st=[[0,mx(sh(bc,.2),[18,14,40],.45)],[.3,mx(sh(bc,.46),[40,30,70],.25)],[.62,bc],[.88,mx(lc,[255,255,255],.45)],[1.15,[255,255,255]]];
 const C=[];for(let i=0;i<B3_NB;i++){const t=i/(B3_NB-1)*1.15;let a=st[0],b=st[1];for(let k=0;k<st.length-1;k++){if(t>=st[k][0]&&t<=st[k+1][0]){a=st[k];b=st[k+1];break}}
  const f=(t-a[0])/(b[0]-a[0]||1);C.push(a[1].map((v,j)=>v+(b[1][j]-v)*f))}
 return b3pal[key]={C,cache:{0:new Array(B3_NB*B3_CL),1:new Array(B3_NB*B3_CL)}}}
// patrón (1..7) → color y fuerza: mármol rosa/rojo, grieta roja/oscura, red azul, huella y caracol oscuros
const B3_PAT=[null,[255,0,178],[255,42,58],[255,0,0],[17,17,17],null,[17,17,17],[17,17,17]],B3_PA=[0,.75,.75,.9,.9,.7,.6,.85];
function b3Col(pl,idx,dk){const cc=pl.cache[dk?1:0];let s=cc[idx];if(s)return s;const b=(idx/B3_CL)|0,c=idx%B3_CL,sc=pl.C[b];let r=sc[0],g=sc[1],bl=sc[2];
 if(c>0){const ty=((c-1)/3|0)+1,lv=(c-1)%3+1,pc=ty===5?(dk?[236,244,255]:[20,36,120]):B3_PAT[ty],a=B3_PA[ty]*lv/3,v=b/(B3_NB-1)*1.15,k=Math.min(1.25,.35+.85*v);
  r+=(pc[0]*k-r)*a;g+=(pc[1]*k-g)*a;bl+=(pc[2]*k-bl)*a}
 return cc[idx]=`rgb(${Math.round(r)},${Math.round(g)},${Math.round(bl)})`}
const b3w={};
function b3Waves(seed){if(b3w[seed])return b3w[seed];const r=rnd(seed+101),W=[],amps=[.12,.1,.08,.07];
 for(let i=0;i<4;i++){const k=1.5+r()*2,th=r()*6.283,ph=Math.acos(2*r()-1);W.push([k*Math.sin(ph)*Math.cos(th),k*Math.cos(ph),k*Math.sin(ph)*Math.sin(th),r()*6.283,amps[i],(r()<.5?-1:1)*(.2+r()*.2)])}
 return b3w[seed]=W}
const b3A={};
const b3cnt=new Uint32Array(B3_NB*B3_CL+1);
function body3D(ctx,size,cx,cy,R,T,t,seed,base,c1,c2,pat,hq){
 const t0=performance.now();
 const tr=ctx.getTransform(),sc=Math.hypot(tr.a,tr.b)||1,dp=hq?1:Math.min(2,window.devicePixelRatio||1);
 const QS=hq?1.1:.62,s=(sc/dp)*QS;              // píxeles del lienzo auxiliar por unidad local
 const nArms=Math.round(T.arms||0)>0;const N=B3.mini?(nArms?1300:900):hq?(nArms?B3_HQ*1.4|0:B3_HQ):(nArms?Math.round(B3_TIERS[B3.tier]*1.5):B3_TIERS[B3.tier]),SP=b3Sphere(N),U=SP.U,T1=SP.T1,T2=SP.T2,xs=SP.xs,ys=SP.ys,bk=SP.bk,ord=SP.ord,rd=SP.rd;
 // forma: ondas suaves (según la semilla) + brazos + abolladura + vibración al apretar
 const WV=b3Waves(seed),wob=(T.wobble||0)*(1+FX.squash*2.2)*(1-FX.bubble*.6),m=wob*4.6;
 const na=Math.round(T.arms||0),am=Math.min(1,T.arms||0),sq=FX.squash||0,dm=FX.dentM||0;
 const EXT=Math.max(1.9,(1+m*(WV[0][4]+WV[1][4]+WV[2][4]+WV[3][4])+.03+sq*.12)*(na>0?1+am*.95:1)*(dm>0?1.25:1)*1.05);
 const BOX=Math.max(64,Math.min(2600,Math.ceil(2*EXT*R*s))),O=BOX/2,Rq=R*s;
 const bkey=hq?'h':B3.mini?'m':'n';const A=(b3A[bkey]=b3A[bkey]||document.createElement('canvas')),aq=A.getContext('2d');
 if(A.width!==BOX){A.width=BOX;A.height=BOX}aq.setTransform(1,0,0,1,0,0);aq.clearRect(0,0,BOX,BOX);
 const M=B3.M;let dx=0,dy=0,dz=0;
 if(dm>0){const a=FX.dentA,vx=Math.cos(a),vy=-Math.sin(a);dx=M[0]*vx+M[3]*vy;dy=M[1]*vx+M[4]*vy;dz=M[2]*vx+M[5]*vy}
 const w0=WV[0],w1=WV[1],w2=WV[2],w3=WV[3],tt=t;
 const rr=(x,y,z)=>{let d=w0[4]*Math.sin(w0[0]*x+w0[1]*y+w0[2]*z+w0[3]+tt*w0[5])+w1[4]*Math.sin(w1[0]*x+w1[1]*y+w1[2]*z+w1[3]+tt*w1[5])+w2[4]*Math.sin(w2[0]*x+w2[1]*y+w2[2]*z+w2[3]+tt*w2[5])+w3[4]*Math.sin(w3[0]*x+w3[1]*y+w3[2]*z+w3[3]+tt*w3[5]);
  let r=1+m*d+.025*Math.sin(tt*2);
  if(sq>0||na>0){const az=Math.atan2(z,x);if(sq>0)r+=sq*.12*Math.sin(11*az+9*tt);if(na>0){const c=Math.cos(na*(az-tt*.15));if(c>0){const c2=c*c;r*=1+am*.95*c2*c2*c2*Math.pow(Math.max(0,1-Math.abs(y)),2.5)}}}
  if(dm>0){const dd=x*dx+y*dy+z*dz;r*=1-dm*.55*(dd>0?dd*dd:0)+dm*.25*(dd<0?dd*dd:0)}
  return r};
 // patrones sobre la superficie
 const pm=Math.min(1,T.marble||0),pg=Math.round(T.glitch||0),pl=Math.min(1,T.lattice||0),pr=Math.min(1,T.grain||0),ps=Math.min(1,T.spiral||0);
 const anyPat=pm>.02||pg>0||pl>.02||pr>.02||ps>.02,dk=!!(typeof isDark==='function'&&isDark());
 let bars=null;if(pg>0){const r4=rnd(seed+5);bars=[];for(let i=0;i<pg;i++){const x=-1+r4()*2,w=(.1+r4()*.22)*.5;bars.push([x,w,i%2?3:4])}}
 const PL=b3Pal(base,c1),SQ3=.57735,NB=B3_NB,CL=B3_CL,NBT=NB*CL;b3cnt.fill(0);
 let pc=null;
 if(anyPat){const pk=N+'|'+seed+'|'+(pm*4|0)+'|'+pg+'|'+(pl*4|0)+'|'+(pr*4|0)+'|'+(ps*4|0);
  if(SP.pk===pk)pc=SP.pc;else{pc=SP.pc||(SP.pc=new Uint8Array(N));SP.pk=pk;
   for(let i=0;i<N;i++){const ux=U[i*3],uy=U[i*3+1],uz=U[i*3+2];
    let best=0,bt=0,bc=0;
   if(pm>.02){const q=uy*3.4+.16*Math.sin(ux*5+uz*3),k=Math.floor(q),f=q-k;if(f<.42){const e=Math.min(f,.42-f)*14,cv=(e>1?1:e)*pm*.75;if(cv>best){best=cv;bt=(k&1)?2:1;bc=cv/.75}}}
   if(bars){for(let q=0;q<bars.length;q++){const bb=bars[q],dd=Math.abs(ux-bb[0]);if(dd<bb[1]){const e=Math.min(1,(bb[1]-dd)*30),cv=e*.9;if(cv>best){best=cv;bt=bb[2];bc=e}}}}
   if(pl>.02){const A4=[ux+uy+uz,ux-uy-uz,-ux+uy-uz,-ux-uy+uz];let cvm=0;for(let q=0;q<4;q++){const sn=Math.abs(Math.sin(Math.PI*2.6*SQ3*A4[q]));if(sn<.27){const e=(.27-sn)*3.7;if(e>cvm)cvm=e}}const cv=cvm*pl*.55;if(cv>best){best=cv;bt=5;bc=cvm}}
   if(pr>.02){const h=Math.abs(Math.sin(i*12.9898)*43758.5453)%1;if(h<.07*pr){const cv=.6;if(cv>best){best=cv;bt=6;bc=1}}}
   if(ps>.02){const g=Math.atan2(uy,ux)/6.2832+Math.acos(uz<-1?-1:uz>1?1:uz)/Math.PI*3.4,f=g-Math.floor(g);if(f<.1){const e=Math.min(f,.1-f)*28,cv=(e>1?1:e)*ps*.85;if(cv>best){best=cv;bt=7;bc=e>1?1:e}}}
   pc[i]=bt>0?1+(bt-1)*3+((bc>.66?3:bc>.33?2:1)-1):0
}}}
 const fast=!(sq>0||na>0||dm>0),wk=[w0,w1,w2,w3],sm=Math.sin(tt*2)*.025;
 for(let i=0;i<N;i++){const j=i*3,ux=U[j],uy=U[j+1],uz=U[j+2];
  let nx,ny,nz,r0;
  if(fast){let d=0,gx=0,gy=0,gz=0;for(let q=0;q<4;q++){const w=wk[q],ph=w[0]*ux+w[1]*uy+w[2]*uz+w[3]+tt*w[5],sn=Math.sin(ph),cs=Math.cos(ph)*w[4];d+=w[4]*sn;gx+=cs*w[0];gy+=cs*w[1];gz+=cs*w[2]}
   r0=1+m*d+sm;const gu=gx*ux+gy*uy+gz*uz,f=m/r0;nx=ux-f*(gx-gu*ux);ny=uy-f*(gy-gu*uy);nz=uz-f*(gz-gu*uz)}
  else{r0=rr(ux,uy,uz);
  let ax=ux+T1[j]*.035,ay=uy+T1[j+1]*.035,az2=uz+T1[j+2]*.035,l=Math.hypot(ax,ay,az2);ax/=l;ay/=l;az2/=l;const r1=rr(ax,ay,az2);
  let bx=ux+T2[j]*.035,by=uy+T2[j+1]*.035,bz=uz+T2[j+2]*.035;l=Math.hypot(bx,by,bz);bx/=l;by/=l;bz/=l;const r2=rr(bx,by,bz);
  const q0x=ux*r0,q0y=uy*r0,q0z=uz*r0,e1x=ax*r1-q0x,e1y=ay*r1-q0y,e1z=az2*r1-q0z,e2x=bx*r2-q0x,e2y=by*r2-q0y,e2z=bz*r2-q0z;
  nx=e1y*e2z-e1z*e2y;ny=e1z*e2x-e1x*e2z;nz=e1x*e2y-e1y*e2x;if(nx*ux+ny*uy+nz*uz<0){nx=-nx;ny=-ny;nz=-nz}}
  const nl=Math.sqrt(nx*nx+ny*ny+nz*nz)||1;nx/=nl;ny/=nl;nz/=nl;const p0x=ux*r0,p0y=uy*r0,p0z=uz*r0;
  const Nx=M[0]*nx+M[1]*ny+M[2]*nz,Ny=M[3]*nx+M[4]*ny+M[5]*nz,Nz=M[6]*nx+M[7]*ny+M[8]*nz;
  if(Nz<-.02){bk[i]=65535;continue}
  rd[i]=r0>1?Math.pow(r0,1.5):1;xs[i]=O+(M[0]*p0x+M[1]*p0y+M[2]*p0z)*Rq;ys[i]=O-(M[3]*p0x+M[4]*p0y+M[5]*p0z)*Rq;
  const df=Math.max(0,Nx*B3_L[0]+Ny*B3_L[1]+Nz*B3_L[2]),sd=Math.max(0,Nx*B3_H[0]+Ny*B3_H[1]+Nz*B3_H[2]),spec=Math.pow(sd,42),rim=Math.pow(1-Math.max(0,Nz),3);
  let v=.1+.62*df+.62*spec+.22*rim*(.4+.6*Math.max(0,-Nx*.5+Ny*.4+.5));v=v>1.15?1.15:(v<0?0:v);
  const b=Math.round(v/1.15*(NB-1));
  // patrón de esta zona de la superficie (se calcula con la dirección del punto en el cuerpo, por eso gira con él)
  const cls=anyPat?pc[i]:0;
  const idx=b*CL+cls;bk[i]=idx;b3cnt[idx+1]++}
 for(let b=0;b<NBT;b++)b3cnt[b+1]+=b3cnt[b];
 const pos=b3cnt.slice(0,NBT);for(let i=0;i<N;i++){const b=bk[i];if(b!==65535)ord[pos[b]++]=i}
 const rad=Math.sqrt(4*Math.PI/N)*Rq*(hq?1.0:1.12);let k=0;
 for(let b=0;b<NBT;b++){const n=b3cnt[b+1]-b3cnt[b];if(!n)continue;aq.fillStyle=b3Col(PL,b,dk);aq.beginPath();for(let q=0;q<n;q++){const i=ord[k++],ri=rad*rd[i];aq.moveTo(xs[i]+ri,ys[i]);aq.arc(xs[i],ys[i],ri,0,6.2832)}aq.fill()}
 ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality=B3.mini?'low':'high';const L=BOX/s;ctx.drawImage(A,cx-L/2,cy-L/2,L,L);
 if(!hq&&!B3.mini){const dt=performance.now()-t0;B3.ms=B3.ms?B3.ms*.92+dt*.08:dt;B3.n++}}
// si el celular va lento, baja la calidad de los puntos y, en el peor caso, vuelve al dibujo plano
function b3Adapt(){if(B3.n-B3.since<90)return;B3.since=B3.n;if(B3.ms>8.5&&B3.tier<2){B3.tier++;B3.ms=0}else if(B3.ms>14&&B3.tier===2&&!B3.off){B3.off=true}}
/*B3D_END*/
/*A3D_START*/
// ELEMENTOS QUE SALEN DEL CUERPO, EN 3D: púas, hojas, alas, raíces, ramas y filamentos.
// Giran junto con el cuerpo y se ordenan por profundidad: lo que queda detrás se dibuja antes, lo que queda delante después.
const v3c=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const v3n=a=>{const l=Math.hypot(a[0],a[1],a[2])||1;return[a[0]/l,a[1]/l,a[2]/l]};
const v3rot=(v,ax,an)=>{const c=Math.cos(an),s=Math.sin(an),d=v[0]*ax[0]+v[1]*ax[1]+v[2]*ax[2],cr=v3c(ax,v);return[v[0]*c+cr[0]*s+ax[0]*d*(1-c),v[1]*c+cr[1]*s+ax[1]*d*(1-c),v[2]*c+cr[2]*s+ax[2]*d*(1-c)]};
const v3perp=d=>{const r=Math.abs(d[1])>.9?[1,0,0]:[0,1,0];return v3n(v3c(d,r))};
const b3dir={};
function b3Dirs(n,seed){const k=n+'|'+seed;if(b3dir[k])return b3dir[k];const out=[],g=2.399963229728653,off=(seed%628)/100;for(let i=0;i<n;i++){const y=1-2*(i+.5)/n,r=Math.sqrt(1-y*y),a=i*g+off;out.push([Math.cos(a)*r,y,Math.sin(a)*r])}return b3dir[k]=out}
const b3tree={};
function b3Tree(b,seed){const k=b+'|'+seed;if(b3tree[k])return b3tree[k];const r=rnd(seed+21),segs=[];
 const grow=(p,d,l,depth)=>{if(depth>3||l<.12)return;const e=[p[0]+d[0]*l,p[1]+d[1]*l,p[2]+d[2]*l];segs.push([p,e,depth]);
  for(const sg of[-1,1]){const ax=v3n(v3c(d,[r()-.5,r()-.5,r()-.5]));grow(e,v3rot(d,ax,.5*sg+(r()-.5)*.3),l*.65,depth+1)}};
 for(let i=0;i<b;i++){const az=i*1.9+seed*.02,th=.7+.5*r(),d=[Math.cos(az)*Math.sin(th),Math.cos(th),Math.sin(az)*Math.sin(th)];grow([d[0]*.92,d[1]*.92,d[2]*.92],d,.9,0)}
 return b3tree[k]=segs}
function att3D(ctx,cx,cy,R,T,t,seed,pass,size){
 const M=B3.M,L=B3_L,list=[],hq=!!window.B3HQ,dk=!hq&&typeof isDark==='function'&&isDark();
 const VX=(p)=>M[0]*p[0]+M[1]*p[1]+M[2]*p[2],VY=(p)=>M[3]*p[0]+M[4]*p[1]+M[5]*p[2],VZ=(p)=>M[6]*p[0]+M[7]*p[1]+M[8]*p[2];
 const SX=p=>cx+VX(p)*R,SY=p=>cy-VY(p)*R;
 const lit=n=>{const x=VX(n),y=VY(n),z=VZ(n);return .35+.65*Math.abs(x*L[0]+y*L[1]+z*L[2])};
 const col=(c,k,a)=>`rgba(${Math.min(255,c[0]*k|0)},${Math.min(255,c[1]*k|0)},${Math.min(255,c[2]*k|0)},${a})`;
 const zOf=pts=>{let z=0;for(const p of pts)z+=VZ(p);return z/pts.length};
 const poly=(pts,fill,stroke,lw,n)=>{list.push({z:zOf(pts),f:()=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(SX(p),SY(p)):ctx.moveTo(SX(p),SY(p)));ctx.closePath();if(fill){ctx.fillStyle=typeof fill==='function'?fill(n?lit(n):1):fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke()}}})};
 const line=(pts,stroke,lw,fade)=>{list.push({z:zOf(pts),f:()=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(SX(p),SY(p)):ctx.moveTo(SX(p),SY(p)));ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke()}})};
 // ---- púas (Erizo): conos rosas que salen de la superficie ----
 const ns=Math.round(T.spikes||0);
 if(ns>0){const dirs=b3Dirs(ns,seed),pc=[255,0,178];
  for(let i=0;i<ns;i++){const d=dirs[i],len=1+1.15*(1+.08*Math.sin(t*1.7+i)),u1=v3perp(d),u2=v3c(d,u1),tip=[d[0]*len,d[1]*len,d[2]*len],ring=[];
   for(let k=0;k<8;k++){const a=k/8*6.2832,c=Math.cos(a)*.17,s=Math.sin(a)*.17;ring.push([d[0]*.9+u1[0]*c+u2[0]*s,d[1]*.9+u1[1]*c+u2[1]*s,d[2]*.9+u1[2]*c+u2[2]*s])}
   for(let k=0;k<8;k++){const a=ring[k],b=ring[(k+1)%8],n=v3n(v3c([b[0]-a[0],b[1]-a[1],b[2]-a[2]],[tip[0]-a[0],tip[1]-a[1],tip[2]-a[2]]));
    poly([a,b,tip],kk=>col(pc,.55+.75*kk,1),null,0,n);list[list.length-1].st=1}}}
 // ---- hojas (Brote): hojas amarillas con nervio central ----
 const nl=Math.ceil(T.lobes||0);
 for(let i=0;i<nl;i++){const sc=Math.min(1,T.lobes-i);if(sc<=0)continue;
  const az=i*2.1+seed*.01+.08*Math.sin(t*1.4+i),el=.45+.25*Math.sin(i*1.7),dir=[Math.cos(az)*Math.cos(el),Math.sin(el),Math.sin(az)*Math.cos(el)];
  let tg=[-dir[0]*dir[1],1-dir[1]*dir[1],-dir[2]*dir[1]];tg=v3n(tg);const bn=v3c(dir,tg),ph=.5,ax=[dir[0]*Math.cos(ph)+tg[0]*Math.sin(ph),dir[1]*Math.cos(ph)+tg[1]*Math.sin(ph),dir[2]*Math.cos(ph)+tg[2]*Math.sin(ph)],Lh=1.25*sc,Wd=.5*sc,left=[],right=[],mid=[];
  for(let k=0;k<=12;k++){const s=k/12,w=Wd*Math.pow(Math.sin(Math.PI*s),.8),p=[dir[0]*.88+ax[0]*s*Lh+tg[0]*s*s*.25*sc,dir[1]*.88+ax[1]*s*Lh+tg[1]*s*s*.25*sc,dir[2]*.88+ax[2]*s*Lh+tg[2]*s*s*.25*sc];
   mid.push(p);left.push([p[0]+bn[0]*w,p[1]+bn[1]*w,p[2]+bn[2]*w]);right.push([p[0]-bn[0]*w,p[1]-bn[1]*w,p[2]-bn[2]*w])}
  const n=v3n(v3c(ax,bn));poly(left.concat(right.reverse()),kk=>col([239,215,79],.55+.6*kk,1),'rgba(60,45,0,.35)',1,n);
  line(mid,'rgba(40,30,0,.7)',Math.max(1,size*.003))}
 // ---- alas de libélula: cuatro alas translúcidas que baten rápido ----
 const sdf=Math.min(1,T.dragonfly||0);
 if(sdf>0){const psi=.22*Math.sin(t*14);
  for(const s of[-1,1])for(const u of[-1,1]){const tilt=u*.35,ct=Math.cos(tilt),st=Math.sin(tilt),mk=(X,Y)=>{const Xr=X*ct-Y*st,Yr=X*st+Y*ct;return[s*Xr*Math.cos(psi),Yr,Xr*Math.sin(psi)-.3]},pts=[];
   for(let k=0;k<24;k++){const a=k/24*6.2832;pts.push(mk((1.7+1.1*Math.cos(a))*sdf,.3*Math.sin(a)*sdf))}
   const n=v3n(v3c([pts[0][0]-pts[12][0],pts[0][1]-pts[12][1],pts[0][2]-pts[12][2]],[pts[6][0]-pts[18][0],pts[6][1]-pts[18][1],pts[6][2]-pts[18][2]]));
   poly(pts,kk=>col([121,242,244],.6+.5*kk,.45),dk?'rgba(111,162,245,.6)':'rgba(30,59,194,.5)',Math.max(1,size*.002),n);
   for(let v=1;v<6;v++){const an=(v-3)*.38;line([mk(.2*sdf,0),mk((1.7+1.1*Math.cos(an))*sdf,.3*Math.sin(an)*sdf)],dk?'rgba(111,162,245,.4)':'rgba(30,59,194,.4)',Math.max(.8,size*.0018))}}}
 // ---- alas de mariposa: dos alas grandes azules con parche rojo ----
 const sw=Math.min(1,T.wings||0);
 if(sw>0){const psi=.45*Math.sin(t*3),bz=(p0,p1,p2,p3,k)=>{const q=1-k;return[q*q*q*p0[0]+3*q*q*k*p1[0]+3*q*k*k*p2[0]+k*k*k*p3[0],q*q*q*p0[1]+3*q*q*k*p1[1]+3*q*k*k*p2[1]+k*k*k*p3[1]]};
  const o1=[[.2,-.1],[1.3,-2.1],[2.9,-1.1],[2.4,.1]],o2=[[2.4,.1],[2.6,1.3],[1.2,1.7],[.2,.6]],outline=[];
  for(let k=0;k<=10;k++)outline.push(bz(o1[0],o1[1],o1[2],o1[3],k/10));for(let k=1;k<=10;k++)outline.push(bz(o2[0],o2[1],o2[2],o2[3],k/10));
  const patch=[[.2,-.1],[1.3,-.5],[1.5,.2],[1.0,.8],[.2,.6]];
  for(const s of[-1,1]){const mk=(P,dz)=>[s*P[0]*sw*Math.cos(psi),-P[1]*sw,P[0]*sw*Math.sin(psi)+(dz||0)-.35],pts=outline.map(P=>mk(P)),n=v3n(v3c([pts[0][0]-pts[10][0],pts[0][1]-pts[10][1],pts[0][2]-pts[10][2]],[pts[5][0]-pts[15][0],pts[5][1]-pts[15][1],pts[5][2]-pts[15][2]]));
   poly(pts,kk=>dk?col([70,110,225],.55+.7*kk,1):col([30,59,194],.55+.9*kk,1),'rgba(5,10,60,.6)',Math.max(1,size*.0025),n);
   poly(patch.map(P=>mk(P,.01)),kk=>col([255,0,0],.6+.6*kk,1),null,0,n);
   const r3=rnd(seed+3);for(let q=0;q<7;q++){const x=1.6+r3()*.9,y=-1.3+r3()*2.2,sp=[];for(let a=0;a<8;a++){const an=a/8*6.2832;sp.push(mk([x+.11*Math.cos(an),y+.15*Math.sin(an)],.02))}poly(sp,kk=>col([11,16,112],.7+.5*kk,1),null,0,n)}}}
 // ---- raíces (Raíz): curvas finas que salen del cuerpo ----
 const nf=Math.round(T.fibers||0),ink=hq||!dk?'rgba(17,17,17,.85)':'rgba(242,242,238,.85)',lw0=Math.max(1.2,size*.0045);
 if(nf>0){const dirs=b3Dirs(nf,seed+7),r=rnd(seed+31);
  for(let i=0;i<nf;i++){const d=dirs[i],l=.5+r()*1.1,k=(r()-.5)*.8,tg=v3perp(d),end=v3n([d[0]+tg[0]*k*.4,d[1]+tg[1]*k*.4,d[2]+tg[2]*k*.4]),ct=v3n([d[0]+tg[0]*k,d[1]+tg[1]*k,d[2]+tg[2]*k]),p0=[d[0]*.85,d[1]*.85,d[2]*.85],p1=[ct[0]*(.85+l*.5),ct[1]*(.85+l*.5),ct[2]*(.85+l*.5)],p2=[end[0]*(.85+l),end[1]*(.85+l),end[2]*(.85+l)],pts=[];
   for(let q=0;q<=12;q++){const f=q/12,a=(1-f)*(1-f),b=2*f*(1-f),c=f*f;pts.push([a*p0[0]+b*p1[0]+c*p2[0],a*p0[1]+b*p1[1]+c*p2[1],a*p0[2]+b*p1[2]+c*p2[2]])}
   line(pts,ink,lw0)}}
 // ---- ramas (Rama): árbol que se bifurca ----
 const nb=Math.round(T.branches||0);
 if(nb>0){for(const sg of b3Tree(nb,seed)){const w=Math.max(.9,size*.0045*(1-sg[2]*.25));line([sg[0],sg[1]],ink,w)}}
 // ---- filamentos (Flujo): hilos que giran alrededor ----
 const nfl=Math.round(T.filaments||0);
 if(nfl>0){for(let i=0;i<nfl;i++){const a0=i/nfl*6.2832+seed*.01,lat0=((i%5)-2)*.3,pts=[];
   for(let k=0;k<=30;k++){const f=k/30,az=a0+f*1.6+.25*Math.sin(t*.8+i+f*6),d=1.05+f*1.6,lat=lat0+f*.25*Math.sin(i+1),cl=Math.cos(lat);pts.push([Math.cos(az)*cl*d,Math.sin(lat)*d,Math.sin(az)*cl*d])}
   line(pts,'rgba(79,143,239,.55)',Math.max(1,size*.0025))}}
 // ======== ELEMENTOS QUE ORBITAN (fase 4) ========
 const spr=(z,f)=>list.push({z,f}),BLc=dk?'rgba(111,162,245,':'rgba(30,59,194,',PAPERc=hq?'#F7F7F4':(dk?'#121214':'#F7F7F4');
 const addp=(p,q)=>[p[0]+q[0],p[1]+q[1],p[2]+q[2]],mulp=(p,k)=>[p[0]*k,p[1]*k,p[2]*k];
 // ---- rueda (Tierra): un aro con rayos que gira en el espacio ----
 const aw=Math.min(1,T.wheels||0);
 if(aw>0){const nw=v3n([.35,.9,.25]),e1=v3perp(nw),e2=v3c(nw,e1),ang=t*.6,pt=(rad,th)=>{const c=Math.cos(th)*rad,s=Math.sin(th)*rad;return[e1[0]*c+e2[0]*s,e1[1]*c+e2[1]*s,e1[2]*c+e2[2]*s]};
  for(let k=0;k<48;k++)line([pt(1.55,k/48*6.2832),pt(1.55,(k+1)/48*6.2832)],BLc+aw+')',Math.max(1.2,size*.005));
  for(let i=0;i<16;i++){const th=ang+i/16*6.2832;line([pt(1.05,th),pt(1.55,th)],BLc+(aw*.8)+')',Math.max(.8,size*.0025))}}
 // ---- cuadrados anidados (Agua): tres marcos que giran como un giroscopio ----
 const asq=Math.min(1,T.squares||0);
 if(asq>0){for(let i=0;i<3;i++){const s=1.5+i*.35,an=t*.2*(i%2?-1:1)+i*.4,w=(x,y)=>{let p=[x,y,0];p=v3rot(p,[0,0,1],an);p=v3rot(p,[1,0,0],i*.9+.3);return v3rot(p,[0,1,0],i*1.3)},v=[w(-s,-s),w(s,-s),w(s,s),w(-s,s)];
   for(let k=0;k<4;k++)line([v[k],v[(k+1)%4]],(dk&&!hq?'rgba(242,242,238,':'rgba(17,17,17,')+(asq*.85)+')',Math.max(1,size*.003))}}
 // ---- rombos (Fuego): marcos de rombo anidados flotando alrededor ----
 const nd=Math.round(T.diamonds||0);
 if(nd>0){for(let i=0;i<nd;i++){const az=Math.PI*.75+i*2.3,dir=v3n([Math.cos(az),.35*Math.sin(i*1.7),Math.sin(az)]),pos=mulp(dir,1.75),e1=v3perp(dir),e2=v3c(dir,e1),rot=Math.sin(t+i)*.2,c=Math.cos(rot),s2=Math.sin(rot);
   for(let k=0;k<3;k++){const q=.32*(1-k*.3),loc=[[0,-q],[q*.7,0],[0,q],[-q*.7,0],[0,-q]].map(([x,y])=>{const X=x*c-y*s2,Y=x*s2+y*c;return addp(pos,addp(mulp(e1,X),mulp(e2,Y)))});
    line(loc,dk&&!hq?'rgba(242,242,238,.9)':'rgba(17,17,17,.9)',Math.max(1,size*.004))}}}
 // ---- estela de puntos (Fuego): puntos rojos que se alejan en espiral ----
 const ndot=Math.round(T.dots||0);
 if(ndot>0){const nn=v3n([.3,1,.2]),e1=v3perp(nn),e2=v3c(nn,e1),a0=t*(.15+.5*(T.spin||0))+seed;
  for(let i=0;i<ndot;i++){const f=i/ndot,a=a0+f*Math.PI*1.8,d=1.35+f*1.1,p=addp(mulp(e1,Math.cos(a)*d),mulp(e2,Math.sin(a)*d)),rd=R*.13*(1-f)+1.2;
   spr(VZ(p),()=>{const pr=1+VZ(p)*.12;ctx.fillStyle='#FF2A00';ctx.beginPath();ctx.arc(SX(p),SY(p),rd*pr,0,6.2832);ctx.fill()})}}
 // ---- pincelada (Fuego): una cinta de color que rodea el cuerpo ----
 const abr=Math.min(1,T.brush||0);
 if(abr>0){const nb2=v3n([.2,.7,.7]),e1=v3perp(nb2),e2=v3c(nb2,e1),K=18,cen=[],wd=[];
  for(let k=0;k<=K;k++){const f=k/K,th=-1.15+f*2.3+.05*Math.sin(t+f*3),p=addp(mulp(e1,Math.cos(th)*1.32),mulp(e2,Math.sin(th)*1.32));cen.push(p);wd.push(.26*Math.pow(Math.sin(Math.PI*f),.7))}
  for(let k=0;k<K;k++){const a=cen[k],b=cen[k+1],tg=v3n([b[0]-a[0],b[1]-a[1],b[2]-a[2]]),side=v3c(nb2,tg),f=(k+.5)/K,al=Math.sin(Math.PI*f)*.85*abr,gc=Math.round(106*f);
   const q=[addp(a,mulp(side,wd[k])),addp(b,mulp(side,wd[k+1])),addp(b,mulp(side,-wd[k+1])),addp(a,mulp(side,-wd[k]))];{const cs=`rgba(255,${gc},0,${al.toFixed(3)})`;poly(q,cs,cs,1,null)}}}
 // ---- gotas (Agua): gotas que caen alrededor ----
 const ndr=Math.round(T.drops||0);
 if(ndr>0){const r3=rnd(seed+11);
  for(let i=0;i<ndr;i++){const az=i*2.4+r3()*.6,ph=r3(),f=((t*.25+ph)%1),phi=-.15-.5*r3(),u=[Math.cos(az)*Math.cos(phi),Math.sin(phi),Math.sin(az)*Math.cos(phi)],p=[u[0]*1.12,u[1]*1.12-f*1.5,u[2]*1.12],s=R*.2*(1-f*.5),al=1-f*.8;
   spr(VZ(p),()=>{const x=SX(p),y=SY(p),k=1+VZ(p)*.15,ss=s*k;ctx.fillStyle=`rgba(79,143,239,${al.toFixed(3)})`;ctx.beginPath();ctx.moveTo(x,y-ss*1.6);ctx.quadraticCurveTo(x+ss,y,x,y+ss);ctx.quadraticCurveTo(x-ss,y,x,y-ss*1.6);ctx.fill()})}}
 // ---- confeti (Corazón): papelitos que caen girando en el espacio ----
 const acf=Math.min(1,T.confetti||0);
 if(acf>0){const r7=rnd(seed+19),cols=['#FF00B2','#79F2F4','#EFD74F','#FF0000','#4F8FEF'];
  for(let i=0;i<22;i++){const ph=r7(),ax=r7(),az=r7(),f=((t*.12+ph)%1),pos=[(ax-.5)*4.4+Math.sin(t*2+i)*.2,2.4-f*4.8,(az-.5)*4.4],ra=v3n([r7()-.5,r7()-.5,r7()-.5]);
   if(Math.hypot(pos[0],pos[1],pos[2])<1.1)continue;
   const an=t*2+i,a1=v3rot([.1,0,0],ra,an),a2=v3rot([0,.06,0],ra,an),q=[addp(addp(pos,a1),a2),addp(addp(pos,a1),mulp(a2,-1)),addp(addp(pos,mulp(a1,-1)),mulp(a2,-1)),addp(addp(pos,mulp(a1,-1)),a2)];
   const hx=cols[i%5],cc=[parseInt(hx.slice(1,3),16),parseInt(hx.slice(3,5),16),parseInt(hx.slice(5,7),16)];poly(q,kk=>col(cc,.7+.5*kk,acf),null,0,v3n(v3c(a1,a2)))}}
 // ---- brillos (Corazón): destellos que titilan alrededor ----
 const ash=Math.min(1,T.shine||0);
 if(ash>0){const r6=rnd(seed+17);
  for(let i=0;i<8;i++){const a=r6()*7,el=(r6()-.5)*2.2,d=.6+r6()*1.6,p=[Math.cos(a)*Math.cos(el)*d*1.25,Math.sin(el)*d*1.25,Math.sin(a)*Math.cos(el)*d*1.25],s=R*.14*Math.max(0,Math.sin(t*3+i*1.3))*ash;
   if(s<1||Math.hypot(p[0],p[1],p[2])<1.05)continue;
   spr(VZ(p)+.02,()=>{const x=SX(p),y=SY(p);ctx.fillStyle='#FFFFFF';ctx.beginPath();ctx.moveTo(x,y-s);ctx.quadraticCurveTo(x,y,x+s,y);ctx.quadraticCurveTo(x,y,x,y+s);ctx.quadraticCurveTo(x,y,x-s,y);ctx.quadraticCurveTo(x,y,x,y-s);ctx.fill()})}}
 // ---- facetas (Aire): esquirlas geométricas flotando cerca del cuerpo ----
 const nfa=Math.round(T.facets||0);
 if(nfa>0){const dirs=b3Dirs(nfa*2+6,seed+3).filter(d=>d[1]>.05).slice(0,nfa);
  dirs.forEach((d,i)=>{const e1=v3perp(d),e2=v3c(d,e1),c0=mulp(d,1.2+.04*Math.sin(t+i)),tri=(k,off)=>[[0,.35*k],[.4*k,-.2*k],[-.4*k,-.2*k]].map(([x,y])=>addp(c0,addp(mulp(e1,x*1.4),mulp(e2,y*1.4+off))));
   poly(tri(1,0),dk&&!hq?'#F2F2EE':'#111111',null,0,d);poly(tri(.35,0).map(p=>addp(p,mulp(d,.01))),PAPERc,null,0,d)})}
 // ---- dibujar: primero lo que queda detrás del cuerpo, después lo que queda delante ----
 const sel=list.filter(o=>pass?o.z>=0:o.z<0).sort((a,b)=>a.z-b.z);
 if(!sel.length)return;ctx.save();ctx.lineJoin='round';ctx.lineCap='round';for(const o of sel)o.f();ctx.restore()}
/*A3D_END*/
  window.B3D = true;
  window.Ser3D = { att3D, draw, CONCEPTS, BASE, SEED, INK, B3, b3mul, b3Rx, b3Ry, b3Ortho, mixColor, topConcepts, hexA, FX };
})();
