const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24, T=45.9;
const st=[0,5.4,10.7,16.8,22.0,27.9,32.8,38.7];
const vd=[4.8,4.8,5.6,4.7,5.4,4.2,5.4,4.6];
const SUBS=[["VOLEVO SOLO UNA PISCINA","POI SOTTO TERRA HO TROVATO... QUESTO"],
["COMINCIO A SCAVARE CON UNA PALA","MIA MOGLIE: \"SEI IMPAZZITO\""],
["DOPO 3 GIORNI È GRANDE COME UN SECCHIO","ALLORA NOLEGGIO UNA RUSPA"],
["PRENDO IN PIENO IL TUBO DELL'ACQUA","IL GIARDINO DIVENTA UNA FONTANA"],
["LA BUCA È PROFONDA 10 METRI","I VICINI VENDONO I BIGLIETTI"],
["LA PALA COLPISCE QUALCOSA...","DI METALLO"],
["È UN PORTELLONE","E DA SOTTO ESCE UNA LUCE VERDE"],null];
const DAYS=[null,"1","4","7","12","15","16",null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
function state(t){
  const k=seg(t), lt=t-st[k], d=(k<7?st[k+1]:T)-st[k], x=cl(lt/d), e=ease(x);
  const S={uTime:t,uDepth:0.5,uNight:0,uChar:[-0.9,0,-0.8],uCharRot:-0.5,uArm:0.6,uBob:0.2,uShovel:1,uKneel:0,uFlash:0,uExc:[0,0,0,0],uExcArm:0,uGeyser:0,uPipeBroken:0,uHatch:0,uGreen:0,uLadder:0,uP:new Array(56).fill(0),uPType:0,uEye:0.4};
  let cam=[0.6,0.6,7.5], tgt=[0.5,-0.4,-1], shake=0;
  const dig=(f)=>{const ph=Math.sin(t*Math.PI*2*f); S.uArm=0.55+0.6*ph; S.uBob=0.3+0.18*ph;};
  const dirt=(src,dst,f,arc,r)=>{for(let i=0;i<14;i++){const ph=((t*f)+i/14)%1; const pr=0.6+0.4*rnd(i);
      const p=L3(src,dst,ph); p[1]+=arc*4*ph*(1-ph)*pr; p[2]+=(rnd(i+9)-0.5)*0.6*ph; S.uP[i*4]=p[0];S.uP[i*4+1]=p[1];S.uP[i*4+2]=p[2];S.uP[i*4+3]=(r*(0.6+0.6*rnd(i+3)))*(ph<0.97?1:0);}};
  const burst=(c,t0,life,spd,r,g)=>{const a=t-t0; for(let i=0;i<14;i++){ if(a<0||a>life){S.uP[i*4+3]=0;continue;}
      const th=rnd(i)*6.283, el=0.3+rnd(i+5)*1.1, v=spd*(0.5+rnd(i+7));
      S.uP[i*4]=c[0]+Math.cos(th)*Math.cos(el)*v*a; S.uP[i*4+1]=c[1]+Math.sin(el)*v*a-g*a*a; S.uP[i*4+2]=c[2]+Math.sin(th)*Math.cos(el)*v*a*0.5; S.uP[i*4+3]=r*(1-a/life*0.5);}};
  if(k===0){ S.uNight=1;S.uDepth=5.2;S.uHatch=1;S.uGreen=0.55+0.25*Math.sin(t*5)+0.1*Math.sin(t*13);S.uChar=[0.1,-5.2,-1.2];S.uCharRot=-0.5;S.uKneel=0.6;S.uShovel=0;S.uFlash=1;S.uArm=0.9;S.uBob=0.3;S.uEye=1;
    cam=L3([1.0,-1.6,10.5],[1.15,-3.4,5.2],e); tgt=L3([0.7,-3.8,-1.1],[0.6,-4.7,-1.1],e); }
  if(k===1){ S.uDepth=lerp(0.35,0.8,x); S.uChar=[-0.95,0,-0.7]; S.uCharRot=-0.55; dig(1.4);
    dirt([0.4,-S.uDepth+0.2,-0.6],[-1.7,0.25,-1.2],1.4,1.5,0.07);
    cam=L3([0.9,0.7,7.2],[0.5,0.5,6.4],e); tgt=[0.2,-0.3,-1]; }
  if(k===2){ S.uDepth=lerp(0.8,2.0,e); S.uChar=[-1.6,0.,-0.3]; S.uCharRot=-0.3; S.uShovel=1; S.uArm=1.2+0.2*Math.sin(t*6); S.uBob=0.0; S.uEye=0.9;
    S.uExc=[3.15,0,-1.0,1]; S.uExcArm=0.5+0.45*Math.sin(t*2.2);
    cam=L3([1.4,1.0,11],[1.2,0.6,10],e); tgt=[1.0,-0.6,-1]; }
  if(k===3){ S.uDepth=2.0; S.uPipeBroken=1; const g=cl((lt-0.6)/0.5); S.uGeyser=g*(0.9+0.1*Math.sin(t*9)); S.uChar=[-1.5,0,-0.3]; S.uCharRot=-0.4; S.uShovel=0;
    S.uArm=lt>0.7?2.6:0.6; S.uBob=lt>0.7?-0.35:0.1; S.uEye=lt>0.7?1:0.4; S.uPType=1;
    if(g>0){ for(let i=0;i<14;i++){const ph=((t*0.9)+i/14)%1; const th=rnd(i)*6.283; const sp=1.2+1.5*rnd(i+2);
      S.uP[i*4]=0.9+Math.cos(th)*sp*ph; S.uP[i*4+1]=-1.7+g*6*(1-ph*0.2)+3*ph-9*ph*ph; S.uP[i*4+2]=-1.0+Math.sin(th)*sp*ph*0.5; S.uP[i*4+3]=0.08+0.05*rnd(i);} }
    shake=g>0?0.06:0; cam=L3([0.8,1.6,11.5],[0.8,2.4,12.5],e); tgt=L3([0.6,0.5,-1],[0.6,1.6,-1],e); }
  if(k===4){ S.uDepth=lerp(2.0,4.6,ease(cl(lt/1.2))); S.uChar=[0.2,-S.uDepth,-1.3]; S.uCharRot=0.; S.uShovel=0; S.uLadder=1; S.uArm=2.4+0.4*Math.sin(t*9); S.uBob=0; S.uEye=1;
    cam=L3([0.8,-0.4,9],[0.8,-0.9,13.5],e); tgt=[0.7,-2.3,-1]; }
  if(k===5){ S.uDepth=5.2; S.uChar=[0.15,-5.2,-1.35]; S.uCharRot=-0.2; S.uLadder=1;
    const hit=2.6; if(lt<hit) dig(1.3); else {S.uArm=0.3;S.uBob=-0.1;S.uEye=1;}
    if(lt<hit){ dirt([0.6,-5.0,-0.9],[1.3,-4.0,-0.6],1.3,0.9,0.06);} else {S.uPType=2; burst([0.75,-5.05,-0.8],hit,0.7,3.0,0.04,4.5); S.uHatch=cl((lt-hit)/0.4); S.uGreen=0.15*S.uHatch;}
    shake=(lt>hit&&lt<hit+0.4)?0.08:0; cam=L3([1.5,-2.8,7.0],[1.3,-3.4,5.6],e); tgt=[0.8,-4.6,-1.2]; }
  if(k===6){ S.uDepth=5.2; S.uNight=cl(lt/1.0); S.uHatch=1; S.uGreen=(0.2+0.8*x)*(0.75+0.25*Math.sin(t*6)); S.uChar=[0.1,-5.2,-1.2]; S.uCharRot=-0.5; S.uKneel=cl(lt/1.0)*0.6; S.uShovel=0; S.uFlash=1; S.uArm=0.9; S.uBob=0.3; S.uEye=1; S.uLadder=1;
    cam=L3([1.4,-3.0,6.2],[1.25,-3.5,4.9],e); tgt=[0.6,-4.7,-1.1]; }
  if(k===7){ S.uDepth=5.2; S.uNight=1; S.uHatch=1; S.uGreen=0.9+0.35*Math.sin(t*8)+0.15*Math.sin(t*21); S.uChar=[0.1,-5.2,-1.2]; S.uCharRot=-0.5; S.uKneel=0.6; S.uShovel=0; S.uFlash=1; S.uArm=0.9; S.uBob=0.3; S.uEye=1; S.uLadder=1;
    cam=L3([1.25,-3.5,4.9],[1.7,-3.9,1.6],e); tgt=L3([0.6,-4.7,-1.1],[1.0,-5.1,-1.0],e); }
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  // texts
  const texts=[]; let flash=0, dark=0;
  const pop=(a)=>{const p=cl(a/0.25);return p<0.7?lerp(0.3,1.12,p/0.7):lerp(1.12,1,(p-0.7)/0.3);};
  if(k===0){ texts.push({text:'HO SCAVATO UNA PISCINA IN GIARDINO',y:300,size:72,color:'#FFFFFF',alpha:cl(lt/0.3)});
    if(lt>1.2) texts.push({text:'ERRORE.',y:470,size:110,color:'#FF3B30',scale:pop(lt-1.2)}); }
  if(DAYS[k]){ texts.push({text:'GIORNO',y:215,size:46,color:'#FFD23E',alpha:cl(lt/0.2)}); texts.push({text:DAYS[k],y:330,size:170,color:'#FFFFFF',scale:pop(lt)}); }
  if(SUBS[k]){ const s0=st[k]+0.15, v=vd[k], a=SUBS[k][0].length, b=SUBS[k][1].length, cut=v*a/(a+b);
    const r=t-s0; if(r>=0&&r<cut) texts.push({text:SUBS[k][0],y:1500,size:60,color:'#FFFFFF',alpha:cl(r/0.15)});
    else if(r>=cut) texts.push({text:SUBS[k][1],y:1500,size:60,color:'#FFD23E',alpha:cl((r-cut)/0.15)}); }
  if(k===7){ dark=0.35*cl(lt/0.8); texts.push({text:'STANOTTE LO APRO',y:330,size:86,color:'#FFFFFF',alpha:cl(lt/0.3)});
    if(lt>1.6) texts.push({text:'CONTINUA...',y:880,size:130,color:'#39FF6A',alpha:(Math.floor(lt*8)%7===0&&lt<2.6)?0.3:1});
    if(lt>2.6) texts.push({text:'SCRIVI "APRI" NEI COMMENTI PER LA PARTE 2',y:1400,size:66,color:'#FFD23E',scale:pop(lt-2.6)}); }
  for(let i=1;i<8;i++){const a=t-st[i]; if(a>=0&&a<0.2) flash=Math.max(flash,0.7*(1-a/0.2));}
  if(k===5&&lt>2.6&&lt<2.9) flash=Math.max(flash,0.9*(1-(lt-2.6)/0.3));
  return {S,C:{texts,flash,dark}};
}
(async()=>{
 const times=process.argv[2]?JSON.parse(process.argv[2]):null;
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});
 const p=await b.newPage({viewport:{width:1100,height:2900}});
 p.on('pageerror',e=>console.log('E',e.message));
 await p.goto('file:///tmp/claude-0/r3d/scene.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`k_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','video.mp4']);
 const N=Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
