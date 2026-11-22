const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24;
const st=[0,5.2,10.6,15.4,18.8,23.8,28.2,34.0];
const T=38.6;
const vd=[4.4,4.6,4.0,2.2,4.2,3.5,5.1,2.7];
const SUBS=[["MARIO È SPARITO SOPRA LE NUVOLE","E ADESSO TOCCA A ME ANDARLO A PRENDERE"],
["DI MARIO, NESSUNA TRACCIA","LO ASPETTO TUTTO IL GIORNO"],
["AGGIUNGO UN TERZO TAPPETO","E SALTO ANCH'IO"],
["SUPERO LE NUVOLE","E LO VEDO"],
["MARIO È IN PIEDI SU UNA NUVOLA","TRANQUILLO. COME SE FOSSE A CASA SUA"],
["GLI TENDO LA MANO. PER UN CENTIMETRO","E RICADO GIÙ"],
["MARIO MI SALUTA DALL'ALTO","E LA SUA NUVOLA SE NE VA VERSO IL MARE"],null];
const DAYS=[null,"11","12",null,null,null,"13",null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
const TP=[1.0,0,0.3], CL=[2.6,14.0,0.0], CS=1.3;
const MTOP=CL[1]+1.0*CS;
function state(t){
  const k=seg(t), lt=t-st[k], d=(k<7?st[k+1]:T)-st[k], x=cl(lt/d), e=ease(x);
  const S={uTime:t,uDepth:0.001,uNight:0,uChar:[-1.0,0,1.6],uCharRot:0.4,uArm:0.3,uBob:0,uShovel:0,uKneel:0,uFlash:0,uExc:[0,0,0,0],uExcArm:0,uGeyser:0,uPipeBroken:0,uHatch:0,uGreen:0,uLadder:0,
    uP:new Array(56).fill(0),uPType:4,uEye:0.7,uRocket:[0,0,0,0],uRocketV:0,uFire:0,uTilt:0,uHelm:0,uCola:0,uGeyPos:[0,0,0],
    uTree:[0,0,0,0],uBend:0,uTHStage:0,uLift:0,uHutPos:[100,0,0],uHutRot:0,uHutFly:0,uEyes:[0,0,0,0],uDArm:0,uRobe:1,
    uCat:[0,0,0,0],uCatA:0,uCatBig:0,uCatFlip:0,uProj:[0,0,0,0],uProjT:0,
    uCat2:[0,0,0,0],uCatA2:0,uCatBig2:0,uCatFlip2:0,uProj2:[0,0,0,0],uProjT2:0,
    uTramp:[TP[0],0,TP[2],1.0],uTramp2:1,uTrampDip:0,uCloud:[CL[0],CL[1],CL[2],CS]};
  let cam=[1.0,2.4,10], tgt=[1.0,1.6,0], shake=0;
  const pop=(a)=>{const p=cl(a/0.25);return p<0.7?lerp(0.3,1.12,p/0.7):lerp(1.12,1,(p-0.7)/0.3);};
  const texts=[]; let flash=0, dark=0;
  const top=()=>S.uTramp[3]*(0.7+0.75*S.uTramp2);
  const marioCloud=(cx)=>{ const c=cx===undefined?CL[0]:cx; S.uEyes=[c,MTOP+1.55,CL[2]+0.3,1]; };
  if(k===0){ marioCloud(); S.uDArm=lt>0.5?2:0; const a=lt-0.8; const gy=a<0?6:(a<1.2?lerp(9,MTOP-0.3,Math.sin(a/1.2*1.57)):MTOP-0.3-6*(a-1.2)*(a-1.2)*3);
    S.uChar=[CL[0]-1.5,gy,CL[2]+0.6]; S.uCharRot=0.9; S.uArm=2.6; S.uEye=1; cam=[1.6,MTOP+1.2,9.5]; tgt=[1.8,MTOP+0.4,0];
    if(lt>2.4) texts.push({text:'NOOO!',y:560,size:130,color:'#FF3B30',scale:pop(lt-2.4)}); }
  if(k===1){ S.uChar=[-0.6,0,1.6]; S.uCharRot=0.3; S.uKneel=1; S.uArm=lt<2?2.0:0.2; S.uEye=lerp(0.9,0.2,e); S.uNight=lerp(0,0.45,e);
    cam=L3([0.4,1.8,9.0],[0.2,1.6,8.0],e); tgt=[0.6,1.6,0]; }
  if(k===2){ S.uTramp2=lt<1.0?1:2; const tp=top(); let h; if(lt<3.4){ const u=((lt+0.1)/1.6)%1; h=(lt<1.0?3:8)*4*u*(1-u); S.uTrampDip=h<0.4?0.3:0; } else { const a=lt-3.4; h=20*a+4*a*a; S.uTrampDip=a<0.2?0.45:0; }
    S.uChar=[TP[0],tp+h,TP[2]]; S.uArm=2.6; S.uEye=1; S.uBob=h<0.3?-0.25:0.1; cam=[0.4,3.4,15]; tgt=[1.0,lerp(3,5,e),0]; }
  if(k===3){ const gy=lerp(8,MTOP-0.4,Math.sin(cl(lt/2.6)*1.57)); S.uChar=[TP[0],gy,TP[2]]; S.uArm=2.6; S.uEye=1; marioCloud(); S.uDArm=0;
    cam=[0.2,gy+0.8,8.5]; tgt=[1.2,gy+0.8,0]; }
  if(k===4){ marioCloud(); S.uDArm=lt>2.5?1:0; S.uChar=[TP[0],MTOP-0.4+0.15*Math.sin(lt*1.2),TP[2]]; S.uCharRot=0.9; S.uArm=1.6; S.uEye=1;
    cam=L3([3.4,MTOP+1.6,8.0],[2.8,MTOP+1.4,6.8],e); tgt=[2.2,MTOP+0.8,0]; }
  if(k===5){ marioCloud(); S.uDArm=1; const a=lt-1.4; const gy=a<0?MTOP-0.3:MTOP-0.3-9*a*a; S.uChar=[TP[0]+0.4,gy,TP[2]]; S.uCharRot=0.9; S.uArm=2.6; S.uEye=1;
    cam=[2.0,MTOP+1.3,8.0]; tgt=[1.8,MTOP+0.6,0]; if(lt>1.6) texts.push({text:'NOOO!',y:560,size:130,color:'#FF3B30',scale:pop(lt-1.6)}); }
  if(k===6||k===7){ const cx=lerp(CL[0],CL[0]+3,cl((t-st[6])/10)); S.uCloud=[cx,CL[1],CL[2],CS]; marioCloud(cx); S.uDArm=2;
    S.uChar=[-0.4,0,1.8]; S.uCharRot=0.3; S.uArm=2.6; S.uEye=1; S.uTramp2=2;
    cam=[0.4,2.2,17]; tgt=[2.0,lerp(7.6,8.4,cl((t-st[6])/6)),0]; if(k===7) dark=0.2; }
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  if(k===0){ texts.push({text:'IL TAPPETO ELASTICO',y:250,size:90,color:'#FFFFFF',alpha:cl(lt/0.3)}); texts.push({text:'PARTE 2',y:350,size:80,color:'#FFD23E',scale:pop(lt-0.2)}); }
  if(DAYS[k]){ texts.push({text:'GIORNO',y:215,size:46,color:'#FFD23E',alpha:cl(lt/0.2)}); texts.push({text:DAYS[k],y:330,size:170,color:'#FFFFFF',scale:pop(lt)}); }
  if(SUBS[k]){ const s0=st[k]+0.15, v=vd[k], a=SUBS[k][0].length, b=SUBS[k][1].length, cut=v*a/(a+b);
    const r=t-s0; if(r>=0&&r<cut) texts.push({text:SUBS[k][0],y:1500,size:60,color:'#FFFFFF',alpha:cl(r/0.15)});
    else if(r>=cut) texts.push({text:SUBS[k][1],y:1500,size:60,color:'#FFD23E',alpha:cl((r-cut)/0.15)}); }
  if(k===7&&lt>0.5){ texts.push({text:'CONTINUA...',y:420,size:130,color:'#39FF6A',alpha:(Math.floor(lt*8)%7===0&&lt<1.6)?0.3:1});
    texts.push({text:'SCRIVI "NUVOLA" NEI COMMENTI PER LA PARTE FINALE',y:1480,size:66,color:'#FFD23E',scale:pop(lt-0.8)}); }
  for(let i=1;i<8;i++){const a=t-st[i]; if(a>=0&&a<0.2) flash=Math.max(flash,0.6*(1-a/0.2));}
  return {S,C:{texts,flash,dark}};
}
(async()=>{
 const times=process.argv[2]?JSON.parse(process.argv[2]):null;
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});
 const p=await b.newPage({viewport:{width:1100,height:2900}});
 p.on('pageerror',e=>console.log('E',e.message));
 await p.goto('file:///tmp/claude-0/r3d/scene15.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`p15_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','video15.mp4']);
 const N=Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress15.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress15.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
