const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24;
const st=[0,3.9,5.9,8.5,11.6,16.4,20.0];
const T=24.0;
const vd=[2.9,1.4,2.3,2.7,4.4,3.1,2.4];
const SUBS=[["ADESSO IL ROBOT COPIA ME","TUTTO QUELLO CHE FACCIO"],
["ALLORA MI VIENE UN'IDEA",""],
["CHIUDO GLI OCCHI","E NON MI MUOVO PIÙ"],
["IL ROBOT CHIUDE GLI OCCHI","E SI SPEGNE"],
["LA MATTINA DOPO, MARIO LO RIACCENDE","E IL ROBOT ANNAFFIA I SUOI FIORI"],
["FUNZIONA BENISSIMO","MA OGNI TANTO, ANNAFFIA ANCHE ME"],null];
const DAYS=[null,null,null,null,null,null,null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
const RP=[0.2,0,0.0]; const face=(dx,dz)=>Math.atan2(-dx,dz);
function state(t){
  const k=seg(t), lt=t-st[k], d=(k<6?st[k+1]:T)-st[k], x=cl(lt/d), e=ease(x);
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
  S.uRobot=[RP[0],0,RP[2],1.0]; S.uRobRot=0.3; S.uRobEye=0; S.uRobArm=0.2; S.uRobBuild=3; S.uBal=[0,0,0,0];
  S.uChar=[-0.85,0,0.25]; S.uCharRot=0.9; S.uArm=0.4; S.uEye=0.8;
  S.uRobEye=2; S.uRobBuild=3; S.uRobe=1; S.uDArm=0.3; S.uArm=0.4; S.uEye=0.8;
  const water=(a,b2)=>{ S.uPType=1; for(let i=0;i<14;i++){ const f=((i/14)+t*1.6)%1; const pt=L3(a,b2,f); pt[1]+=Math.sin(f*Math.PI)*0.5; S.uP[i*4]=pt[0]; S.uP[i*4+1]=pt[1]; S.uP[i*4+2]=pt[2]; S.uP[i*4+3]=0.035; } };
  const G=[-0.9,0,0.5], R=[0.5,0,0.3];
  S.uChar=G; S.uCharRot=0.5; S.uRobot=[R[0],0,R[2],1]; S.uRobRot=face(-1.4,0.2); S.uEyes=[2.2,1.55,-0.6,1];
  if(k<=3){ cam=[-0.1,1.5,4.4]; tgt=[-0.1,0.8,0.3]; }
  if(k===0){ const w=Math.sin(t*3); S.uArm=w>0?2.6:0.4; S.uRobArm=lt>0.35&&Math.sin((t-0.35)*3)>0?2.9:0.15; S.uEye=1.1; }
  if(k===1){ S.uArm=1.6; S.uEye=1.2; if(lt>0.3) texts.push({text:'IDEA!',y:640,size:140,color:'#FFD23E',scale:pop(lt-0.3)}); cam=L3([-0.1,1.5,4.4],[-0.6,1.5,3.2],e); tgt=[-0.6,1.0,0.4]; }
  if(k===2){ S.uArm=0.2; S.uEye=lt>0.4?0:0.8; cam=L3([-0.6,1.5,3.2],[-0.1,1.5,4.4],e); }
  if(k===3){ S.uArm=0.2; S.uEye=0; S.uRobEye=lt<0.8?2:(lt<1.4?(Math.floor(lt*10)%2?2:0):0); S.uRobArm=0.05;
    cam=L3([-0.1,1.5,4.4],[-0.5,1.3,2.6],e); tgt=[0.5,0.95,0.3]; if(lt>1.6) texts.push({text:'OFF',y:640,size:150,color:'#FFFFFF',scale:pop(lt-1.6)}); }
  if(k>=4){ S.uRobot=[1.0,0,-0.9,1]; S.uRobEye=1; S.uRobArm=1.4; S.uEyes=[2.3,1.55,-0.3,1]; S.uDArm=2; }
  if(k===4){ S.uChar=[-2.5,0,-2.5]; S.uRobRot=face(-0.4,-1.0); water([1.0,1.0,-0.9],[0.4,0.3,-2.6]);
    cam=L3([1.0,2.0,5.6],[0.9,1.8,5.0],e); tgt=[1.3,0.8,-0.8]; if(lt<0.25) flash=0.3; }
  if(k>=5){ const tt=t-st[5]; S.uChar=[-0.2,0,0.5]; S.uCharRot=0.5; const turn=ease(cl((tt-0.9)/0.5));
    S.uRobRot=lerp(face(-0.4,-1.0),face(-1.2,1.4),turn); const tg=L3([0.4,0.3,-2.6],[-0.2,1.1,0.5],turn); water([1.0,1.0,-0.9],tg);
    S.uArm=turn>0.8?2.6:0.4; S.uEye=turn>0.8?1.3:0.8; cam=[0.5,1.7,4.6]; tgt=[0.5,0.8,-0.3];
    if(tt>1.5&&k===5) texts.push({text:'SPLASH!',y:640,size:130,color:'#7FD6FF',scale:pop(tt-1.5)});
    if(k===6) dark=0.25; }
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  if(k===0){ texts.push({text:'IL ROBOT: FINALE',y:250,size:100,color:'#FFFFFF',alpha:cl(lt/0.3)}); }
  if(DAYS[k]){ texts.push({text:'GIORNO',y:215,size:46,color:'#FFD23E',alpha:cl(lt/0.2)}); texts.push({text:DAYS[k],y:330,size:170,color:'#FFFFFF',scale:pop(lt)}); }
  if(SUBS[k]){ const s0=st[k]+0.15, v=vd[k], a=SUBS[k][0].length, b=Math.max(1,SUBS[k][1].length), cut=SUBS[k][1]?v*a/(a+b):99;
    const r=t-s0; if(r>=0&&r<cut) texts.push({text:SUBS[k][0],y:1500,size:60,color:'#FFFFFF',alpha:cl(r/0.15)});
    else if(r>=cut) texts.push({text:SUBS[k][1],y:1500,size:60,color:'#FFD23E',alpha:cl((r-cut)/0.15)}); }
  if(k===6){ texts.push({text:'FINE',y:440,size:200,color:'#FFFFFF',scale:pop(lt-0.1)});
    texts.push({text:'SEGUICI PER LA PROSSIMA STORIA',y:1480,size:72,color:'#FFD23E',scale:pop(lt-0.6)}); }
  for(let i=1;i<7;i++){const a=t-st[i]; if(a>=0&&a<0.2) flash=Math.max(flash,0.6*(1-a/0.2));}
  return {S,C:{texts,flash,dark}};
}
(async()=>{
 const times=process.argv[2]?JSON.parse(process.argv[2]):null;
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});
 const p=await b.newPage({viewport:{width:1100,height:2900}});
 p.on('pageerror',e=>console.log('E',e.message));
 await p.goto('file:///tmp/claude-0/r3d/scene27.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`p32_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','video32.mp4']);
 const N=Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress32.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress32.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
