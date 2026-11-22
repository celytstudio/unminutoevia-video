const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24;
const st=[0,4.4,8.7,13.1,18.4,23.2,28.3,33.5];
const T=40.7;
const vd=[3.6,3.4,3.5,4.5,3.9,4.2,3.5,4.3];
const SUBS=[["VOLEVO UNA CASA SULL'ALBERO","L'ALBERO NON ERA D'ACCORDO"],
["INCHIODO UNA TAVOLA","CI STO IN PIEDI. QUASI."],
["FACCIO UN PAVIMENTO VERO","DUE METRI PER DUE"],
["PARETI, TETTO E UNA FINESTRA","SEMBRA UNA VILLA"],
["L'ALBERO COMINCIA A PIEGARSI","UN POCHINO"],
["AGGIUNGO UN ASCENSORE","CON UN BIDONE COME CABINA"],
["SALGO CON L'ASCENSORE","E SENTO: CRACK"],
["L'ALBERO CADE...","VERSO LA CASA DI MARIO"]];
const DAYS=[null,"1","3","5","7","10","12",null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
function state(t){
  const k=seg(t), lt=t-st[k], d=(k<7?st[k+1]:T)-st[k], x=cl(lt/d), e=ease(x);
  const TX=0.8, TZ=-1.8;
  const S={uTime:t,uDepth:0.001,uNight:0,uChar:[-0.6,0,-0.2],uCharRot:0.3,uArm:0.3,uBob:0,uShovel:0,uKneel:0,uFlash:0,uExc:[0,0,0,0],uExcArm:0,uGeyser:0,uPipeBroken:0,uHatch:0,uGreen:0,uLadder:0,
    uP:new Array(56).fill(0),uPType:0,uEye:0.6,uRocket:[0,0,0,0],uRocketV:0,uFire:0,uTilt:0,uHelm:0,uCola:0,uGeyPos:[0,0,0],
    uTree:[TX,0,TZ,1],uBend:0,uTHStage:0,uLift:0};
  let cam=[0.6,2.6,11.5], tgt=[0.8,2.6,-1.8], shake=0;
  const pop=(a)=>{const p=cl(a/0.25);return p<0.7?lerp(0.3,1.12,p/0.7):lerp(1.12,1,(p-0.7)/0.3);};
  const texts=[]; let flash=0, dark=0;
  const onPlat=(dx)=>{ const b=S.uBend; const lx=dx, ly=2.66; S.uChar=[TX+lx*Math.cos(b)-ly*Math.sin(b), lx*Math.sin(b)+ly*Math.cos(b), TZ+0.5]; };
  if(k===0){ S.uTHStage=3; S.uLift=lerp(2.2,2.6,cl(lt/2)); S.uBend=-ease(cl((lt-0.8)/2.2))*0.5; S.uEye=1; S.uArm=2.6;
    { const b=S.uBend, lx=1.45, ly=S.uLift+0.45; S.uChar=[TX+lx*Math.cos(b)-ly*Math.sin(b), lx*Math.sin(b)+ly*Math.cos(b), TZ+0.7]; }
    shake=lt>0.8?0.05:0; cam=[1.4,2.8,11]; tgt=[1.6,3.0,-1.8]; }
  if(k===1){ S.uTHStage=0; S.uBend=0; onPlat(0.55); S.uChar[2]=TZ+0.35; S.uArm=1.4+0.5*Math.sin(t*5); S.uBob=0.15*Math.sin(t*7); S.uEye=0.9;
    cam=L3([1.8,3.2,6.5],[1.6,3.0,5.8],e); tgt=[1.2,3.0,-1.5]; }
  if(k===2){ S.uTHStage=1; onPlat(0.0); S.uArm=2.4+0.15*Math.sin(t*6); S.uCharRot=0.2; cam=L3([1.6,3.4,7.5],[1.2,3.2,6.6],e); tgt=[0.8,3.0,-1.6]; }
  if(k===3){ S.uTHStage=2; S.uChar=[-0.9,0,-0.1]; S.uArm=0.2; S.uBob=-0.1; S.uEye=0.6; cam=L3([-0.4,2.0,10],[0.0,2.6,11],e); tgt=[0.4,2.4,-1.6]; }
  if(k===4){ S.uTHStage=2; S.uBend=-lerp(0,0.22,ease(x)); S.uChar=[-0.9,0,-0.1]; S.uArm=0.6; S.uEye=1; S.uCharRot=0.1;
    cam=[0.2,2.4,10.5]; tgt=[0.8,2.6,-1.6]; }
  if(k===5){ S.uTHStage=3; S.uBend=-0.22; S.uLift=0; S.uChar=[-1.0,0,-0.1]; S.uArm=2.4; S.uCharRot=0.2; cam=L3([1.8,1.5,8.5],[2.2,2.0,9.5],e); tgt=[1.8,1.8,-1.6]; }
  if(k===6){ S.uTHStage=3; const up=ease(cl(lt/2.4)); S.uLift=lerp(0,2.2,up); const crack=lt>2.9; S.uBend=-0.22-(crack?ease(cl((lt-2.9)/2.2))*0.25:0); S.uEye=crack?1:0.6; S.uArm=crack?2.6:0.4;
    { const b=S.uBend, lx=1.45, ly=S.uLift+0.45; S.uChar=[TX+lx*Math.cos(b)-ly*Math.sin(b), lx*Math.sin(b)+ly*Math.cos(b), TZ+0.7]; }
    shake=(lt>2.9&&lt<3.4)?0.06:0; cam=[2.6,2.6,9.0]; tgt=[2.0,2.6,-1.6]; }
  if(k===7){ S.uTHStage=3; S.uLift=2.2; S.uBend=-0.47-ease(cl(lt/3.2))*0.75; S.uEye=1; S.uArm=2.6;
    { const b=S.uBend, lx=1.45, ly=S.uLift+0.45; S.uChar=[TX+lx*Math.cos(b)-ly*Math.sin(b), lx*Math.sin(b)+ly*Math.cos(b), TZ+0.7]; }
    if(lt>3.2){ S.uBend=-1.22; }
    shake=lt<3.2?0.04:0; cam=L3([2.0,3.0,11],[3.5,2.2,10.5],e); tgt=L3([2.0,2.6,-1.8],[3.2,1.8,-2.2],e); }
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  if(k===0){ texts.push({text:'VOLEVO UNA CASA SULL\'ALBERO',y:300,size:76,color:'#FFFFFF',alpha:cl(lt/0.3)}); if(lt>1.4) texts.push({text:'CRACK.',y:470,size:120,color:'#FF3B30',scale:pop(lt-1.4)}); }
  if(DAYS[k]){ texts.push({text:'GIORNO',y:215,size:46,color:'#FFD23E',alpha:cl(lt/0.2)}); texts.push({text:DAYS[k],y:330,size:170,color:'#FFFFFF',scale:pop(lt)}); }
  if(SUBS[k]){ const s0=st[k]+0.15, v=vd[k], a=SUBS[k][0].length, b=SUBS[k][1].length, cut=v*a/(a+b);
    const r=t-s0; if(k===7&&lt>3.4){} else if(r>=0&&r<cut) texts.push({text:SUBS[k][0],y:1500,size:60,color:'#FFFFFF',alpha:cl(r/0.15)});
    else if(r>=cut) texts.push({text:SUBS[k][1],y:1500,size:60,color:'#FFD23E',alpha:cl((r-cut)/0.15)}); }
  if(k===7&&lt>3.4){ dark=0.3*cl((lt-3.4)/0.6);
    texts.push({text:'CONTINUA...',y:420,size:130,color:'#39FF6A',alpha:(Math.floor(lt*8)%7===0&&lt<4.4)?0.3:1});
    texts.push({text:'SCRIVI "ALBERO" NEI COMMENTI PER LA PARTE 2',y:1420,size:66,color:'#FFD23E',scale:pop(lt-3.6)}); }
  for(let i=1;i<8;i++){const a=t-st[i]; if(a>=0&&a<0.2) flash=Math.max(flash,0.6*(1-a/0.2));}
  if(k===6&&lt>2.9&&lt<3.2) flash=Math.max(flash,0.6);
  return {S,C:{texts,flash,dark}};
}
(async()=>{
 const times=process.argv[2]?JSON.parse(process.argv[2]):null;
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});
 const p=await b.newPage({viewport:{width:1100,height:2900}});
 p.on('pageerror',e=>console.log('E',e.message));
 await p.goto('file:///tmp/claude-0/r3d/scene5.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`p5_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','video5.mp4']);
 const N=Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress5.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress5.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
