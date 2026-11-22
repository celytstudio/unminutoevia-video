const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24;
const st=[0,4.6,9.4,13.4,17.8,23.8,29.4,37.0];
const T=42.2;
const vd=[3.4,3.8,2.6,3.3,5.0,4.6,6.5,2.6];
const SUBS=[["MARIO HA TIRATO LA LEVA","E IO HO SORVOLATO TUTTO IL QUARTIERE"],
["VOLO SOPRA LE NUVOLE","SENZA PARACADUTE"],
["ATTERRO SUL TETTO DI MARIO","DI FACCIA"],
["RESTO BLOCCATO LASSÙ","TUTTA LA NOTTE"],
["MARIO MI LANCIA LA CENA, CON LA MIA CATAPULTA","SOLO POMODORI"],
["FINALMENTE SCENDO","MA LA MIA CATAPULTA È SPARITA"],
["GUARDO OLTRE LA RECINZIONE","MARIO NE HA COSTRUITA UNA GIGANTE. PUNTATA SU CASA MIA"],null];
const DAYS=[null,"12",null,"13","14","15","16",null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
function state(t){
  const k=seg(t), lt=t-st[k], d=(k<7?st[k+1]:T)-st[k], x=cl(lt/d), e=ease(x);
  const S={uTime:t,uDepth:0.001,uNight:0,uChar:[-2.4,0,0.2],uCharRot:0.4,uArm:0.3,uBob:0,uShovel:0,uKneel:0,uFlash:0,uExc:[0,0,0,0],uExcArm:0,uGeyser:0,uPipeBroken:0,uHatch:0,uGreen:0,uLadder:0,
    uP:new Array(56).fill(0),uPType:4,uEye:0.7,uRocket:[0,0,0,0],uRocketV:0,uFire:0,uTilt:0,uHelm:0,uCola:0,uGeyPos:[0,0,0],
    uTree:[0,0,0,0],uBend:0,uTHStage:0,uLift:0,uHutPos:[100,0,0],uHutRot:0,uHutFly:0,uEyes:[0,0,0,0],uDArm:0,uRobe:1,
    uCat:[0,0,0,0],uCatA:-0.4,uCatBig:0,uCatFlip:0,uProj:[0,0,0,0],uProjT:0};
  let cam=[-0.6,1.6,9.5], tgt=[-0.4,1.2,-1], shake=0;
  const pop=(a)=>{const p=cl(a/0.25);return p<0.7?lerp(0.3,1.12,p/0.7):lerp(1.12,1,(p-0.7)/0.3);};
  const texts=[]; let flash=0, dark=0;
  const ROOF=[4.9,3.05,-1.5];
  const splat=(c,t0,col)=>{const a=lt-t0; if(a<0||a>0.9) return; S.uPType=col; for(let i=0;i<14;i++){const th=rnd(i)*6.283; S.uP[i*4]=c[0]+Math.cos(th)*1.3*a; S.uP[i*4+1]=c[1]+Math.sin(th)*1.3*a-2*a*a; S.uP[i*4+2]=c[2]+0.4*a; S.uP[i*4+3]=0.06;}};
  if(k===0||k===1){ const tt=t; const gx=lerp(-3,3,tt/9.4); const gy=10.0+0.5*Math.sin(tt*2.2);
    S.uChar=[gx,gy-0.8,-5]; S.uCharRot=k===0?0.3:tt*3.5; S.uArm=2.6; S.uBob=-0.2+0.2*Math.sin(tt*9); S.uEye=1;
    const off=k===0?[0,1.0,7.0]:[0,1.4,8.5]; cam=[gx+off[0],gy+off[1],-5+off[2]]; tgt=[gx+0.4,gy+0.4,-5]; }
  if(k===2){ const f=cl(lt/0.8); const sx=lerp(2.6,ROOF[0],f), sy=lerp(7.5,ROOF[1],f*f);
    S.uChar=[sx,sy,ROOF[2]]; S.uCharRot=0.2; S.uArm=f<1?2.6:1.4; S.uEye=f<1?1:0.05; S.uBob=f<1?0:-0.45; S.uKneel=f<1?0:0.8;
    shake=(lt>0.8&&lt<1.2)?0.08:0; cam=[2.6,3.4,8.5]; tgt=[4.6,3.0,-1.5];
    if(lt>0.8) texts.push({text:'BONK!',y:560,size:140,color:'#FF3B30',scale:pop(lt-0.8)}); }
  if(k===3){ S.uNight=1; S.uChar=ROOF; S.uCharRot=0.1; S.uKneel=1; S.uArm=0.2; S.uEye=lerp(0.6,0.15,e); S.uBob=-0.1*Math.sin(t*2);
    cam=L3([2.2,3.6,9.5],[2.8,3.5,8.0],e); tgt=[4.6,3.1,-1.5]; if(lt>2) texts.push({text:'Z z z',y:560,size:90,color:'#BFD7FF',alpha:cl((lt-2)/0.4)}); }
  if(k===4){ const C=[2.4,0,0.8], sc=0.8; S.uCat=[C[0],0,C[2],sc]; S.uChar=ROOF; S.uCharRot=0.1; S.uKneel=0.8; S.uArm=1.0;
    S.uEyes=[0.4,1.75,1.0,1]; S.uDArm=1;
    const throwAt=[1.0,3.2]; let ang=-0.4;
    for(const t0 of throwAt){ const a=lt-t0; if(a>=0&&a<0.3) ang=lerp(-0.4,1.6,a/0.3); else if(a>=0.3&&a<1.0) ang=lerp(1.6,-0.4,(a-0.3)/0.7);
      const tp=[C[0]-Math.cos(1.6)*1.6*sc, sc*(1+Math.sin(1.6)*1.6), C[2]];
      if(a>=0.3&&a<1.1){ const u=(a-0.3)/0.8; S.uProj=[lerp(tp[0],ROOF[0],u), lerp(tp[1],ROOF[1]+1.0,u)+2.2*Math.sin(u*3.14), lerp(tp[2],ROOF[2],u),0.12]; }
      if(a>=1.1&&a<2.0){ splat([ROOF[0],ROOF[1]+1.0,ROOF[2]+0.3],t0+1.1,4); S.uEye=0.05; } }
    S.uCatA=ang; cam=[1.6,2.8,10.5]; tgt=[3.2,2.2,-0.5]; }
  if(k===5){ S.uChar=[-0.9,0,0.4]; S.uCharRot=lt<2.3?0.0:0.6*Math.sin(lt*3); S.uArm=lt>2.3?2.2:0.4; S.uEye=lt>2.3?1:0.7;
    cam=L3([-0.4,1.8,7.5],[-0.6,1.6,6.2],e); tgt=[-0.8,1.0,-1];
    if(lt>2.5) texts.push({text:'???',y:560,size:140,color:'#FFD23E',scale:pop(lt-2.5)}); }
  if(k===6||k===7){ const C=[3.6,0,0.0], sc=2.4; S.uCat=[C[0],0,C[2],sc]; S.uCatBig=1; S.uCatFlip=1; S.uCatA=-0.4;
    const tp=[C[0]+Math.cos(-0.4)*1.6*sc, sc*(1+Math.sin(-0.4)*1.6), C[2]]; S.uProj=[tp[0],tp[1]+0.55,tp[2],0.5]; S.uProjT=2;
    S.uEyes=[6.4,1.75,1.4,1]; S.uDArm=k===7?2:(lt>3?1:0);
    S.uChar=[-2.6,0,1.2]; S.uCharRot=1.2; S.uEye=1; S.uArm=lt>2?2.4:0.4;
    if(k===6){ cam=L3([-4.6,2.0,7.5],[-2.0,3.0,12.5],e); tgt=L3([-2.4,1.4,0.5],[3.4,3.4,0],ease(cl(lt/2.0))); }
    else { cam=[0.8,3.4,13.5]; tgt=[3.4,3.4,0]; dark=lt>1.0?0.25:0; } }
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  if(k===0){ texts.push({text:'LA CATAPULTA',y:250,size:100,color:'#FFFFFF',alpha:cl(lt/0.3)}); texts.push({text:'PARTE 2',y:360,size:80,color:'#FFD23E',scale:pop(lt-0.2)}); if(lt>1.2) texts.push({text:'AAAAH!',y:560,size:120,color:'#FF3B30',scale:pop(lt-1.2)}); }
  if(DAYS[k]){ texts.push({text:'GIORNO',y:215,size:46,color:'#FFD23E',alpha:cl(lt/0.2)}); texts.push({text:DAYS[k],y:330,size:170,color:'#FFFFFF',scale:pop(lt)}); }
  if(SUBS[k]){ const s0=st[k]+0.15, v=vd[k], a=SUBS[k][0].length, b=SUBS[k][1].length, cut=v*a/(a+b);
    const r=t-s0; if(r>=0&&r<cut) texts.push({text:SUBS[k][0],y:1500,size:60,color:'#FFFFFF',alpha:cl(r/0.15)});
    else if(r>=cut) texts.push({text:SUBS[k][1],y:1500,size:60,color:'#FFD23E',alpha:cl((r-cut)/0.15)}); }
  if(k===7&&lt>0.8){ texts.push({text:'CONTINUA...',y:420,size:130,color:'#39FF6A',alpha:(Math.floor(lt*8)%7===0&&lt<2.0)?0.3:1});
    texts.push({text:'SCRIVI "GUERRA" NEI COMMENTI PER LA PARTE FINALE',y:1480,size:66,color:'#FFD23E',scale:pop(lt-1.0)}); }
  for(let i=1;i<8;i++){const a=t-st[i]; if(a>=0&&a<0.2) flash=Math.max(flash,0.6*(1-a/0.2));}
  return {S,C:{texts,flash,dark}};
}
(async()=>{
 const times=process.argv[2]?JSON.parse(process.argv[2]):null;
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});
 const p=await b.newPage({viewport:{width:1100,height:2900}});
 p.on('pageerror',e=>console.log('E',e.message));
 await p.goto('file:///tmp/claude-0/r3d/scene12.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`p12_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','video12.mp4']);
 const N=Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress12.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress12.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
