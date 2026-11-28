const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24;
const st=[0,4.0,7.2,10.8,14.0,16.6,20.4,23.8];
const T=28.4;
const vd=[3.0,2.2,2.8,2.2,1.7,2.9,2.5,2.8];
const SUBS=[["VOLO SOPRA LA SIEPE","DRITTO NEL GIARDINO DI MARIO"],
["E ATTERRO NELLA SUA PISCINA","SPLASH!"],
["MARIO ARRIVA DI CORSA","NON È CONTENTO"],
["MI DICE: LO SCIVOLO","SMONTALO SUBITO"],
["MA IO HO UN'IDEA MIGLIORE",""],
["SPOSTO LO SCIVOLO","PROPRIO ACCANTO ALLA SUA PISCINA"],
["MARIO MI GUARDA","POI, SALE IN CIMA"],null];
const DAYS=[null,null,null,null,null,null,null,null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
const RP=[0.2,0,0.0]; const face=(dx,dz)=>Math.atan2(-dx,dz);
function state(t){
  const k=seg(t), lt=t-st[k], d=(k<7?st[k+1]:T)-st[k], x=cl(lt/d), e=ease(x);
  const S={uTime:t,uDepth:0.001,uNight:0,uChar:[-0.8,0,0.8],uCharRot:0.6,uArm:0.3,uBob:0,uShovel:0,uKneel:0,uFlash:0,uExc:[0,0,0,0],uExcArm:0,uGeyser:0,uPipeBroken:0,uHatch:0,uGreen:0,uLadder:0,
    uP:new Array(56).fill(0),uPType:2,uEye:0.7,uRocket:[0,0,0,0],uRocketV:0,uFire:0,uTilt:0,uHelm:0,uCola:0,uGeyPos:[0,0,0],
    uTree:[0,0,0,0],uBend:0,uTHStage:0,uLift:0,uHutPos:[100,0,0],uHutRot:0,uHutFly:0,uEyes:[0,0,0,0],uDArm:0,uRobe:1,
    uCat:[0,0,0,0],uCatA:0,uCatBig:0,uCatFlip:0,uProj:[0,0,0,0],uProjT:0,
    uCat2:[0,0,0,0],uCatA2:0,uCatBig2:0,uCatFlip2:0,uProj2:[0,0,0,0],uProjT2:0,
    uTramp:[0,0,0,0],uTramp2:0,uTrampDip:0,uCloud:[0,0,0,0],
    uSnow:[0,0,0,0],uSnowRot:0,uSnowSmile:0,uSnowG:0,uSnowHead:1,uSnow2:[0,0,0,0],uSnowRot2:0,uArmy:[0,0,0,0],uArmyRot:0,uBall:[0,0,0,0],uBall2:[0,0,0,0],
    uPool:0,uWater:0,uLadderP:0,uTiles:0,uHatchY:-0.4,uFurn:0,uHatchOpen:0,uParty:0,uCake:[0,0,0,0],uPump:[0,0,0,0],uSprout:0,uPDoor:0,uMini:[0,0,0,0],uMiniT:0,uFace:0,uLantern:0,uWink:0,
    uBal:[0,0,0,0],uInflate:0,uFireB:0};
  let cam=[0.4,1.8,7.5], tgt=[0.7,1.0,-0.6], shake=0;
  const pop=(a)=>{const p=cl(a/0.25);return p<0.7?lerp(0.3,1.12,p/0.7):lerp(1.12,1,(p-0.7)/0.3);};
  const texts=[]; let flash=0, dark=0;
  const flame=(c)=>{ S.uPType=2; for(let i=0;i<14;i++){ const ph=(t*1.8+rnd(i))%1; S.uP[i*4]=c[0]+(rnd(i+3)-0.5)*0.12; S.uP[i*4+1]=c[1]+ph*0.5; S.uP[i*4+2]=c[2]+(rnd(i+5)-0.5)*0.12; S.uP[i*4+3]=0.04*(1-ph); } };
  const inBasket=(by,bx,bz)=>{ S.uChar=[bx,by+0.08,bz+0.05]; S.uCharRot=0.2; };
  const SP=[-3.6,0,-1.0]; S.uSlide=[SP[0],SP[1],SP[2],0]; S.uRobot=[0,0,0,0]; S.uPool=1; S.uWater=1; S.uTiles=1;
  const P=[0.9,-0.75,-0.9]; const bob=0.04*Math.sin(t*2.4);
  S.uChar=[P[0],P[1]+bob,P[2]]; S.uCharRot=0.3; S.uArm=1.0; S.uEye=1.1; S.uEyes=[2.6,1.55,0.3,1]; S.uRobe=1; S.uDArm=0.3;
  const splash=(t0,amt)=>{ S.uPType=1; for(let i=0;i<14;i++){ const ang=i*0.45, f=cl((t-t0)/0.9); S.uP[i*4]=P[0]+Math.cos(ang)*0.5*f; S.uP[i*4+1]=-0.4+Math.sin(Math.PI*f)*(0.8+0.3*Math.sin(i*1.7)); S.uP[i*4+2]=P[2]+Math.sin(ang)*0.5*f; S.uP[i*4+3]=(f<1?0.05:0)*amt; } };
  if(k===0){ const u=cl(lt/3.5); const gx=lerp(-2.6,P[0],u), gy=lerp(3.4,P[1],u*u)+Math.sin(u*Math.PI)*0.6; S.uChar=[gx,gy,lerp(0.0,P[2],u)]; S.uArm=2.8; S.uEye=1.4; S.uCharRot=0.9;
    S.uEyes=[2.6,1.55,0.6,1]; tgt=[gx,Math.max(gy,0.3)+0.6,lerp(0,P[2],u)]; cam=[gx+0.4,Math.max(gy,0.3)+1.5,4.6]; if(lt>3.5){ splash(st[0]+3.5,1); flash=0.2*(1-cl((lt-3.5)/0.3)); } }
  if(k===1){ splash(st[0]+3.5,1); S.uArm=2.6; S.uEye=1.3; cam=[1.2,1.9,3.4]; tgt=[0.9,0.0,-0.9];
    if(lt<1.8) texts.push({text:'SPLASH!',y:640,size:150,color:'#7FD6FF',scale:pop(lt)}); }
  if(k===2){ const f=ease(cl(lt/1.8)); S.uEyes=[lerp(4.2,2.2,f),1.55+0.08*Math.abs(Math.sin(t*12))*(1-f),lerp(0.6,0.0,f),1]; S.uDArm=2; S.uArm=1.2;
    cam=[1.4,1.8,4.6]; tgt=[1.5,0.6,-0.4]; }
  if(k===3){ S.uEyes=[2.2,1.55,0.0,1]; S.uDArm=lt%0.6<0.3?2:1; S.uArm=1.4; cam=L3([1.4,1.8,4.6],[1.9,1.9,3.4],e); tgt=[2.0,1.2,-0.2];
    if(lt>0.6) texts.push({text:'SMONTALO!',y:640,size:120,color:'#FF5A4A',scale:pop(lt-0.6)}); }
  if(k===4){ S.uEyes=[2.2,1.55,0.0,1]; S.uArm=1.6; S.uEye=1.2; cam=[1.0,1.3,2.6]; tgt=[0.9,0.0,-0.9];
    if(lt>0.3) texts.push({text:'IDEA!',y:640,size:140,color:'#FFD23E',scale:pop(lt-0.3)}); }
  if(k===5){ S.uSlide[3]=lt>0.8?2:0; if(lt>0.8&&lt<1.0) flash=0.45; S.uEyes=[2.2,1.55,0.0,1]; S.uDArm=lt>1?2:0.3; S.uArm=2.6;
    cam=L3([-0.4,2.6,6.4],[-0.8,2.8,7.0],e); tgt=[-1.0,0.8,-0.9]; }
  if(k>=6){ S.uSlide[3]=2; const tt=t-st[6]; S.uEyes=[SP[0]+0.25,2.04+1.55,SP[2],1]; S.uDArm=tt>1.2?2:0.3; S.uArm=0.6; S.uEye=1.2;
    cam=L3([-1.8,2.6,4.6],[-2.6,3.2,3.6],cl(tt/3)); tgt=[SP[0]+0.4,2.8,SP[2]]; if(k===7) dark=0.15; }
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  if(k===0){ texts.push({text:'LO SCIVOLO 2',y:250,size:100,color:'#FFFFFF',alpha:cl(lt/0.3)}); }
  if(DAYS[k]){ texts.push({text:'GIORNO',y:215,size:46,color:'#FFD23E',alpha:cl(lt/0.2)}); texts.push({text:DAYS[k],y:330,size:170,color:'#FFFFFF',scale:pop(lt)}); }
  if(SUBS[k]){ const s0=st[k]+0.15, v=vd[k], a=SUBS[k][0].length, b=Math.max(1,SUBS[k][1].length), cut=SUBS[k][1]?v*a/(a+b):99;
    const r=t-s0; if(r>=0&&r<cut) texts.push({text:SUBS[k][0],y:1500,size:60,color:'#FFFFFF',alpha:cl(r/0.15)});
    else if(r>=cut) texts.push({text:SUBS[k][1],y:1500,size:60,color:'#FFD23E',alpha:cl((r-cut)/0.15)}); }
  if(k===7&&lt>0.4){ texts.push({text:'CONTINUA...',y:420,size:130,color:'#39FF6A',alpha:(Math.floor(lt*8)%7===0&&lt<1.6)?0.3:1});
    texts.push({text:'SCRIVI "SPLASH" NEI COMMENTI PER IL FINALE',y:1480,size:66,color:'#FFD23E',scale:pop(lt-0.7)}); }
  for(let i=1;i<8;i++){const a=t-st[i]; if(a>=0&&a<0.2) flash=Math.max(flash,0.6*(1-a/0.2));}
  return {S,C:{texts,flash,dark}};
}
(async()=>{
 const times=process.argv[2]?JSON.parse(process.argv[2]):null;
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});
 const p=await b.newPage({viewport:{width:1100,height:2900}});
 p.on('pageerror',e=>console.log('E',e.message));
 await p.goto('file:///tmp/claude-0/r3d/scene28.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`p34_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p',process.env.OUT||'video34.mp4']);
 const N=process.env.NF?+process.env.NF:Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress34.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress34.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
