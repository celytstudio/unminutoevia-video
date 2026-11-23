const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24;
const st=[0,5.2,9.6,14.8,18.8,23.6,28.2,33.4];
const T=38.0;
const vd=[4.4,3.4,4.1,2.8,4.0,3.6,4.4,2.9];
const SUBS=[["HO COSTRUITO UNA PISCINA IN GIARDINO","IL PROBLEMA È CHE MARIO CI SI È TRASFERITO"],
["SCAVO UNA BUCA","STAVOLTA, PICCOLA"],
["PIASTRELLE AZZURRE, SCALETTA","E ACQUA"],
["PRIMO TUFFO","PERFETTA"],
["DAL FONDO SALGONO DELLE BOLLE","TANTE BOLLE"],
["DALLE BOLLE","ESCE UN CASCO DA PALOMBARO"],
["È MARIO. DICE CHE ADESSO VIVE QUI","E CHE CHI SI TUFFA PAGA L'AFFITTO"],null];
const DAYS=[null,"1","3","4","5","6",null,null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
const EDGE=[-0.9,0,-0.6], PC=[0.9,-1.2,-1.3];
function state(t){
  const k=seg(t), lt=t-st[k], d=(k<7?st[k+1]:T)-st[k], x=cl(lt/d), e=ease(x);
  const S={uTime:t,uDepth:0.001,uNight:0,uChar:EDGE.slice(),uCharRot:0.9,uArm:0.3,uBob:0,uShovel:0,uKneel:0,uFlash:0,uExc:[0,0,0,0],uExcArm:0,uGeyser:0,uPipeBroken:0,uHatch:0,uGreen:0,uLadder:0,
    uP:new Array(56).fill(0),uPType:1,uEye:0.7,uRocket:[0,0,0,0],uRocketV:0,uFire:0,uTilt:0,uHelm:0,uCola:0,uGeyPos:[0,0,0],
    uTree:[0,0,0,0],uBend:0,uTHStage:0,uLift:0,uHutPos:[100,0,0],uHutRot:0,uHutFly:0,uEyes:[0,0,0,0],uDArm:0,uRobe:1,
    uCat:[0,0,0,0],uCatA:0,uCatBig:0,uCatFlip:0,uProj:[0,0,0,0],uProjT:0,
    uCat2:[0,0,0,0],uCatA2:0,uCatBig2:0,uCatFlip2:0,uProj2:[0,0,0,0],uProjT2:0,
    uTramp:[0,0,0,0],uTramp2:0,uTrampDip:0,uCloud:[0,0,0,0],
    uSnow:[0,0,0,0],uSnowRot:0,uSnowSmile:0,uSnowG:0,uSnowHead:1,uSnow2:[0,0,0,0],uSnowRot2:0,uArmy:[0,0,0,0],uArmyRot:0,uBall:[0,0,0,0],uBall2:[0,0,0,0],
    uPool:1,uWater:1,uLadderP:1,uTiles:1};
  let cam=[0.9,1.2,6.0], tgt=[0.9,-0.2,-1.2], shake=0;
  const pop=(a)=>{const p=cl(a/0.25);return p<0.7?lerp(0.3,1.12,p/0.7):lerp(1.12,1,(p-0.7)/0.3);};
  const texts=[]; let flash=0, dark=0;
  const bubbles=(n0,rate)=>{ S.uPType=3; for(let i=0;i<14;i++){ const ph=(t*rate+rnd(i))%1; S.uP[i*4]=PC[0]+(rnd(i+3)-0.5)*0.6+0.08*Math.sin(t*5+i); S.uP[i*4+1]=PC[1]+0.1+ph*1.15; S.uP[i*4+2]=PC[2]+(rnd(i+9)-0.5)*0.8; S.uP[i*4+3]=i<n0?0.04+0.03*rnd(i+1):0; } };
  const splash=(c,t0)=>{ const a=lt-t0; if(a<0||a>1) return; S.uPType=1; for(let i=0;i<14;i++){ const th=rnd(i)*6.283; S.uP[i*4]=c[0]+Math.cos(th)*1.2*a; S.uP[i*4+1]=c[1]+3.5*a*(0.6+rnd(i+2))-5*a*a; S.uP[i*4+2]=c[2]+Math.sin(th)*0.8*a; S.uP[i*4+3]=0.07; } };
  if(k===0){ const r=ease(cl((lt-0.6)/1.6)); S.uEyes=[PC[0],lerp(-0.9,0.45,r),PC[2],1]; S.uDArm=lt>2.4?2:0; bubbles(14,0.9); S.uChar=[EDGE[0],0,EDGE[2]]; S.uCharRot=0.9; S.uArm=lt>1.6?2.6:0.4; S.uEye=lt>1.6?1:0.6; S.uBob=lt>1.6?-0.15:0;
    cam=L3([0.9,0.9,5.2],[0.7,1.2,6.2],e); tgt=[0.6,-0.1,-1.2]; if(lt>2.0) texts.push({text:'?!',y:620,size:150,color:'#FF3B30',scale:pop(lt-2.0)}); }
  if(k===1){ S.uTiles=0; S.uWater=0; S.uLadderP=0; S.uChar=[0.9,-1.2,-1.0]; S.uCharRot=0.3; S.uShovel=1; S.uArm=1.2+0.8*Math.abs(Math.sin(t*4)); S.uEye=0.9; S.uKneel=0;
    cam=L3([0.9,1.2,5.6],[0.9,1.0,4.8],e); tgt=[0.9,-0.4,-1.2]; }
  if(k===2){ S.uTiles=lt>0.6?1:0; S.uLadderP=lt>1.6?1:0; S.uWater=ease(cl((lt-2.2)/2.6)); S.uChar=EDGE.slice(); S.uCharRot=0.9; S.uArm=lt>2.2?2.4:0.6; S.uEye=1;
    cam=[1.4,2.2,6.2]; tgt=[0.8,-0.4,-1.3]; }
  if(k===3){ const a=lt-0.5; let g; if(a<0) g=[EDGE[0],0,EDGE[2]]; else if(a<0.8){ const u=a/0.8; g=[lerp(EDGE[0],0.7,u),lerp(0,-0.6,u)+1.6*Math.sin(u*3.14),lerp(EDGE[2],-1.2,u)]; } else g=[0.7,lerp(-0.6,-0.95,cl((a-0.8)/0.6)),-1.2];
    S.uChar=g; S.uCharRot=1.2; S.uArm=2.6; S.uEye=1; splash([0.7,-0.1,-1.2],1.3); if(a>1.4){ S.uChar=[0.7,-1.0,-1.2]; S.uArm=2.6; }
    cam=[0.9,1.0,5.2]; tgt=[0.6,0.0,-1.2]; if(lt>2.0) texts.push({text:'SPLASH!',y:620,size:130,color:'#39C6FF',scale:pop(lt-2.0)}); }
  if(k===4){ S.uChar=[-0.7,0,-0.4]; S.uCharRot=0.6; S.uKneel=1; S.uArm=1.0; S.uEye=1; bubbles(Math.min(14,4+Math.floor(lt*4)),0.6+lt*0.15);
    cam=L3([0.9,0.6,4.4],[0.9,0.4,3.6],e); tgt=[0.9,-0.5,-1.3]; }
  if(k===5){ const r=ease(cl((lt-0.8)/2.0)); S.uEyes=[PC[0],lerp(-1.0,0.45,r),PC[2],1]; bubbles(14,1.2); S.uChar=[-0.7,0,-0.4]; S.uCharRot=0.6; S.uKneel=lt<2.2?1:0; S.uArm=lt>2.2?2.6:1.0; S.uEye=1; S.uBob=lt>2.2?-0.2:0;
    cam=[0.9,0.6,4.0]; tgt=[0.9,lerp(-0.6,0.0,r),-1.3]; shake=(lt>2.2&&lt<2.5)?0.04:0; }
  if(k===6||k===7){ S.uEyes=[PC[0],0.5+0.04*Math.sin(t*3),PC[2],1]; S.uDArm=k===6?(Math.floor(lt*2)%2?1:2):2; S.uChar=[-0.8,0,-0.2]; S.uCharRot=0.7; S.uArm=1.6; S.uEye=1;
    if(k===6){ cam=L3([0.9,1.0,5.0],[0.6,1.1,4.2],e); tgt=[0.6,0.2,-1.0]; if(lt>2.6) texts.push({text:'AFFITTO: 5 EURO A TUFFO',y:620,size:70,color:'#FFD23E',scale:pop(lt-2.6)}); }
    else { cam=[0.6,1.1,4.2]; tgt=[0.6,0.2,-1.0]; dark=0.2; } bubbles(6,0.5); }
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  if(k===0){ texts.push({text:'LA PISCINA',y:260,size:110,color:'#FFFFFF',alpha:cl(lt/0.3)}); }
  if(DAYS[k]){ texts.push({text:'GIORNO',y:215,size:46,color:'#FFD23E',alpha:cl(lt/0.2)}); texts.push({text:DAYS[k],y:330,size:170,color:'#FFFFFF',scale:pop(lt)}); }
  if(SUBS[k]){ const s0=st[k]+0.15, v=vd[k], a=SUBS[k][0].length, b=Math.max(1,SUBS[k][1].length), cut=SUBS[k][1]?v*a/(a+b):99;
    const r=t-s0; if(r>=0&&r<cut) texts.push({text:SUBS[k][0],y:1500,size:60,color:'#FFFFFF',alpha:cl(r/0.15)});
    else if(r>=cut) texts.push({text:SUBS[k][1],y:1500,size:60,color:'#FFD23E',alpha:cl((r-cut)/0.15)}); }
  if(k===7&&lt>0.4){ texts.push({text:'CONTINUA...',y:420,size:130,color:'#39FF6A',alpha:(Math.floor(lt*8)%7===0&&lt<1.6)?0.3:1});
    texts.push({text:'SCRIVI "PISCINA" NEI COMMENTI PER LA PARTE 2',y:1480,size:66,color:'#FFD23E',scale:pop(lt-0.7)}); }
  for(let i=1;i<8;i++){const a=t-st[i]; if(a>=0&&a<0.2) flash=Math.max(flash,0.6*(1-a/0.2));}
  return {S,C:{texts,flash,dark}};
}
(async()=>{
 const times=process.argv[2]?JSON.parse(process.argv[2]):null;
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});
 const p=await b.newPage({viewport:{width:1100,height:2900}});
 p.on('pageerror',e=>console.log('E',e.message));
 await p.goto('file:///tmp/claude-0/r3d/scene19.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`p20_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','video20.mp4']);
 const N=Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress20.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress20.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
