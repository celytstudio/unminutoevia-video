const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24;
const st=[0,5.0,8.8,12.8,18.6,22.6,27.2,31.8];
const T=36.2;
const vd=[4.2,2.9,3.0,5.0,3.0,3.8,3.4,2.7];
const SUBS=[["HO PIANTATO UNA ZUCCA IN GIARDINO","ADESSO È PIÙ GRANDE DELLA CASA DI MARIO"],
["UN SEME","UN PO' D'ACQUA"],
["SPUNTA UNA PIANTINA","CARINA"],
["MARIO MI PRESTA IL SUO CONCIME","QUELLO VERDE, CHE BRILLA"],
["LA ZUCCA È GRANDE","COME UNA MACCHINA"],
["SUPERA LA RECINZIONE","E IL TETTO DI MARIO"],
["DENTRO LA ZUCCA","QUALCOSA BUSSA"],null];
const DAYS=[null,"1","3","5","6","8","10",null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
const PP=[1.4,0,-1.6];
function state(t){
  const k=seg(t), lt=t-st[k], d=(k<7?st[k+1]:T)-st[k], x=cl(lt/d), e=ease(x);
  const S={uTime:t,uDepth:0.001,uNight:0,uChar:[-1.4,0,0.8],uCharRot:0.6,uArm:0.3,uBob:0,uShovel:0,uKneel:0,uFlash:0,uExc:[0,0,0,0],uExcArm:0,uGeyser:0,uPipeBroken:0,uHatch:0,uGreen:0,uLadder:0,
    uP:new Array(56).fill(0),uPType:1,uEye:0.7,uRocket:[0,0,0,0],uRocketV:0,uFire:0,uTilt:0,uHelm:0,uCola:0,uGeyPos:[0,0,0],
    uTree:[0,0,0,0],uBend:0,uTHStage:0,uLift:0,uHutPos:[100,0,0],uHutRot:0,uHutFly:0,uEyes:[0,0,0,0],uDArm:0,uRobe:1,
    uCat:[0,0,0,0],uCatA:0,uCatBig:0,uCatFlip:0,uProj:[0,0,0,0],uProjT:0,
    uCat2:[0,0,0,0],uCatA2:0,uCatBig2:0,uCatFlip2:0,uProj2:[0,0,0,0],uProjT2:0,
    uTramp:[0,0,0,0],uTramp2:0,uTrampDip:0,uCloud:[0,0,0,0],
    uSnow:[0,0,0,0],uSnowRot:0,uSnowSmile:0,uSnowG:0,uSnowHead:1,uSnow2:[0,0,0,0],uSnowRot2:0,uArmy:[0,0,0,0],uArmyRot:0,uBall:[0,0,0,0],uBall2:[0,0,0,0],
    uPool:0,uWater:0,uLadderP:0,uTiles:0,uHatchY:-0.4,uFurn:0,uHatchOpen:0,uParty:0,uCake:[0,0,0,0],uPump:[0,0,0,0],uSprout:0};
  let cam=[0.5,1.6,8], tgt=[0.8,1.0,-1], shake=0;
  const pop=(a)=>{const p=cl(a/0.25);return p<0.7?lerp(0.3,1.12,p/0.7):lerp(1.12,1,(p-0.7)/0.3);};
  const texts=[]; let flash=0, dark=0;
  const pour=(c)=>{ S.uPType=1; for(let i=0;i<14;i++){ const ph=(t*1.5+rnd(i))%1; S.uP[i*4]=c[0]+(rnd(i+2)-0.5)*0.08+ph*0.25; S.uP[i*4+1]=c[1]-ph*c[1]; S.uP[i*4+2]=c[2]+(rnd(i+4)-0.5)*0.08; S.uP[i*4+3]=0.03; } };
  const glow=(c)=>{ S.uPType=3; for(let i=0;i<14;i++){ const ph=(t*0.5+rnd(i))%1; S.uP[i*4]=c[0]+(rnd(i+2)-0.5)*0.8; S.uP[i*4+1]=0.05+ph*1.0; S.uP[i*4+2]=c[2]+(rnd(i+4)-0.5)*0.8; S.uP[i*4+3]=0.025*(1-ph); } };
  if(k===0){ S.uPump=[PP[0],0,PP[2],2.4]; S.uChar=[-1.0,0,1.6]; S.uCharRot=0.4; S.uArm=lt>1.4?2.6:0.6; S.uEye=1; S.uEyes=[4.2,1.75,1.4,1]; S.uDArm=lt>2?2:0;
    cam=L3([0.0,0.9,9.0],[-0.2,1.0,11.5],e); tgt=[1.0,lerp(1.6,2.6,e),-1.2]; }
  if(k===1){ S.uSprout=0; S.uChar=[PP[0]-0.6,0,PP[2]+0.5]; S.uCharRot=2.2; S.uKneel=1; S.uArm=1.4; S.uEye=0.8; if(lt>1.5) pour([PP[0]-0.25,0.7,PP[2]+0.1]);
    cam=L3([PP[0]+1.4,1.4,PP[2]+4.0],[PP[0]+1.2,1.2,PP[2]+3.4],e); tgt=[PP[0]-0.3,0.5,PP[2]]; }
  if(k===2){ S.uSprout=ease(cl(lt/2.5)); S.uChar=[PP[0]-0.6,0,PP[2]+0.5]; S.uCharRot=2.2; S.uKneel=1; S.uArm=lt>2.4?2.4:0.6; S.uEye=1;
    cam=[PP[0]+0.3,0.6,PP[2]+2.0]; tgt=[PP[0],0.25,PP[2]]; }
  if(k===3){ S.uSprout=1; S.uGreen=ease(cl((lt-1.5)/1.5))*1.6; S.uHatchY=-0.3; glow(PP); S.uEyes=[PP[0]+1.0,1.75,PP[2]+0.6,1]; S.uDArm=1; S.uChar=[PP[0]-0.9,0,PP[2]+0.7]; S.uCharRot=1.6; S.uArm=0.6; S.uEye=1;
    if(lt>3.8){ S.uSprout=0; S.uPump=[PP[0],0,PP[2],lerp(0.15,0.45,ease(cl((lt-3.8)/1.5)))]; }
    cam=L3([PP[0]+0.1,1.8,PP[2]+6.8],[PP[0]+0.1,1.6,PP[2]+5.8],e); tgt=[PP[0]+0.1,0.9,PP[2]]; }
  if(k===4){ S.uPump=[PP[0],0,PP[2],lerp(0.6,1.0,ease(cl(lt/1.5)))]; S.uChar=[-0.4,0,0.4]; S.uCharRot=0.8; S.uArm=2.4; S.uEye=1;
    cam=[0.2,1.6,7.0]; tgt=[0.9,1.0,-1.4]; }
  if(k===5){ const sc=lerp(1.0,2.4,ease(cl(lt/3.2))); S.uPump=[PP[0],0,PP[2],sc]; S.uChar=[-0.8,0,1.4]; S.uCharRot=0.6; S.uArm=2.6; S.uEye=1; S.uEyes=[4.4,1.75,1.4,1]; S.uDArm=2;
    shake=lt<3.2?0.025:0; cam=L3([0.2,1.6,7.5],[0.0,1.4,11.5],e); tgt=[1.2,lerp(1.0,2.6,e),-1.4]; }
  if(k===6){ S.uNight=0.6; const kn=(Math.floor((lt-1.2)/0.35)%4<3)&&lt>1.2&&lt<3.4; S.uPump=[PP[0]+(kn?0.04*Math.sin(t*60):0),0,PP[2],2.4]; S.uChar=[-0.7,0,0.75]; S.uCharRot=0.9; S.uArm=lt>1.2?2.4:0.8; S.uEye=1;
    cam=L3([-1.6,1.9,6.0],[-1.4,1.8,5.2],e); tgt=[0.3,1.4,-0.8]; if(lt>1.3) texts.push({text:'TOC TOC TOC',y:620,size:110,color:'#FFFFFF',scale:pop(lt-1.3)}); }
  if(k===7){ S.uNight=0.6; S.uPump=[PP[0],0,PP[2],2.4]; S.uChar=[-0.7,0,0.75]; S.uCharRot=0.9; S.uArm=2.6; S.uEye=1; cam=[-1.4,1.8,5.2]; tgt=[0.3,1.4,-0.8]; dark=0.2; }
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  if(k===0){ texts.push({text:'LA ZUCCA GIGANTE',y:250,size:100,color:'#FFFFFF',alpha:cl(lt/0.3)}); }
  if(DAYS[k]){ texts.push({text:'GIORNO',y:215,size:46,color:'#FFD23E',alpha:cl(lt/0.2)}); texts.push({text:DAYS[k],y:330,size:170,color:'#FFFFFF',scale:pop(lt)}); }
  if(SUBS[k]){ const s0=st[k]+0.15, v=vd[k], a=SUBS[k][0].length, b=Math.max(1,SUBS[k][1].length), cut=SUBS[k][1]?v*a/(a+b):99;
    const r=t-s0; if(r>=0&&r<cut) texts.push({text:SUBS[k][0],y:1500,size:60,color:'#FFFFFF',alpha:cl(r/0.15)});
    else if(r>=cut) texts.push({text:SUBS[k][1],y:1500,size:60,color:'#FFD23E',alpha:cl((r-cut)/0.15)}); }
  if(k===7&&lt>0.4){ texts.push({text:'CONTINUA...',y:420,size:130,color:'#39FF6A',alpha:(Math.floor(lt*8)%7===0&&lt<1.6)?0.3:1});
    texts.push({text:'SCRIVI "ZUCCA" NEI COMMENTI PER LA PARTE 2',y:1480,size:66,color:'#FFD23E',scale:pop(lt-0.7)}); }
  for(let i=1;i<8;i++){const a=t-st[i]; if(a>=0&&a<0.2) flash=Math.max(flash,0.6*(1-a/0.2));}
  return {S,C:{texts,flash,dark}};
}
(async()=>{
 const times=process.argv[2]?JSON.parse(process.argv[2]):null;
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});
 const p=await b.newPage({viewport:{width:1100,height:2900}});
 p.on('pageerror',e=>console.log('E',e.message));
 await p.goto('file:///tmp/claude-0/r3d/scene23.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`p24_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','video24.mp4']);
 const N=Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress24.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress24.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
