const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24;
const st=[0,5.2,9.1,13.1,16.8,20.4,25.4,30.6];
const T=36.8;
const vd=[4.5,3.0,2.9,2.7,2.6,4.1,3.6,3.4];
const SUBS=[["PARTE 2: L'ALBERO È CADUTO","E IO SONO ANCORA NELL'ASCENSORE"],
["LA CASA SULL'ALBERO","È FINITA SUL TETTO DI MARIO"],
["MARIO ESCE IN ACCAPPATOIO","CON IL CASCO DA SUB"],
["MI GUARDA E DICE:","\"TRANQUILLO, HO UN'IDEA\""],
["RADDRIZZIAMO L'ALBERO","CON LA RUSPA"],
["SPINGE, SPINGE...","E L'ALBERO SI RADDRIZZA. QUASI."],
["POI SCATTA COME UNA MOLLA","E LANCIA LA CASA IN ARIA"],
["DOVE ATTERRA?",""]];
const DAYS=[null,"07:00","07:05","07:06","07:30","07:45","07:46",null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
function state(t){
  const k=seg(t), lt=t-st[k], d=(k<7?st[k+1]:T)-st[k], x=cl(lt/d), e=ease(x);
  const TX=0.8, TZ=-1.8;
  const S={uTime:t,uDepth:0.001,uNight:0,uChar:[-0.6,0,-0.2],uCharRot:0.3,uArm:0.3,uBob:0,uShovel:0,uKneel:0,uFlash:0,uExc:[0,0,0,0],uExcArm:0,uGeyser:0,uPipeBroken:0,uHatch:0,uGreen:0,uLadder:0,
    uP:new Array(56).fill(0),uPType:0,uEye:1,uRocket:[0,0,0,0],uRocketV:0,uFire:0,uTilt:0,uHelm:0,uCola:0,uGeyPos:[0,0,0],
    uTree:[TX,0,TZ,1],uBend:-1.0,uTHStage:3,uLift:2.2,uHutPos:[TX,0,TZ],uHutRot:-1.0,uHutFly:0,uEyes:[0,0,0,0],uDArm:0,uRobe:1};
  let cam=[2.6,2.6,11.5], tgt=[2.8,1.6,-1.8], shake=0;
  const pop=(a)=>{const p=cl(a/0.25);return p<0.7?lerp(0.3,1.12,p/0.7):lerp(1.12,1,(p-0.7)/0.3);};
  const texts=[]; let flash=0, dark=0;
  const W=(lx,ly)=>{const b=S.uBend; return [TX+lx*Math.cos(b)-ly*Math.sin(b), lx*Math.sin(b)+ly*Math.cos(b)];};
  const mario=(x,z,arm)=>{S.uEyes=[x,1.75,z,1]; S.uDArm=arm;};
  if(k===0){ const w=W(1.45,2.65); S.uChar=[w[0],w[1],TZ+0.7]; S.uArm=2.5+0.2*Math.sin(t*7); S.uCharRot=0.2;
    cam=L3([2.6,3.6,13],[2.4,2.6,9.5],e); tgt=[2.8,1.8,-2.0]; }
  if(k===1){ S.uChar=[1.4,0,0.2]; S.uArm=0.4; S.uBob=0.1; S.uCharRot=0.5; cam=L3([4.4,2.2,6.5],[4.8,2.4,6.0],e); tgt=[4.6,1.8,-2.5]; }
  if(k===2){ S.uChar=[1.4,0,0.2]; S.uCharRot=0.6; mario(4.6,-0.9,lt>1.0?2:0); cam=L3([4.0,1.8,6.0],[4.2,1.8,5.2],e); tgt=[4.4,1.3,-1.0]; }
  if(k===3){ S.uChar=[1.4,0,0.2]; S.uCharRot=0.6; S.uArm=1.4; mario(3.6,-0.5,1); cam=L3([2.6,1.8,5.6],[2.5,1.7,5.0],e); tgt=[2.6,1.3,-0.4]; }
  if(k===4){ S.uChar=[-0.6,0,0.2]; S.uArm=2.4; mario(-1.7,-0.3,2); S.uExc=[4.4,0,0.4,1]; S.uExcArm=0.3+0.2*Math.sin(t*3);
    cam=[1.6,2.4,11]; tgt=[2.2,1.4,-1.5]; }
  if(k===5){ const push=ease(x); S.uBend=lerp(-1.0,-0.15,push); S.uHutRot=S.uBend; S.uChar=[-0.6,0,0.2]; S.uArm=2.4; mario(-1.7,-0.3,2); S.uExc=[lerp(4.4,2.9,push),0,0.4,1]; S.uExcArm=0.6;
    shake=0.02; cam=[1.2,2.6,11.5]; tgt=[1.4,2.0,-1.5]; }
  if(k===6){ const sp=cl((lt-0.5)/0.35); let b; if(lt<0.5) b=-0.15; else if(lt<0.85) b=lerp(-0.15,0.55,sp); else b=0.55*Math.exp(-(lt-0.85)*2.5)*Math.cos((lt-0.85)*9);
    S.uBend=b; S.uChar=[-0.6,0,0.2]; S.uArm=2.6; S.uEye=1; mario(-1.7,-0.3,2); S.uExc=[2.9,0,0.4,1];
    if(lt<0.8){ S.uHutRot=b; } else { const a=lt-0.8; S.uHutFly=1; S.uHutPos=[-0.98-5*a, 2.9+9*a-0.6*a*a, TZ]; S.uHutRot=0.55+a*3.0; }
    shake=(lt>0.5&&lt<1.0)?0.07:0; {const c=cl((lt-0.8)/2.5); const hp=S.uHutFly?S.uHutPos:[1.4,2.4,TZ]; cam=L3([1.2,2.6,11.5],[hp[0]+1,hp[1]-0.5,TZ+9],c); tgt=L3([1.4,2.4,-1.5],hp,c);} }
  if(k===7){ const a=lt+4.4; S.uHutFly=1; S.uHutPos=[-0.98-5*a, 2.9+9*a-0.6*a*a, TZ]; S.uHutRot=0.55+a*3.0; S.uBend=0; S.uChar=[-60,0,0];
    cam=[S.uHutPos[0]+1.0,S.uHutPos[1]-0.5,TZ+9]; tgt=[S.uHutPos[0],S.uHutPos[1],TZ]; }
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  if(k===0){ texts.push({text:'PARTE 2',y:300,size:150,color:'#39FF6A',scale:pop(lt)}); if(lt>0.8) texts.push({text:'LA CASA SULL\'ALBERO',y:470,size:72,color:'#FFFFFF',alpha:cl((lt-0.8)/0.3)}); }
  if(DAYS[k]){ texts.push({text:'ORE',y:215,size:46,color:'#FFD23E',alpha:cl(lt/0.2)}); texts.push({text:DAYS[k],y:330,size:150,color:'#FFFFFF',scale:pop(lt)}); }
  if(SUBS[k]&&k<7){ const s0=st[k]+0.15, v=vd[k], a=SUBS[k][0].length, b=SUBS[k][1].length, cut=v*a/(a+b);
    const r=t-s0; if(r>=0&&r<cut) texts.push({text:SUBS[k][0],y:1500,size:60,color:'#FFFFFF',alpha:cl(r/0.15)});
    else if(r>=cut) texts.push({text:SUBS[k][1],y:1500,size:60,color:'#FFD23E',alpha:cl((r-cut)/0.15)}); }
  if(k===7){ texts.push({text:'DOVE ATTERRA?',y:330,size:96,color:'#FFFFFF',alpha:cl(lt/0.3)});
    if(lt>1.0){ dark=0.25*cl((lt-1.0)/0.6); texts.push({text:'CONTINUA...',y:1180,size:130,color:'#39FF6A',alpha:(Math.floor(lt*8)%7===0&&lt<2.0)?0.3:1}); }
    if(lt>1.6) texts.push({text:'SCRIVI "CASA" NEI COMMENTI PER LA PARTE 3',y:1520,size:66,color:'#FFD23E',scale:pop(lt-1.6)}); }
  for(let i=1;i<8;i++){const a=t-st[i]; if(a>=0&&a<0.2) flash=Math.max(flash,0.6*(1-a/0.2));}
  return {S,C:{texts,flash,dark}};
}
(async()=>{
 const times=process.argv[2]?JSON.parse(process.argv[2]):null;
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});
 const p=await b.newPage({viewport:{width:1100,height:2900}});
 p.on('pageerror',e=>console.log('E',e.message));
 await p.goto('file:///tmp/claude-0/r3d/scene6.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`p6_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','video6.mp4']);
 const N=Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress6.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress6.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
