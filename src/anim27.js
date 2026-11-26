const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24;
const st=[0,4.6,9.0,15.2,19.6,25.4,30.0,33.0];
const T=37.6;
const vd=[3.6,3.6,5.4,3.2,5.0,3.8,1.8,2.6];
const SUBS=[["HO COSTRUITO UNA MONGOLFIERA IN GIARDINO","CON L'ACCAPPATOIO DI MARIO"],
["COME CESTO","USO QUELLO DELLA BIANCHERIA"],
["MI SERVE LA STOFFA. PRENDO L'ACCAPPATOIO DI MARIO","SENZA DIRGLIELO"],
["ACCENDO IL FUOCO","IL PALLONE SI GONFIA"],
["MARIO ESCE DI CASA. SENZA ACCAPPATOIO","E VEDE IL SUO ACCAPPATOIO CHE VOLA"],
["LUI AFFERRA LA CORDA. IO SALGO","LUI SALE CON ME"],
["E IL VENTO CI PORTA VIA",""],null];
const DAYS=[null,"1","2","3",null,null,null,null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
const BP=[0.8,0,-0.6];
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
    uBal:[BP[0],0,BP[2],1.0],uInflate:0,uFireB:0};
  let cam=[0.4,1.8,7.5], tgt=[0.7,1.0,-0.6], shake=0;
  const pop=(a)=>{const p=cl(a/0.25);return p<0.7?lerp(0.3,1.12,p/0.7):lerp(1.12,1,(p-0.7)/0.3);};
  const texts=[]; let flash=0, dark=0;
  const flame=(c)=>{ S.uPType=2; for(let i=0;i<14;i++){ const ph=(t*1.8+rnd(i))%1; S.uP[i*4]=c[0]+(rnd(i+3)-0.5)*0.12; S.uP[i*4+1]=c[1]+ph*0.5; S.uP[i*4+2]=c[2]+(rnd(i+5)-0.5)*0.12; S.uP[i*4+3]=0.04*(1-ph); } };
  const inBasket=(by,bx,bz)=>{ S.uChar=[bx,by+0.08,bz+0.05]; S.uCharRot=0.2; };
  if(k===0){ const h=lerp(0.3,3.2,ease(cl(lt/4))); S.uBal=[BP[0],h,BP[2],1.0]; S.uInflate=1; S.uFireB=1; flame([BP[0],h+2.25,BP[2]]); inBasket(h,BP[0],BP[2]); S.uArm=2.6; S.uEye=1;
    S.uEyes=[BP[0]+0.45,h-0.25,BP[2]+0.35,1]; S.uRobe=0; S.uDArm=2; cam=[0.2,2.2,11]; tgt=[0.7,lerp(2.6,4.4,e),-0.6]; }
  if(k===1){ S.uChar=[BP[0]-0.9,0,BP[2]+0.5]; S.uCharRot=1.4; S.uArm=1.2; S.uEye=0.9; cam=L3([0.3,1.4,4.4],[0.4,1.2,3.6],e); tgt=[0.6,0.4,-0.6]; }
  if(k===2){ const f=ease(cl(lt/4)); S.uChar=[lerp(4.2,BP[0]-0.9,f),0,lerp(0.2,BP[2]+0.6,f)]; S.uCharRot=-1.4; S.uArm=1.6; S.uEye=1; S.uBob=0.06*Math.abs(Math.sin(t*10));
    S.uInflate=lt>3.5?0.12:0; cam=[2.0,1.8,7.5]; tgt=[2.2,1.0,-0.6]; if(lt>0.6&&lt<3.2) texts.push({text:'SHHH...',y:620,size:110,color:'#FFFFFF',scale:pop(lt-0.6)}); }
  if(k===3){ S.uInflate=lerp(0.15,1,ease(cl((lt-0.5)/3.2))); S.uFireB=1; flame([BP[0],2.25,BP[2]]); inBasket(0,BP[0],BP[2]); S.uArm=lt>2?2.4:1.0; S.uEye=1;
    cam=L3([0.4,2.0,7.0],[0.3,2.8,10.0],e); tgt=[0.7,lerp(1.4,2.8,e),-0.6]; }
  if(k===4){ S.uInflate=1; S.uFireB=1; flame([BP[0],2.25,BP[2]]); const bob=0.08*Math.sin(t*3); S.uBal=[BP[0],bob+0.05,BP[2],1.0]; inBasket(bob+0.05,BP[0],BP[2]); S.uArm=0.6; S.uEye=1;
    S.uRobe=0; const f=ease(cl(lt/2.2)); S.uEyes=[lerp(4.6,2.6,f),1.75,lerp(-0.8,0.2,f),1]; S.uDArm=lt>2.2?2:1;
    cam=[1.6,2.4,10.5]; tgt=[1.8,2.2,-0.6]; if(lt>2.6) texts.push({text:'IL MIO ACCAPPATOIO!',y:620,size:80,color:'#FF3B30',scale:pop(lt-2.6)}); }
  if(k===5){ S.uInflate=1; S.uFireB=1; const h=lerp(0.05,1.8,ease(cl((lt-1.0)/3.6))); S.uBal=[BP[0],h,BP[2],1.0]; flame([BP[0],h+2.25,BP[2]]); inBasket(h,BP[0],BP[2]); S.uArm=2.4; S.uEye=1;
    S.uRobe=0; const g=ease(cl(lt/1.0)); S.uEyes=[lerp(2.6,BP[0]+0.5,g),Math.max(1.75,h-0.2),lerp(0.2,BP[2]+0.4,g),1]; S.uDArm=2;
    cam=[0.6,2.4,10.5]; tgt=[0.8,lerp(2.0,3.2,e),-0.6]; }
  if(k===6||k===7){ const tt=t-st[6]; const h=1.8+2.2*tt+0.4*tt*tt; const dx=1.6*tt*tt*0.6; S.uInflate=1; S.uFireB=1; S.uBal=[BP[0]+dx,h,BP[2],1.0]; flame([BP[0]+dx,h+2.25,BP[2]]);
    inBasket(h,BP[0]+dx,BP[2]); S.uArm=2.6; S.uEye=1; S.uRobe=0; S.uEyes=[BP[0]+dx+0.5,h-0.2,BP[2]+0.4,1]; S.uDArm=2;
    cam=[-0.5,2.0,12]; tgt=[BP[0]+dx*0.8,h*0.85+1.6,-0.6]; if(k===7) dark=0.15; }
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  if(k===0){ texts.push({text:'LA MONGOLFIERA',y:250,size:100,color:'#FFFFFF',alpha:cl(lt/0.3)}); }
  if(DAYS[k]){ texts.push({text:'GIORNO',y:215,size:46,color:'#FFD23E',alpha:cl(lt/0.2)}); texts.push({text:DAYS[k],y:330,size:170,color:'#FFFFFF',scale:pop(lt)}); }
  if(SUBS[k]){ const s0=st[k]+0.15, v=vd[k], a=SUBS[k][0].length, b=Math.max(1,SUBS[k][1].length), cut=SUBS[k][1]?v*a/(a+b):99;
    const r=t-s0; if(r>=0&&r<cut) texts.push({text:SUBS[k][0],y:1500,size:60,color:'#FFFFFF',alpha:cl(r/0.15)});
    else if(r>=cut) texts.push({text:SUBS[k][1],y:1500,size:60,color:'#FFD23E',alpha:cl((r-cut)/0.15)}); }
  if(k===7&&lt>0.4){ texts.push({text:'CONTINUA...',y:420,size:130,color:'#39FF6A',alpha:(Math.floor(lt*8)%7===0&&lt<1.6)?0.3:1});
    texts.push({text:'SCRIVI "VOLA" NEI COMMENTI PER LA PARTE 2',y:1480,size:66,color:'#FFD23E',scale:pop(lt-0.7)}); }
  for(let i=1;i<8;i++){const a=t-st[i]; if(a>=0&&a<0.2) flash=Math.max(flash,0.6*(1-a/0.2));}
  return {S,C:{texts,flash,dark}};
}
(async()=>{
 const times=process.argv[2]?JSON.parse(process.argv[2]):null;
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});
 const p=await b.newPage({viewport:{width:1100,height:2900}});
 p.on('pageerror',e=>console.log('E',e.message));
 await p.goto('file:///tmp/claude-0/r3d/scene26.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`p27_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','video27.mp4']);
 const N=Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress27.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress27.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
