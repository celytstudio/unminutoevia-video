const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24;
const st=[0,5.2,9.2,13.4,16.6,20.6,24.2,28.4];
const T=34.4;
const vd=[4.5,3.1,3.2,2.2,2.7,2.2,2.9,2.6];
const SUBS=[["PARTE 3: IL FINALE","LA CASA STA ANCORA VOLANDO"],
["PASSA SOPRA IL QUARTIERE","TUTTI GUARDANO IN SU"],
["POI COMINCIA A SCENDERE","DRITTA VERSO DI NOI"],
["IO CHIUDO GLI OCCHI","MARIO NO"],
["BOOM. ATTERRA PERFETTA","SUL TETTO DI MARIO"],
["ADESSO MARIO HA","UNA CASA A DUE PIANI"],
["E IO?","HO ANCORA L'ALBERO. DRITTO."],null];
const DAYS=[null,"07:47","07:48","07:48","07:49","08:00","08:01",null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
function state(t){
  const k=seg(t), lt=t-st[k], d=(k<7?st[k+1]:T)-st[k], x=cl(lt/d), e=ease(x);
  const TX=0.8, TZ=-1.8, LAND=[4.9,3.75,-2.2];
  const S={uTime:t,uDepth:0.001,uNight:0,uChar:[1.6,0,0.4],uCharRot:0.3,uArm:2.4,uBob:-0.1,uShovel:0,uKneel:0,uFlash:0,uExc:[2.9,0,0.4,1],uExcArm:0.6,uGeyser:0,uPipeBroken:0,uHatch:0,uGreen:0,uLadder:0,
    uP:new Array(56).fill(0),uPType:0,uEye:1,uRocket:[0,0,0,0],uRocketV:0,uFire:0,uTilt:0,uHelm:0,uCola:0,uGeyPos:[0,0,0],
    uTree:[TX,0,TZ,1],uBend:0,uTHStage:3,uLift:0,uHutPos:LAND,uHutRot:0,uHutFly:1,uEyes:[3.2,1.75,0.2,1],uDArm:2,uRobe:1};
  let cam=[2.4,1.0,9.5], tgt=[2.6,3.0,-2], shake=0;
  const pop=(a)=>{const p=cl(a/0.25);return p<0.7?lerp(0.3,1.12,p/0.7):lerp(1.12,1,(p-0.7)/0.3);};
  const texts=[]; let flash=0, dark=0;
  if(k===0){ S.uHutPos=[lerp(-20,-10,x),30,TZ]; S.uHutRot=t*2.5; S.uChar=[-60,0,0]; S.uEyes=[0,0,0,0]; S.uExc=[0,0,0,0];
    cam=[S.uHutPos[0]+1,29.5,TZ+9]; tgt=S.uHutPos; }
  if(k===1){ S.uHutPos=[lerp(-12,8,x),lerp(16,14,x),TZ-2]; S.uHutRot=t*2.0; S.uArm=2.5; S.uCharRot=0.1; S.uEyes=[3.0,1.75,0.0,1]; S.uDArm=0;
    S.uExc=[0,0,0,0]; cam=[2.2,0.6,9.0]; tgt=[lerp(2.4,S.uHutPos[0],0.6),lerp(1.5,S.uHutPos[1],0.72),-2]; }
  if(k===2){ const f=ease(x); S.uHutPos=[lerp(8,6,f),lerp(14,8,f),TZ-0.5]; S.uHutRot=t*lerp(2.0,0.6,f); S.uArm=2.5; S.uEyes=[3.0,1.75,0.0,1]; S.uDArm=0;
    S.uExc=[0,0,0,0]; cam=[2.4,0.8,9.5]; tgt=[lerp(2.4,S.uHutPos[0],0.6),lerp(1.5,S.uHutPos[1],0.72),-2]; }
  if(k===3){ S.uHutPos=[lerp(6,5.4,x),lerp(8,6.2,x),TZ-0.4]; S.uHutRot=0.4*(1-x); S.uArm=2.9; S.uBob=-0.25; S.uEye=0.05; S.uEyes=[3.0,1.75,0.0,1]; S.uDArm=0; S.uExc=[0,0,0,0];
    cam=L3([1.5,1.6,4.2],[1.6,1.7,3.8],e); tgt=[2.2,1.6,0.0]; }
  if(k===4){ const f=cl(lt/0.5); S.uHutPos=[lerp(5.4,LAND[0],f),lerp(6.2,LAND[1],f*f),LAND[2]]; S.uHutRot=0; S.uArm=2.9; S.uBob=-0.25; S.uEye=0.05; S.uEyes=[3.0,1.75,0.0,1]; S.uDArm=lt>0.6?2:0;
    if(lt>0.5){ const a=lt-0.5; for(let i=0;i<14;i++){const th=rnd(i)*6.283; S.uP[i*4]=LAND[0]+Math.cos(th)*2.0*a; S.uP[i*4+1]=3.0+1.6*a-2*a*a; S.uP[i*4+2]=LAND[2]+Math.sin(th)*1.0*a; S.uP[i*4+3]=a<1.2?0.12:0;} S.uPType=3; }
    S.uExc=[0,0,0,0]; shake=(lt>0.5&&lt<1.0)?0.08:0; cam=[2.4,2.0,10.5]; tgt=[3.6,2.6,-2]; }
  if(k===5){ S.uArm=0.3; S.uBob=0; S.uEye=1; S.uChar=[1.0,0,0.6]; S.uEyes=[4.6,1.75,-0.6,1]; S.uDArm=2; S.uExc=[0,0,0,0];
    cam=L3([3.6,2.8,10],[3.8,3.2,11],e); tgt=[4.6,2.6,-2]; }
  if(k===6){ S.uChar=[0.1,0,0.1]; S.uCharRot=0.2; S.uArm=lerp(0.3,1.6,cl(lt/0.6)); S.uBob=0.1; S.uEye=0.5; S.uEyes=[4.6,1.75,-0.6,1]; S.uDArm=0; S.uExc=[0,0,0,0];
    cam=L3([0.6,2.4,7.0],[0.6,2.6,7.5],e); tgt=[0.6,2.2,-1.0]; }
  if(k===7){ S.uChar=[0.1,0,0.1]; S.uCharRot=0.2; S.uArm=0.3; S.uEyes=[4.6,1.75,-0.6,1]; S.uDArm=2; S.uExc=[0,0,0,0];
    cam=L3([1.6,2.6,9],[2.4,3.4,13],e); tgt=[2.6,2.4,-2]; }
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  if(k===0){ texts.push({text:'PARTE 3',y:300,size:150,color:'#39FF6A',scale:pop(lt)}); if(lt>0.8) texts.push({text:'IL FINALE',y:470,size:80,color:'#FFFFFF',alpha:cl((lt-0.8)/0.3)}); }
  if(DAYS[k]){ texts.push({text:'ORE',y:215,size:46,color:'#FFD23E',alpha:cl(lt/0.2)}); texts.push({text:DAYS[k],y:330,size:150,color:'#FFFFFF',scale:pop(lt)}); }
  if(k===4&&lt>0.5&&lt<2.2) texts.push({text:'BOOM!',y:760,size:200,color:'#FF3B30',scale:pop(lt-0.5)});
  if(SUBS[k]){ const s0=st[k]+0.15, v=vd[k], a=SUBS[k][0].length, b=SUBS[k][1].length, cut=v*a/(a+b);
    const r=t-s0; if(r>=0&&r<cut) texts.push({text:SUBS[k][0],y:1500,size:60,color:'#FFFFFF',alpha:cl(r/0.15)});
    else if(r>=cut) texts.push({text:SUBS[k][1],y:1500,size:60,color:'#FFD23E',alpha:cl((r-cut)/0.15)}); }
  if(k===7){ texts.push({text:'FINE',y:420,size:170,color:'#39FF6A',scale:pop(lt)});
    if(lt>1.0) texts.push({text:'SEGUICI PER LA PROSSIMA STORIA',y:1480,size:68,color:'#FFD23E',scale:pop(lt-1.0)}); }
  for(let i=1;i<8;i++){const a=t-st[i]; if(a>=0&&a<0.2) flash=Math.max(flash,0.6*(1-a/0.2));}
  if(k===4&&lt>0.5&&lt<0.8) flash=Math.max(flash,0.8);
  return {S,C:{texts,flash,dark}};
}
(async()=>{
 const times=process.argv[2]?JSON.parse(process.argv[2]):null;
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});
 const p=await b.newPage({viewport:{width:1100,height:2900}});
 p.on('pageerror',e=>console.log('E',e.message));
 await p.goto('file:///tmp/claude-0/r3d/scene6.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`p7_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','video7.mp4']);
 const N=Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress7.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress7.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
