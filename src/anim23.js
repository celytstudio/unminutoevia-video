const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24;
const st=[0,4.8,9.4,11.4,15.0,19.4,23.4,27.4];
const T=31.8;
const vd=[4.0,3.9,0.8,2.6,3.2,3.2,2.9,2.7];
const SUBS=[["MARIO È SPARITO NEL PORTELLONE","STANOTTE, SCOPRO COSA C'È SOTTO"],
["MI TUFFO","E GIRO LA RUOTA DEL PORTELLONE"],
["SI APRE",""],
["UNA LUCE FORTISSIMA","E POI, MUSICA"],
["DAL PORTELLONE ESCE MARIO","CON UNA TORTA ENORME"],
["ERA UNA FESTA A SORPRESA","PER INAUGURARE LA PISCINA"],
["E L'AFFITTO? ADESSO LO PAGO IO","IN PIZZA"],null];
const DAYS=[null,"11",null,null,null,null,null,null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
const EDGE=[-0.95,0,-0.5], HC=[0.9,-1.2,-1.0];
function state(t){
  const k=seg(t), lt=t-st[k], d=(k<7?st[k+1]:T)-st[k], x=cl(lt/d), e=ease(x);
  const S={uTime:t,uDepth:0.001,uNight:0.9,uChar:EDGE.slice(),uCharRot:0.9,uArm:0.3,uBob:0,uShovel:0,uKneel:0,uFlash:0,uExc:[0,0,0,0],uExcArm:0,uGeyser:0,uPipeBroken:0,uHatch:1,uGreen:0.8,uLadder:0,
    uP:new Array(56).fill(0),uPType:3,uEye:0.7,uRocket:[0,0,0,0],uRocketV:0,uFire:0,uTilt:0,uHelm:0,uCola:0,uGeyPos:[0,0,0],
    uTree:[0,0,0,0],uBend:0,uTHStage:0,uLift:0,uHutPos:[100,0,0],uHutRot:0,uHutFly:0,uEyes:[0,0,0,0],uDArm:0,uRobe:1,
    uCat:[0,0,0,0],uCatA:0,uCatBig:0,uCatFlip:0,uProj:[0,0,0,0],uProjT:0,
    uCat2:[0,0,0,0],uCatA2:0,uCatBig2:0,uCatFlip2:0,uProj2:[0,0,0,0],uProjT2:0,
    uTramp:[0,0,0,0],uTramp2:0,uTrampDip:0,uCloud:[0,0,0,0],
    uSnow:[0,0,0,0],uSnowRot:0,uSnowSmile:0,uSnowG:0,uSnowHead:1,uSnow2:[0,0,0,0],uSnowRot2:0,uArmy:[0,0,0,0],uArmyRot:0,uBall:[0,0,0,0],uBall2:[0,0,0,0],
    uPool:1,uWater:1,uLadderP:1,uTiles:1,uHatchY:-1.2,uFurn:3,uHatchOpen:0,uParty:0,uCake:[0,0,0,0]};
  let cam=[0.5,1.2,6.4], tgt=[0.5,-0.2,-1.2], shake=0;
  const pop=(a)=>{const p=cl(a/0.25);return p<0.7?lerp(0.3,1.12,p/0.7):lerp(1.12,1,(p-0.7)/0.3);};
  const texts=[]; let flash=0, dark=0;
  const bubbles=(c,n0,rate)=>{ S.uPType=3; for(let i=0;i<14;i++){ const ph=(t*rate+rnd(i))%1; S.uP[i*4]=c[0]+(rnd(i+3)-0.5)*0.4+0.06*Math.sin(t*5+i); S.uP[i*4+1]=c[1]+ph*(-0.15-c[1]); S.uP[i*4+2]=c[2]+(rnd(i+9)-0.5)*0.4; S.uP[i*4+3]=i<n0?0.035+0.02*rnd(i+1):0; } };
  const confetti=()=>{ S.uPType=2; for(let i=0;i<14;i++){ const ph=(t*0.35+rnd(i))%1; S.uP[i*4]=-0.6+rnd(i+5)*3.0+0.2*Math.sin(t*3+i); S.uP[i*4+1]=2.6-ph*2.6; S.uP[i*4+2]=-2.3+rnd(i+11)*2.2; S.uP[i*4+3]=0.04; } };
  if(k===0){ S.uChar=EDGE.slice(); S.uArm=0.6; S.uEye=1; S.uGreen=0.8+0.2*Math.sin(t*3); cam=L3([0.5,1.4,7.0],[0.5,1.1,6.0],e); tgt=[0.5,-0.4,-1.2]; }
  if(k===1){ const a=lt-0.4; let g; if(a<0) g=EDGE.slice(); else if(a<0.8){ const u=a/0.8; g=[lerp(EDGE[0],0.1,u),lerp(0,-1.2,u)+1.4*Math.sin(u*3.14),lerp(EDGE[2],-0.6,u)]; } else g=[0.1,-1.2,-0.6];
    S.uChar=g; S.uCharRot=1.3; S.uArm=a>1.2?1.0+1.0*Math.abs(Math.sin(t*5)):2.6; S.uEye=1; if(a>0.8) bubbles([0.2,-0.2,-0.6],6,0.9);
    cam=L3([0.5,0.4,4.8],[0.6,0.0,3.6],e); tgt=[0.6,-0.9,-0.9]; }
  if(k===2){ S.uChar=[0.1,-1.2,-0.6]; S.uCharRot=1.3; S.uArm=2.6; S.uEye=1; S.uHatchOpen=lt>0.4?1:0; S.uGreen=lt>0.4?2.2:1; shake=lt>0.4&&lt<0.9?0.05:0; if(lt>0.4&&lt<0.6) flash=0.7;
    cam=[0.6,0.0,3.6]; tgt=[0.6,-0.9,-0.9]; }
  if(k===3){ S.uHatchOpen=1; S.uGreen=2.2+0.4*Math.sin(t*12); S.uChar=[-0.75,0,-0.3]; S.uCharRot=0.7; S.uArm=2.6; S.uEye=1; S.uParty=lt>1.2?1:0; if(lt>1.2) confetti(); if(lt>1.2&&lt<1.35) flash=0.5;
    cam=L3([0.5,0.8,5.0],[0.5,1.3,6.8],e); tgt=[0.6,0.0,-1.4]; if(lt>1.4) texts.push({text:'♪ ♫ ♪',y:620,size:120,color:'#FFD23E',scale:pop(lt-1.4)}); }
  if(k===4){ S.uHatchOpen=1; S.uGreen=1.6; S.uParty=1; confetti(); const r=ease(cl(lt/2.2)); const my=lerp(HC[1]-0.6,HC[1]+1.7,r); S.uEyes=[HC[0],my,HC[2],1]; S.uDArm=2; S.uCake=[HC[0],my+0.75,HC[2],0.9];
    S.uChar=[-0.75,0,-0.3]; S.uCharRot=0.7; S.uArm=2.6; S.uEye=1; cam=[0.5,1.3,6.4]; tgt=[0.6,lerp(-0.3,0.5,r),-1.2]; }
  if(k>=5){ S.uHatchOpen=1; S.uGreen=1.4; S.uParty=1; confetti(); S.uEyes=[HC[0],HC[1]+1.7+0.05*Math.sin(t*4),HC[2],1]; S.uDArm=Math.floor(t*2)%2?1:2; S.uCake=[0.0,0.0,-0.15,0.7];
    S.uChar=[-0.8,0,-0.35]; S.uCharRot=0.8; S.uArm=k===6?1.6:2.6; S.uEye=1; S.uBob=0.05*Math.sin(t*6);
    if(k===5){ cam=L3([0.5,1.1,5.4],[0.3,1.0,4.6],e); tgt=[0.3,0.4,-0.9]; texts.push({text:'SORPRESA!',y:620,size:140,color:'#FF4FA3',scale:pop(lt-0.3)}); }
    else if(k===6){ cam=[0.3,1.0,4.6]; tgt=[0.3,0.4,-0.9]; if(lt>1.6) texts.push({text:'AFFITTO: 1 PIZZA',y:620,size:100,color:'#FFD23E',scale:pop(lt-1.6)}); }
    else { cam=L3([0.3,1.0,4.6],[0.6,2.4,8.5],ease(cl(lt/3))); tgt=[0.6,0.2,-1.2]; } }
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  if(k===0){ texts.push({text:'LA PISCINA',y:250,size:110,color:'#FFFFFF',alpha:cl(lt/0.3)}); texts.push({text:'FINALE',y:360,size:90,color:'#FF3B30',scale:pop(lt-0.2)}); }
  if(DAYS[k]){ texts.push({text:'GIORNO',y:215,size:46,color:'#FFD23E',alpha:cl(lt/0.2)}); texts.push({text:DAYS[k],y:330,size:170,color:'#FFFFFF',scale:pop(lt)}); }
  if(SUBS[k]){ const s0=st[k]+0.15, v=vd[k], a=SUBS[k][0].length, b=Math.max(1,SUBS[k][1].length), cut=SUBS[k][1]?v*a/(a+b):99;
    const r=t-s0; if(r>=0&&r<cut) texts.push({text:SUBS[k][0],y:1500,size:60,color:'#FFFFFF',alpha:cl(r/0.15)});
    else if(r>=cut) texts.push({text:SUBS[k][1],y:1500,size:60,color:'#FFD23E',alpha:cl((r-cut)/0.15)}); }
  if(k===7){ texts.push({text:'FINE',y:440,size:200,color:'#FFFFFF',scale:pop(lt-0.1)});
    texts.push({text:'SEGUICI PER LA PROSSIMA STORIA',y:1480,size:72,color:'#FFD23E',scale:pop(lt-0.6)}); }
  for(let i=1;i<8;i++){const a=t-st[i]; if(a>=0&&a<0.2) flash=Math.max(flash,0.6*(1-a/0.2));}
  return {S,C:{texts,flash,dark}};
}
(async()=>{
 const times=process.argv[2]?JSON.parse(process.argv[2]):null;
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});
 const p=await b.newPage({viewport:{width:1100,height:2900}});
 p.on('pageerror',e=>console.log('E',e.message));
 await p.goto('file:///tmp/claude-0/r3d/scene22.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`p23_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','video23.mp4']);
 const N=Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress23.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress23.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
