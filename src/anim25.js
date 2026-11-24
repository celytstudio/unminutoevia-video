const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24;
const st=[0,5.0,8.8,12.0,16.4,19.0,23.0,28.6];
const T=33.0;
const vd=[4.3,3.0,2.2,3.5,1.3,2.9,4.6,2.7];
const SUBS=[["DENTRO LA MIA ZUCCA GIGANTE, QUALCOSA BUSSAVA","COSÌ L'HO APERTA"],
["PRENDO IL COLTELLO","PIÙ GRANDE CHE HO"],
["INTAGLIO UNA PORTA","ROTONDA"],
["DENTRO È TUTTO BUIO","E SI SENTE: TOC, TOC"],
["ACCENDO LA TORCIA",""],
["ESCONO CENTO ZUCCHINE PICCOLE","E ROTOLANO VIA"],
["IL GIARDINO È PIENO DI ZUCCHE","E CRESCONO, TUTTE"],null];
const DAYS=[null,"11",null,null,null,null,"12",null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
const PP=[1.4,0,-1.6], SC=2.4, DOOR=[1.4,0.42*2.4,-1.6+2.3];
function state(t){
  const k=seg(t), lt=t-st[k], d=(k<7?st[k+1]:T)-st[k], x=cl(lt/d), e=ease(x);
  const S={uTime:t,uDepth:0.001,uNight:0,uChar:[0.4,0,1.2],uCharRot:0.5,uArm:0.3,uBob:0,uShovel:0,uKneel:0,uFlash:0,uExc:[0,0,0,0],uExcArm:0,uGeyser:0,uPipeBroken:0,uHatch:0,uGreen:0,uLadder:0,
    uP:new Array(56).fill(0),uPType:1,uEye:0.7,uRocket:[0,0,0,0],uRocketV:0,uFire:0,uTilt:0,uHelm:0,uCola:0,uGeyPos:[0,0,0],
    uTree:[0,0,0,0],uBend:0,uTHStage:0,uLift:0,uHutPos:[100,0,0],uHutRot:0,uHutFly:0,uEyes:[0,0,0,0],uDArm:0,uRobe:1,
    uCat:[0,0,0,0],uCatA:0,uCatBig:0,uCatFlip:0,uProj:[0,0,0,0],uProjT:0,
    uCat2:[0,0,0,0],uCatA2:0,uCatBig2:0,uCatFlip2:0,uProj2:[0,0,0,0],uProjT2:0,
    uTramp:[0,0,0,0],uTramp2:0,uTrampDip:0,uCloud:[0,0,0,0],
    uSnow:[0,0,0,0],uSnowRot:0,uSnowSmile:0,uSnowG:0,uSnowHead:1,uSnow2:[0,0,0,0],uSnowRot2:0,uArmy:[0,0,0,0],uArmyRot:0,uBall:[0,0,0,0],uBall2:[0,0,0,0],
    uPool:0,uWater:0,uLadderP:0,uTiles:0,uHatchY:-0.4,uFurn:0,uHatchOpen:0,uParty:0,uCake:[0,0,0,0],uPump:[PP[0],0,PP[2],SC],uSprout:0,uPDoor:0,uMini:[0,0,0,0],uMiniT:0};
  let cam=[0.6,1.6,7.5], tgt=[1.0,1.2,-0.8], shake=0;
  const pop=(a)=>{const p=cl(a/0.25);return p<0.7?lerp(0.3,1.12,p/0.7):lerp(1.12,1,(p-0.7)/0.3);};
  const texts=[]; let flash=0, dark=0;
  const chips=(t0)=>{ const a=lt-t0; if(a<0||a>1.2) return; S.uPType=4; for(let i=0;i<14;i++){ const th=rnd(i)*6.283; S.uP[i*4]=DOOR[0]+Math.cos(th)*0.6*a; S.uP[i*4+1]=DOOR[1]+Math.sin(th)*0.6*a-1.5*a*a; S.uP[i*4+2]=DOOR[2]+0.3+0.8*a; S.uP[i*4+3]=0.04; } };
  if(k===0){ S.uPDoor=1; S.uMini=[DOOR[0]-1.2,0,-0.25,0.5]; S.uMiniT=-lt*0.9; S.uChar=[-1.2,0,1.4]; S.uCharRot=0.6; S.uArm=2.6; S.uEye=1; S.uBob=0.1*Math.abs(Math.sin(t*8));
    cam=[0.4,1.4,7.4]; tgt=[0.6,0.9,-0.6]; if(lt>1.2) texts.push({text:'?!',y:620,size:150,color:'#FF3B30',scale:pop(lt-1.2)}); }
  if(k===1){ S.uChar=[0.2,0,1.2]; S.uCharRot=0.4; S.uArm=lt>1.2?2.6:0.6; S.uEye=1; cam=L3([1.0,1.7,7.0],[0.9,1.6,6.2],e); tgt=[0.9,1.2,-0.2]; }
  if(k===2){ S.uChar=[0.3,0,1.2]; S.uCharRot=2.6; S.uArm=1.4+1.0*Math.abs(Math.sin(t*9)); S.uEye=1; S.uPDoor=ease(cl((lt-0.3)/1.8)); chips(0.4); chips(1.3);
    cam=[2.2,1.6,6.0]; tgt=[1.2,1.0,0.0]; }
  if(k===3){ S.uPDoor=1; S.uChar=[0.4,0,1.3]; S.uCharRot=2.6; S.uArm=0.6; S.uEye=1; S.uNight=0.2; cam=L3([1.7,1.2,5.0],[1.6,1.1,4.0],e); tgt=[1.3,0.95,0.0];
    if(lt>2.0){ shake=0.015; texts.push({text:'TOC TOC',y:620,size:120,color:'#FFFFFF',scale:pop(lt-2.0)}); } }
  if(k===4){ S.uPDoor=1; S.uNight=0.2; S.uChar=[0.6,0,1.4]; S.uCharRot=2.8; S.uArm=2.0; S.uEye=1; S.uFlash=1; cam=[1.9,1.4,4.6]; tgt=[1.3,0.9,0.0]; }
  if(k===5){ S.uPDoor=1; S.uMini=[DOOR[0]-1.2,0,-0.25,0.5]; S.uMiniT=-ease(cl(lt/3.5))*3.2; S.uChar=[-1.2,0,1.6]; S.uCharRot=0.6; S.uArm=2.6; S.uEye=1; S.uBob=lt>0.4?-0.15:0;
    cam=L3([0.6,1.2,6.4],[0.2,1.6,7.8],e); tgt=[0.4,0.7,-0.2]; }
  if(k===6){ S.uPDoor=1; S.uMini=[-0.8,0,-0.3,lerp(0.5,0.9,ease(cl(lt/4)))]; S.uMiniT=0; S.uChar=[-2.4,0,2.0]; S.uCharRot=0.9; S.uArm=lt>2.5?2.6:0.8; S.uEye=1; S.uEyes=[4.3,1.75,1.4,1]; S.uDArm=lt>2?2:0;
    cam=L3([0.4,2.6,9.5],[0.4,3.2,11.5],e); tgt=[0.6,0.9,-0.8]; }
  if(k===7){ S.uPDoor=1; S.uMini=[-0.8,0,-0.3,0.9]; S.uChar=[-2.4,0,2.0]; S.uCharRot=0.9; S.uArm=2.6; S.uEye=1; S.uEyes=[4.3,1.75,1.4,1]; S.uDArm=2; cam=[0.4,3.2,11.5]; tgt=[0.6,0.9,-0.8]; dark=0.2; }
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  if(k===0){ texts.push({text:'LA ZUCCA GIGANTE',y:250,size:100,color:'#FFFFFF',alpha:cl(lt/0.3)}); texts.push({text:'PARTE 2',y:350,size:80,color:'#FFD23E',scale:pop(lt-0.2)}); }
  if(DAYS[k]){ texts.push({text:'GIORNO',y:215,size:46,color:'#FFD23E',alpha:cl(lt/0.2)}); texts.push({text:DAYS[k],y:330,size:170,color:'#FFFFFF',scale:pop(lt)}); }
  if(SUBS[k]){ const s0=st[k]+0.15, v=vd[k], a=SUBS[k][0].length, b=Math.max(1,SUBS[k][1].length), cut=SUBS[k][1]?v*a/(a+b):99;
    const r=t-s0; if(r>=0&&r<cut) texts.push({text:SUBS[k][0],y:1500,size:60,color:'#FFFFFF',alpha:cl(r/0.15)});
    else if(r>=cut) texts.push({text:SUBS[k][1],y:1500,size:60,color:'#FFD23E',alpha:cl((r-cut)/0.15)}); }
  if(k===7&&lt>0.4){ texts.push({text:'CONTINUA...',y:420,size:130,color:'#39FF6A',alpha:(Math.floor(lt*8)%7===0&&lt<1.6)?0.3:1});
    texts.push({text:'SCRIVI "SEMI" NEI COMMENTI PER LA PARTE FINALE',y:1480,size:66,color:'#FFD23E',scale:pop(lt-0.7)}); }
  for(let i=1;i<8;i++){const a=t-st[i]; if(a>=0&&a<0.2) flash=Math.max(flash,0.6*(1-a/0.2));}
  return {S,C:{texts,flash,dark}};
}
(async()=>{
 const times=process.argv[2]?JSON.parse(process.argv[2]):null;
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});
 const p=await b.newPage({viewport:{width:1100,height:2900}});
 p.on('pageerror',e=>console.log('E',e.message));
 await p.goto('file:///tmp/claude-0/r3d/scene24.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`p25_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','video25.mp4']);
 const N=Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress25.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress25.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
