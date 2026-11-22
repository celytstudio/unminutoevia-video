const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24;
const st=[0,4.8,11.2,15.4,19.4,24.0,29.4,37.4];
const T=42.0;
const vd=[4.0,5.8,3.4,2.8,3.8,4.5,7.1,2.6];
const SUBS=[["HO FATTO UN PUPAZZO DI NEVE IN GIARDINO","LA MATTINA DOPO, SI ERA SPOSTATO"],
["NEVICA. FACCIO UN PUPAZZO DI NEVE","CAROTA, BOTTONI, SCIARPA"],
["LO TROVO GIRATO","GUARDA VERSO CASA MIA"],
["È A DUE METRI","DALLA MIA PORTA"],
["CHIEDO A MARIO","GIURA CHE NON È STATO LUI"],
["LO CONTROLLO DI NOTTE","ALLE TRE IN PUNTO, GIRA LA TESTA"],
["GLI FACCIO UN AMICO PIÙ PICCOLO","IL PICCOLO NON C'È PIÙ. E IL GRANDE SORRIDE"],null];
const DAYS=[null,"1","2","3","4","5","7",null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
const SP=[0.8,0,0.6];
function state(t){
  const k=seg(t), lt=t-st[k], d=(k<7?st[k+1]:T)-st[k], x=cl(lt/d), e=ease(x);
  const S={uTime:t,uDepth:0.001,uNight:0,uChar:[-0.8,0,1.6],uCharRot:0.4,uArm:0.3,uBob:0,uShovel:0,uKneel:0,uFlash:0,uExc:[0,0,0,0],uExcArm:0,uGeyser:0,uPipeBroken:0,uHatch:0,uGreen:0,uLadder:0,
    uP:new Array(56).fill(0),uPType:3,uEye:0.7,uRocket:[0,0,0,0],uRocketV:0,uFire:0,uTilt:0,uHelm:0,uCola:0,uGeyPos:[0,0,0],
    uTree:[0,0,0,0],uBend:0,uTHStage:0,uLift:0,uHutPos:[100,0,0],uHutRot:0,uHutFly:0,uEyes:[0,0,0,0],uDArm:0,uRobe:1,
    uCat:[0,0,0,0],uCatA:0,uCatBig:0,uCatFlip:0,uProj:[0,0,0,0],uProjT:0,
    uCat2:[0,0,0,0],uCatA2:0,uCatBig2:0,uCatFlip2:0,uProj2:[0,0,0,0],uProjT2:0,
    uTramp:[0,0,0,0],uTramp2:0,uTrampDip:0,uCloud:[0,0,0,0],
    uSnow:[SP[0],0,SP[2],1.0],uSnowRot:0,uSnowSmile:0,uSnowG:1,uSnow2:[0,0,0,0],uSnowRot2:0};
  let cam=[0.4,2.0,8], tgt=[0.4,1.3,0], shake=0;
  const pop=(a)=>{const p=cl(a/0.25);return p<0.7?lerp(0.3,1.12,p/0.7):lerp(1.12,1,(p-0.7)/0.3);};
  const texts=[]; let flash=0, dark=0;
  const snow=(c,span)=>{ S.uPType=3; for(let i=0;i<14;i++){ const ph=(t*0.25+rnd(i))%1; S.uP[i*4]=c[0]+(rnd(i+20)-0.5)*span+0.3*Math.sin(t+i); S.uP[i*4+1]=c[1]+3.5-ph*5; S.uP[i*4+2]=c[2]+(rnd(i+40)-0.5)*span*0.8; S.uP[i*4+3]=0.035; } };
  if(k===0){ S.uNight=0.85; S.uSnow=[0.2,0,2.2,1.0]; S.uSnowSmile=cl((lt-1.2)/0.6); S.uChar=[100,0,0];
    cam=L3([0.2,2.0,6.5],[0.2,2.0,4.8],e); tgt=[0.2,1.85,2.2]; snow([0.2,1,3.5],3); if(lt>1.4) texts.push({text:'?!',y:620,size:150,color:'#FF3B30',scale:pop(lt-1.4)}); }
  if(k===1){ const g=ease(cl(lt/3.5)); S.uSnow=[SP[0],0,SP[2],lerp(0.35,1.0,g)]; S.uSnowSmile=0.4; S.uSnowG=lerp(0.6,1,g); S.uChar=[-0.6,0,1.4]; S.uCharRot=0.9; S.uArm=1.2+0.8*Math.abs(Math.sin(t*5)); S.uEye=0.9;
    cam=L3([-0.2,1.8,7.5],[0.0,2.0,6.8],e); tgt=[0.3,1.3,0.6]; snow([0.3,1,1.5],4); }
  if(k===2){ S.uSnowRot=2.4; S.uSnowSmile=0.2; S.uChar=[-1.4,0,1.8]; S.uCharRot=0.6; S.uEye=1; S.uArm=lt>1.5?2.2:0.3;
    cam=[0.8,2.4,8.5]; tgt=[-0.8,1.4,-1.0]; snow([0,1,2],5); }
  if(k===3){ S.uSnow=[-3.0,0,-2.4,1.0]; S.uSnowRot=-0.2; S.uSnowSmile=0.2; S.uChar=[0.7,0,1.2]; S.uCharRot=-0.6; S.uEye=1; S.uArm=2.4;
    cam=L3([1.2,2.2,6.5],[0.8,2.0,5.0],e); tgt=[-2.2,1.4,-2.6]; snow([-1.5,1,0],5); }
  if(k===4){ S.uSnow=[-3.0,0,-2.4,1.0]; S.uSnowSmile=0.2; S.uChar=[-0.8,0,1.2]; S.uCharRot=0.9; S.uArm=lt<1.5?2.0:0.4; S.uEye=0.9; S.uEyes=[0.6,1.75,1.0,1]; S.uDArm=Math.floor(lt*3)%2===0?1:2;
    cam=[0.4,2.0,7.5]; tgt=[-0.6,1.4,-0.5]; if(lt>2.0) texts.push({text:'NON SONO STATO IO!',y:620,size:70,color:'#FFFFFF',scale:pop(lt-2.0)}); }
  if(k===5){ S.uNight=0.9; S.uSnow=[-3.0,0,-2.4,1.0]; S.uSnowRot=lt<2.6?1.1:lerp(1.1,-0.3,ease(cl((lt-2.6)/0.5))); S.uSnowSmile=lt<2.6?0.1:0.8; S.uChar=[100,0,0];
    cam=L3([-1.6,1.9,1.5],[-2.2,1.95,0.2],e); tgt=[-3.0,1.85,-2.4]; snow([-2.6,1,-1],3); if(lt>2.6&&lt<2.75) flash=0.4;
    texts.push({text:'03:00',y:620,size:110,color:'#FF3B30',alpha:cl(lt/0.3)}); }
  if(k===6){ const morning=lt>3.2; S.uNight=morning?0:0.75; S.uSnow=[-3.0,0,-2.4,1.0]; S.uSnowRot=morning?-0.4:0.3; S.uSnowSmile=morning?1.0:0.1;
    if(!morning) S.uSnow2=[-1.7,0,-1.9,0.5]; S.uSnowRot2=-0.5; S.uChar=morning?[-0.4,0,1.0]:[-0.1,0,-0.7]; S.uCharRot=morning?-0.5:-0.3; S.uArm=morning?2.6:1.4; S.uEye=1;
    cam=morning?L3([0.4,2.1,5.5],[-1.6,2.0,0.6],ease(cl((lt-3.2)/4))):[0.6,2.0,5.5]; tgt=morning?L3([-2.2,1.5,-2.2],[-3.0,1.9,-2.4],ease(cl((lt-3.2)/4))):[-1.8,1.1,-1.8];
    if(morning&&lt<3.35) flash=0.5; snow([-2,1,-1],4); }
  if(k===7){ S.uNight=0.3; S.uSnow=[-3.0,0,-2.4,1.0]; S.uSnowRot=-0.4; S.uSnowSmile=1; S.uChar=[100,0,0]; cam=[-2.0,1.95,-0.2]; tgt=[-2.95,1.88,-2.4]; dark=0.25; snow([-2.4,1,-1],3); }
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  if(k===0){ texts.push({text:'IL PUPAZZO DI NEVE',y:250,size:90,color:'#FFFFFF',alpha:cl(lt/0.3)}); }
  if(DAYS[k]){ texts.push({text:'GIORNO',y:215,size:46,color:'#FFD23E',alpha:cl(lt/0.2)}); texts.push({text:DAYS[k],y:330,size:170,color:'#FFFFFF',scale:pop(lt)}); }
  if(SUBS[k]){ const s0=st[k]+0.15, v=vd[k], a=SUBS[k][0].length, b=SUBS[k][1].length, cut=v*a/(a+b);
    const r=t-s0; if(r>=0&&r<cut) texts.push({text:SUBS[k][0],y:1500,size:60,color:'#FFFFFF',alpha:cl(r/0.15)});
    else if(r>=cut) texts.push({text:SUBS[k][1],y:1500,size:60,color:'#FFD23E',alpha:cl((r-cut)/0.15)}); }
  if(k===7&&lt>0.4){ texts.push({text:'CONTINUA...',y:420,size:130,color:'#39FF6A',alpha:(Math.floor(lt*8)%7===0&&lt<1.6)?0.3:1});
    texts.push({text:'SCRIVI "NEVE" NEI COMMENTI PER LA PARTE 2',y:1480,size:66,color:'#FFD23E',scale:pop(lt-0.7)}); }
  for(let i=1;i<8;i++){const a=t-st[i]; if(a>=0&&a<0.2) flash=Math.max(flash,0.6*(1-a/0.2));}
  return {S,C:{texts,flash,dark}};
}
(async()=>{
 const times=process.argv[2]?JSON.parse(process.argv[2]):null;
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});
 const p=await b.newPage({viewport:{width:1100,height:2900}});
 p.on('pageerror',e=>console.log('E',e.message));
 await p.goto('file:///tmp/claude-0/r3d/scene16.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`p17_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','video17.mp4']);
 const N=Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress17.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress17.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
