const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24;
const st=[0,4.8,9.4,14.8,19.4,25.0,29.6,35.2];
const T=41.8;
const vd=[4.0,3.6,4.5,3.0,4.6,3.7,3.7,3.0];
const SUBS=[["PARTE 2: IL PORTELLONE","STANOTTE LO APRO"],
["IL VOLANTE È ARRUGGINITO","CI METTO UN'ORA SOLO PER GIRARLO"],
["CLACK. SI APRE","SALE ARIA CALDA... CHE PUZZA DI CLORO"],
["SCENDO LA SCALA","10 METRI... 20 METRI"],
["SOTTO IL GIARDINO C'È UNA PISCINA","ENORME. ILLUMINATA DI VERDE"],
["IO VOLEVO UNA PISCINA","QUALCUNO L'AVEVA GIÀ COSTRUITA"],
["POI L'ACQUA SI MUOVE","E DAL FONDO SALGONO DUE OCCHI"],null];
const DAYS=[null,"23:00","00:05","00:10","00:15","00:16","00:17",null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
function state(t){
  const k=seg(t), lt=t-st[k], d=(k<7?st[k+1]:T)-st[k], x=cl(lt/d), e=ease(x);
  const S={uTime:t,uDepth:5.2,uNight:1,uChar:[0.1,-5.2,-1.2],uCharRot:-0.5,uArm:0.9,uBob:0.3,uShovel:0,uKneel:0.6,uFlash:1,uExc:[0,0,0,0],uExcArm:0,uGeyser:0,uPipeBroken:1,uHatch:1,uGreen:0.6,uLadder:1,uP:new Array(56).fill(0),uPType:1,uEye:1,
    uShaft:0,uHatchOpen:0,uWheel:0,uGreenPos:[0.9,-4.8,-0.9],uEyes:[0,0,0,0],uLadder2:0};
  let cam=[1.25,-3.5,4.9], tgt=[0.6,-4.7,-1.1], shake=0;
  if(k===0){ S.uGreen=0.6+0.25*Math.sin(t*6); cam=L3([1.0,-1.8,10],[1.3,-3.6,5.0],e); tgt=L3([0.7,-3.8,-1.1],[0.7,-4.8,-1.1],e); }
  if(k===1){ S.uChar=[0.15,-5.2,-1.1]; S.uCharRot=-0.9; S.uKneel=0.6; S.uFlash=0; S.uArm=1.35+0.08*Math.sin(t*14); S.uBob=0.45+0.1*Math.sin(t*3.5); S.uWheel=lt*0.6;
    S.uGreen=0.6+0.25*Math.sin(t*6); cam=L3([2.3,-4.1,3.2],[2.0,-4.3,2.5],e); tgt=[0.75,-5.0,-1.0]; }
  if(k===2){ const o=ease(cl((lt-0.7)/0.6)); S.uHatchOpen=o; S.uWheel=2.8; S.uChar=[-0.3,-5.2,-1.1]; S.uCharRot=-0.7; S.uKneel=0.6*(1-o); S.uFlash=0; S.uBob=lerp(0.4,-0.35,o); S.uArm=lerp(1.3,2.5,o); S.uEye=1;
    S.uShaft=1; S.uGreen=0.6+1.4*o; S.uGreenPos=[0.9,lerp(-4.8,-6.0,o),-0.9];
    if(o>0){ for(let i=0;i<14;i++){const ph=((t*0.5)+i/14)%1; S.uP[i*4]=0.9+(rnd(i)-0.5)*1.0*(1+ph); S.uP[i*4+1]=-5.3+ph*4.0; S.uP[i*4+2]=-1.0+(rnd(i+4)-0.5)*0.8; S.uP[i*4+3]=0.06*(1-ph)*o;} }
    shake=(lt>0.7&&lt<1.2)?0.07:0; cam=L3([2.0,-4.0,4.2],[1.9,-3.4,5.6],e); tgt=[0.8,-5.0,-1.0]; }
  if(k===3){ S.uHatchOpen=1; S.uShaft=1; S.uLadder2=1; S.uGreen=1.6; S.uGreenPos=[1.0,-10.5,-1.0];
    const cy=lerp(-6.0,-10.9,ease(x)); S.uChar=[1.25,cy,-0.85]; S.uCharRot=0; S.uKneel=0; S.uFlash=0; S.uArm=2.3+0.3*Math.sin(t*8); S.uBob=0; S.uEye=1;
    cam=[2.6,cy+1.8,6.5]; tgt=[1.1,cy+0.6,-1.0]; }
  if(k===4){ S.uHatchOpen=1; S.uShaft=1; S.uLadder2=1; S.uGreen=1.6+0.2*Math.sin(t*3); S.uGreenPos=[1.0,-11.6,-1.0]; S.uChar=[0.9,-11.3,-0.9]; S.uCharRot=0; S.uFlash=0; S.uKneel=0; S.uArm=0.3; S.uBob=0; S.uEye=1;
    cam=L3([1.2,-9.6,6.0],[1.0,-9.4,16.5],e); tgt=L3([0.9,-10.6,-1],[1.0,-11.2,-1],e); }
  if(k===5){ S.uHatchOpen=1; S.uShaft=1; S.uLadder2=1; S.uGreen=1.6+0.2*Math.sin(t*3); S.uGreenPos=[1.0,-11.6,-1.0]; S.uChar=[0.9,-11.3,-0.9]; S.uCharRot=0.1; S.uFlash=0; S.uKneel=0; S.uArm=2.6+0.15*Math.sin(t*5); S.uBob=-0.1; S.uEye=0.6;
    cam=L3([2.2,-10.0,5.6],[1.9,-10.2,4.8],e); tgt=[0.9,-10.3,-1]; }
  if(k===6||k===7){ S.uHatchOpen=1; S.uShaft=1; S.uLadder2=1; S.uGreen=1.6+0.4*Math.sin(t*7); S.uGreenPos=[1.0,-11.6,-1.0]; S.uFlash=0; S.uKneel=0; S.uEye=1;
    S.uChar=[0.6,-11.3,-0.7]; S.uCharRot=0.5; 
    const rise=k===6?ease(cl((lt-1.8)/2.5)):1; S.uEyes=[3.2,lerp(-11.9,-11.15,rise),-1.6,rise>0.001?1:0];
    S.uArm=k===6&&lt<2.0?0.3:2.5; S.uBob=k===6&&lt<2.0?0:-0.3;
    for(let i=0;i<14;i++){const ph=((t*0.7)+i/14)%1; S.uP[i*4]=3.2+(rnd(i)-0.5)*2.0; S.uP[i*4+1]=-11.7+ph*0.4; S.uP[i*4+2]=-1.6+(rnd(i+3)-0.5)*1.4; S.uP[i*4+3]=(k===6&&lt<0.5)?0:0.07*(1-ph);}
    if(k===6){ cam=L3([2.2,-10.0,5.6],[2.6,-10.4,4.2],e); tgt=L3([1.4,-10.8,-1],[2.9,-11.0,-1.4],e); }
    else { cam=L3([2.9,-10.6,3.4],[3.1,-10.9,1.5],e); tgt=[3.2,-11.0,-1.5]; } }
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  const texts=[]; let flash=0, dark=0;
  const pop=(a)=>{const p=cl(a/0.25);return p<0.7?lerp(0.3,1.12,p/0.7):lerp(1.12,1,(p-0.7)/0.3);};
  if(k===0){ texts.push({text:'PARTE 2',y:300,size:150,color:'#39FF6A',scale:pop(lt)});
    if(lt>0.8) texts.push({text:'HO APERTO IL PORTELLONE',y:470,size:72,color:'#FFFFFF',alpha:cl((lt-0.8)/0.3)}); }
  if(DAYS[k]){ texts.push({text:'ORE',y:215,size:46,color:'#FFD23E',alpha:cl(lt/0.2)}); texts.push({text:DAYS[k],y:330,size:150,color:'#FFFFFF',scale:pop(lt)}); }
  if(SUBS[k]){ const s0=st[k]+0.15, v=vd[k], a=SUBS[k][0].length, b=SUBS[k][1].length, cut=v*a/(a+b);
    const r=t-s0; if(r>=0&&r<cut) texts.push({text:SUBS[k][0],y:1500,size:60,color:'#FFFFFF',alpha:cl(r/0.15)});
    else if(r>=cut) texts.push({text:SUBS[k][1],y:1500,size:60,color:'#FFD23E',alpha:cl((r-cut)/0.15)}); }
  if(k===7){ dark=0.3*cl(lt/0.8);
    if(lt>0.6) texts.push({text:'CONTINUA...',y:420,size:130,color:'#39FF6A',alpha:(Math.floor(lt*8)%7===0&&lt<1.6)?0.3:1});
    if(lt>1.8) texts.push({text:'SCRIVI "OCCHI" NEI COMMENTI PER LA PARTE 3',y:1420,size:66,color:'#FFD23E',scale:pop(lt-1.8)}); }
  for(let i=1;i<8;i++){const a=t-st[i]; if(a>=0&&a<0.2) flash=Math.max(flash,0.6*(1-a/0.2));}
  if(k===2&&lt>0.7&&lt<1.1) flash=Math.max(flash,0.9*(1-(lt-0.7)/0.4));
  return {S,C:{texts,flash,dark}};
}
(async()=>{
 const times=process.argv[2]?JSON.parse(process.argv[2]):null;
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});
 const p=await b.newPage({viewport:{width:1100,height:2900}});
 p.on('pageerror',e=>console.log('E',e.message));
 await p.goto('file:///tmp/claude-0/r3d/scene2.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`p2_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','video2.mp4']);
 const N=Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress2.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress2.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
