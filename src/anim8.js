const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24;
const st=[0,5.0,9.2,12.6,16.2,19.6,23.8,27.2];
const T=32.6;
const vd=[4.2,3.4,2.4,2.7,2.4,3.2,2.2,2.3];
const SUBS=[["PARTE 2: IL RAZZO A 1000 METRI","SENZA MOTORE"],
["COMINCIA A CADERE","E IO SONO DENTRO"],
["PREMO TUTTI I BOTTONI","NIENTE"],
["ALLORA AGITO LA COLA","CON TUTTA LA FORZA"],
["IL MOTORE RIPARTE!","MA... AL CONTRARIO"],
["IL RAZZO SCENDE A TUTTA VELOCITÀ","VERSO IL GIARDINO"],
["E PUNTA DRITTO...","NELLA BUCA"],null];
const DAYS=[null,"1000 M","800 M","600 M","500 M","300 M","50 M",null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
function state(t){
  const k=seg(t), lt=t-st[k], d=(k<7?st[k+1]:T)-st[k], x=cl(lt/d), e=ease(x);
  const RX=0.9, RZ=-0.8, SC=1.4;
  const S={uTime:t,uDepth:1.5,uNight:0,uChar:[-60,0,0],uCharRot:0,uArm:0.3,uBob:0,uShovel:0,uKneel:0,uFlash:0,uExc:[0,0,0,0],uExcArm:0,uGeyser:0,uPipeBroken:0,uHatch:0,uGreen:0,uLadder:0,
    uP:new Array(56).fill(0),uPType:3,uEye:1,uRocket:[RX,40,RZ,SC],uRocketV:1,uFire:0,uTilt:0,uHelm:0,uCola:0,uGeyPos:[0,0,0],uGinoIn:1};
  let cam=[RX+1,41,RZ+11], tgt=[RX,41.5,RZ], shake=0;
  const pop=(a)=>{const p=cl(a/0.25);return p<0.7?lerp(0.3,1.12,p/0.7):lerp(1.12,1,(p-0.7)/0.3);};
  const texts=[]; let flash=0, dark=0;
  const winCam=(y,tilt,dist)=>{ const wy=y+SC*(1.4-0.05*Math.cos(tilt)); const wx=RX+SC*0.05*Math.sin(tilt); return {c:[wx+0.25,wy+0.1,RZ+0.6*SC+dist], g:[wx,wy,RZ+0.5]}; };
  if(k===0){ const y=40; S.uRocket=[RX,y,RZ,SC]; S.uTilt=Math.sin(t*1.5)*0.15; cam=L3([RX+1,y+0.5,RZ+11],[RX+0.6,y+1.2,RZ+8],e); tgt=[RX,y+1.4,RZ]; }
  if(k===1){ const y=40-6*e; const tl=0.15+1.2*e; S.uRocket=[RX,y,RZ,SC]; S.uTilt=tl; cam=[RX+1.5,y+1.0,RZ+10]; tgt=[RX,y+1.2,RZ]; }
  if(k===2){ const y=34-4*x; const tl=1.35+0.8*x; S.uRocket=[RX,y,RZ,SC]; S.uTilt=tl; const w=winCam(y,tl,2.2); cam=w.c; tgt=w.g; shake=0.03; }
  if(k===3){ const y=30-4*x; const tl=2.15+0.6*x; S.uRocket=[RX,y,RZ,SC]; S.uTilt=tl; const w=winCam(y,tl,2.4); cam=w.c; tgt=w.g; shake=0.09;
    S.uPType=1; for(let i=0;i<14;i++){const ph=((t*1.5)+i/14)%1; S.uP[i*4]=w.g[0]+(rnd(i)-0.5)*1.4*ph; S.uP[i*4+1]=w.g[1]+(rnd(i+3)-0.5)*1.4*ph; S.uP[i*4+2]=RZ+0.6*SC+0.4*ph; S.uP[i*4+3]=0.05*(1-ph);} }
  if(k===4){ const y=26-3*x; const tl=lerp(2.75,Math.PI,ease(cl(lt/0.8))); S.uRocket=[RX,y,RZ,SC]; S.uTilt=tl; S.uFire=lt>0.6?1:0; cam=[RX+1.6,y+0.5,RZ+12]; tgt=[RX,y+0.2,RZ]; shake=lt>0.6?0.06:0;
    if(lt>0.6){ for(let i=0;i<14;i++){const ph=((t*1.2)+i/14)%1; S.uP[i*4]=RX+(rnd(i)-0.5)*1.5*ph; S.uP[i*4+1]=y+2.8*SC/1.4+ph*3; S.uP[i*4+2]=RZ+(rnd(i+5)-0.5)*1.2*ph; S.uP[i*4+3]=0.3*(0.4+ph);} } }
  if(k===5){ const y=lerp(23,10,e); S.uRocket=[RX,y,RZ,SC]; S.uTilt=Math.PI; S.uFire=1; cam=[RX+3,2,RZ+13]; tgt=[RX,y*0.8+1.5,RZ]; shake=0.04;
    for(let i=0;i<14;i++){const ph=((t*1.2)+i/14)%1; S.uP[i*4]=RX+(rnd(i)-0.5)*1.5*ph; S.uP[i*4+1]=y+2.8+ph*4; S.uP[i*4+2]=RZ+(rnd(i+5)-0.5)*1.2*ph; S.uP[i*4+3]=0.3*(0.4+ph);} }
  if(k===6||k===7){ const y=k===6?lerp(10,4.2,e):4.2; S.uRocket=[RX,y,RZ,SC]; S.uTilt=Math.PI; S.uFire=1; cam=k===6?[RX+3,1.5,RZ+13]:L3([RX+3,1.5,RZ+13],[RX+2.4,1.2,RZ+11],e); tgt=[RX,k===6?lerp(8,3,e):3,RZ]; shake=0.05;
    for(let i=0;i<14;i++){const ph=((t*1.2)+i/14)%1; S.uP[i*4]=RX+(rnd(i)-0.5)*1.5*ph; S.uP[i*4+1]=y+2.8+ph*4; S.uP[i*4+2]=RZ+(rnd(i+5)-0.5)*1.2*ph; S.uP[i*4+3]=0.3*(0.4+ph);} }
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  if(k===0){ texts.push({text:'PARTE 2',y:300,size:150,color:'#39FF6A',scale:pop(lt)}); if(lt>0.8) texts.push({text:'IL RAZZO',y:470,size:80,color:'#FFFFFF',alpha:cl((lt-0.8)/0.3)}); }
  if(DAYS[k]){ texts.push({text:'ALTEZZA',y:215,size:46,color:'#FFD23E',alpha:cl(lt/0.2)}); texts.push({text:DAYS[k],y:330,size:130,color:'#FFFFFF',scale:pop(lt)}); }
  if(SUBS[k]){ const s0=st[k]+0.15, v=vd[k], a=SUBS[k][0].length, b=SUBS[k][1].length, cut=v*a/(a+b);
    const r=t-s0; if(r>=0&&r<cut) texts.push({text:SUBS[k][0],y:1500,size:60,color:'#FFFFFF',alpha:cl(r/0.15)});
    else if(r>=cut) texts.push({text:SUBS[k][1],y:1500,size:60,color:'#FFD23E',alpha:cl((r-cut)/0.15)}); }
  if(k===7){ dark=0.25*cl(lt/0.6); texts.push({text:'CONTINUA...',y:420,size:130,color:'#39FF6A',alpha:(Math.floor(lt*8)%7===0&&lt<1.2)?0.3:1});
    if(lt>0.8) texts.push({text:'SCRIVI "BUCA" NEI COMMENTI PER IL FINALE',y:1480,size:66,color:'#FFD23E',scale:pop(lt-0.8)}); }
  for(let i=1;i<8;i++){const a=t-st[i]; if(a>=0&&a<0.2) flash=Math.max(flash,0.6*(1-a/0.2));}
  if(k===4&&lt>0.6&&lt<0.9) flash=Math.max(flash,0.7);
  return {S,C:{texts,flash,dark}};
}
(async()=>{
 const times=process.argv[2]?JSON.parse(process.argv[2]):null;
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});
 const p=await b.newPage({viewport:{width:1100,height:2900}});
 p.on('pageerror',e=>console.log('E',e.message));
 await p.goto('file:///tmp/claude-0/r3d/scene8.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`p8_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','video8.mp4']);
 const N=Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress8.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress8.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
