const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24;
const st=[0,3.8,7.9,12.0,16.2,20.4,25.7];
const T=30.0;
const vd=[2.7,3.0,3.0,3.1,3.1,4.2,2.6];
const SUBS=[["STIAMO CADENDO","DRITTI NELLA PISCINA DI MARIO"],
["SPLASH! IL CESTO GALLEGGIA","COME UNA BARCA"],
["IL PALLONE SI SGONFIA","E CI CADE ADDOSSO"],
["LA MATTINA DOPO, MARIO","SI RIPRENDE IL SUO ACCAPPATOIO"],
["LO STRIZZA. E SE LO RIMETTE","BAGNATO"],
["E IO RESTO NEL CESTO, IN MEZZO ALLA PISCINA","SENZA MONGOLFIERA"],null];
const DAYS=[null,null,null,"5",null,null,null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
const BP=[0.9,0,-1.0];
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
    uBal:[BP[0],0,BP[2],1.0],uInflate:0,uFireB:0};
  let cam=[0.4,1.8,7.5], tgt=[0.7,1.0,-0.6], shake=0;
  const pop=(a)=>{const p=cl(a/0.25);return p<0.7?lerp(0.3,1.12,p/0.7):lerp(1.12,1,(p-0.7)/0.3);};
  const texts=[]; let flash=0, dark=0;
  const flame=(c)=>{ S.uPType=2; for(let i=0;i<14;i++){ const ph=(t*1.8+rnd(i))%1; S.uP[i*4]=c[0]+(rnd(i+3)-0.5)*0.12; S.uP[i*4+1]=c[1]+ph*0.5; S.uP[i*4+2]=c[2]+(rnd(i+5)-0.5)*0.12; S.uP[i*4+3]=0.04*(1-ph); } };
  const inBasket=(by,bx,bz)=>{ S.uChar=[bx,by+0.08,bz+0.05]; S.uCharRot=0.2; };
  S.uPool=1; S.uWater=1; S.uTiles=1;
  const X=BP[0], Z=BP[2]; const WY=-0.42;
  let h=WY, nt=1, inf=0, bob=0.04*Math.sin(t*2.2);
  S.uEyes=[0,0,0,0]; S.uRobe=1;
  if(k===0){ h=lerp(4.2,WY,(lt/d)*(lt/d)); inf=0.75; S.uEyes=[X+0.5,h-0.05,Z+0.4,1]; S.uRobe=0; S.uDArm=2; S.uArm=2.8; S.uEye=1.2;
    cam=[X+0.6,lerp(10,7,e),Z+3.4]; tgt=[X,lerp(3,0.2,e),Z-0.3]; shake=0.03; }
  if(k===1){ h=WY+bob+0.25*Math.exp(-lt*3)*Math.cos(lt*12); inf=0.6; S.uEyes=[X+0.6,WY+0.1,Z+0.5,1]; S.uRobe=0; S.uDArm=2; S.uArm=1.2; S.uEye=1.1;
    cam=[X+0.6,3.6,Z+4.6]; tgt=[X,0.3,Z]; if(lt<1.6) shake=0.05*(1-lt/1.6);
    if(lt<2.2) texts.push({text:'SPLASH!',y:640,size:150,color:'#7FD6FF',scale:pop(lt)}); }
  if(k===2){ h=WY+bob; inf=lerp(0.6,0.0,ease(cl(lt/2.6))); S.uEyes=[X+0.6,WY+0.1,Z+0.5,1]; S.uRobe=0; S.uDArm=1; S.uArm=lt>1.5?2.6:1.2; S.uEye=1.1;
    cam=[X+0.6,3.8,Z+5.2]; tgt=[X,lerp(1.4,0.4,e),Z]; }
  if(k>=3){ nt=0; h=WY+bob; inf=0; S.uArm=0.5; S.uEye=0.8; }
  if(k===3){ const f=ease(cl(lt/2.0)); S.uEyes=[lerp(4.4,2.75,f),0,lerp(0.6,-0.3,f),1]; S.uRobe=1; S.uDArm=lt>2.2?2:1;
    cam=[X+1.2,3.4,Z+5.8]; tgt=[X+0.9,0.3,Z]; }
  if(k===4){ const w=lt>0.3&&lt<2.2; S.uEyes=[2.75+(w?0.03*Math.sin(t*40):0),0,-0.3,1]; S.uRobe=1; S.uDArm=w?2:1; S.uEye=0.7;
    cam=[1.9,1.5,3.8]; tgt=[2.5,0.75,-0.3]; if(lt>0.3&&lt<2.6) texts.push({text:'STRIZZ!',y:640,size:120,color:'#7FD6FF',scale:pop(lt-0.3)}); }
  if(k>=5){ S.uEyes=[2.75,0,-0.3,1]; S.uRobe=1; S.uDArm=1; S.uEye=0.7; const tt=t-st[5];
    cam=L3([X+0.4,3.0,Z+3.4],[X+0.6,6.5,Z+5.5],ease(cl(tt/5))); tgt=[X,lerp(0.0,-0.2,cl(tt/5)),Z]; if(k===6) dark=0.25; }
  S.uNight=nt; S.uFireB=0; S.uInflate=inf; S.uBal=[X,h,Z,1.0]; inBasket(h,X,Z); S.uCharRot=0.3;
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  if(k===0){ texts.push({text:'LA MONGOLFIERA: FINALE',y:250,size:100,color:'#FFFFFF',alpha:cl(lt/0.3)}); }
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
 await p.goto('file:///tmp/claude-0/r3d/scene26.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`p29_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','video29.mp4']);
 const N=Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress29.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress29.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
