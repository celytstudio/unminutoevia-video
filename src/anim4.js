const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24;
const st=[0,4.4,9.0,13.4,18.4,23.8,28.2,33.6];
const T=40.6;
const vd=[3.6,3.7,3.4,4.2,4.4,3.5,3.3,4.0];
const SUBS=[["HO COSTRUITO UN RAZZO IN GIARDINO","ED È PARTITO DAVVERO"],
["UN BIDONE DELLA SPAZZATURA","E UN CONO STRADALE"],
["IL VICINO MARIO","MI PRESTA IL SUO CASCO DA SUB"],
["CARBURANTE: 100 LITRI DI COLA","E 1000 MENTOS"],
["PRIMO TEST. SALTA DUE METRI...","...E FINISCE NELLA BUCA"],
["LO RIFACCIO. SEI METRI","CON L'OBLÒ"],
["3... 2... 1...","DECOLLO!"],
["MA A MILLE METRI...","IL MOTORE SI SPEGNE"]];
const DAYS=[null,"1","3","5","7","10","12",null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
function state(t){
  const k=seg(t), lt=t-st[k], d=(k<7?st[k+1]:T)-st[k], x=cl(lt/d), e=ease(x);
  const RX=-2.1, RZ=-0.4;
  const S={uTime:t,uDepth:1.5,uNight:0,uChar:[-3.25,0,-0.1],uCharRot:0.3,uArm:0.3,uBob:0,uShovel:0,uKneel:0,uFlash:0,uExc:[0,0,0,0],uExcArm:0,uGeyser:0,uPipeBroken:0,uHatch:0,uGreen:0,uLadder:0,
    uP:new Array(56).fill(0),uPType:3,uEye:0.6,uRocket:[RX,0,RZ,0.6],uRocketV:0,uFire:0,uTilt:0,uHelm:0,uCola:0,uGeyPos:[-0.3,0,-0.4]};
  let cam=[-1.5,1.4,7.5], tgt=[-1.8,0.8,-0.5], shake=0;
  const smoke=(c,spread,rise,amp)=>{for(let i=0;i<14;i++){const ph=((t*0.6)+i/14)%1; S.uP[i*4]=c[0]+(rnd(i)-0.5)*spread*(0.3+ph); S.uP[i*4+1]=c[1]+ph*rise; S.uP[i*4+2]=c[2]+(rnd(i+5)-0.5)*1.2*(0.3+ph); S.uP[i*4+3]=amp*(0.4+ph)*(1-ph*0.6);}};
  const pop=(a)=>{const p=cl(a/0.25);return p<0.7?lerp(0.3,1.12,p/0.7):lerp(1.12,1,(p-0.7)/0.3);};
  const texts=[]; let flash=0, dark=0;
  if(k===0){ S.uRocketV=1; const y=Math.pow(cl((lt-1.4)/3.0),2)*6; S.uRocket=[RX,y,RZ,1.4]; S.uFire=lt>1.2?1:0.3*cl(lt/1.2); S.uHelm=1; S.uChar=[-4.4,0,0.2]; S.uArm=2.4; S.uEye=1;
    smoke([RX,0.2,RZ],4,2.5,0.45); shake=0.05;
    cam=[-1.0,0.6,9.5]; tgt=[RX,1.8+y*0.7,RZ]; }
  if(k===1){ S.uRocket=[RX,0,RZ,0.6]; S.uArm=0.15; S.uBob=-0.05; S.uCharRot=0.2; cam=L3([-1.4,1.2,6.4],[-1.6,1.0,5.6],e); tgt=[-2.5,0.8,-0.4]; }
  if(k===2){ S.uRocket=[RX,0,RZ,0.6]; S.uHelm=1; S.uArm=2.4+0.2*Math.sin(t*6); S.uCharRot=0.15; cam=L3([-2.6,1.6,4.8],[-2.9,1.6,4.2],e); tgt=[-3.0,1.4,-0.2]; }
  if(k===3){ S.uRocket=[RX,0,RZ,0.6]; S.uHelm=1; S.uCola=1; S.uGeyPos=[-0.6,0,-0.3]; const g=cl((lt-1.4)/0.4); S.uGeyser=g*(0.9+0.1*Math.sin(t*12)); S.uArm=lt>1.5?2.6:0.6; S.uBob=lt>1.5?-0.35:0.1; S.uEye=lt>1.5?1:0.5; S.uChar=[-1.7,0,0.4]; S.uCharRot=0.6;
    if(g>0){ S.uPType=1; for(let i=0;i<14;i++){const ph=((t*0.9)+i/14)%1; const th=rnd(i)*6.283; S.uP[i*4]=-0.6+Math.cos(th)*1.2*ph; S.uP[i*4+1]=2.2*g*(1-ph*0.3)+2*ph-6*ph*ph; S.uP[i*4+2]=-0.3+Math.sin(th)*0.6*ph; S.uP[i*4+3]=0.07;} }
    cam=L3([-0.6,1.5,6.5],[-0.8,1.6,7.2],e); tgt=[-1.0,1.0,-0.3]; }
  if(k===4){ S.uHelm=1; const h=cl((lt-0.8)/1.4); const hx=lerp(RX,0.9,h), hy=4*h*(1-h)*2.2 + (h>=1?-1.5:0)*1 + lerp(0,-1.4,Math.pow(h,3)); const land=h>=1;
    S.uRocket=[hx, land?-1.45:hy, land?-0.8:lerp(RZ,-0.8,h), 0.6]; S.uTilt=land?0.6:h*0.8; S.uFire=(lt>0.6&&!land)?0.7:0; S.uChar=[-3.4,0,0.2]; S.uArm=land?2.6:0.6; S.uEye=1;
    if(lt>0.6&&!land) smoke([hx,Math.max(0,hy),-0.6],1.5,1.2,0.25); if(land){S.uPType=0; const a=lt-2.2; for(let i=0;i<14;i++){const th=rnd(i)*6.283; S.uP[i*4]=0.9+Math.cos(th)*1.4*a; S.uP[i*4+1]=-0.4+2.5*a-5*a*a; S.uP[i*4+2]=-0.8+Math.sin(th)*0.6*a; S.uP[i*4+3]=a<0.9?0.07:0;}}
    shake=(lt>2.2&&lt<2.6)?0.07:0; cam=[-0.9,2.0,9.5]; tgt=[-1.0,0.2,-0.6]; }
  if(k===5){ S.uRocketV=1; S.uRocket=[RX,0,RZ,1.4]; S.uHelm=1; S.uChar=[-4.0,0,0.2]; S.uCharRot=0.4; S.uArm=0.2+0.1*Math.sin(t*3); cam=L3([-1.0,0.5,8.0],[-1.2,2.2,9.5],e); tgt=L3([RX,1.0,RZ],[RX,2.6,RZ],e); }
  if(k===6){ S.uRocketV=1; S.uHelm=1; const lift=cl((lt-2.4)/3.0); const y=Math.pow(lift,2)*28; S.uRocket=[RX,y,RZ,1.4]; S.uFire=lt>2.1?1:0; S.uChar=[-4.4,0,0.2]; S.uArm=lt>2.4?2.6:0.6; S.uEye=1;
    if(lt>2.1) smoke([RX,0.3,RZ],5,2.5,0.5); shake=lt>2.1?0.06*(1-lift*0.6):0;
    cam=[-0.6,0.8+y*0.85,10.5]; tgt=[RX,2.0+y,RZ];
    const cd=['3','2','1']; const ci=Math.floor(lt/0.7); if(ci<3) texts.push({text:cd[ci],y:780,size:260,color:'#FFFFFF',scale:pop(lt-ci*0.7)}); }
  if(k===7){ S.uRocketV=1; const off=lt>1.6; const y=28+ (off? 6+ -2*Math.pow(lt-1.6,2)+ 4*cl((lt-1.6)) : lt*3.75); S.uRocket=[RX,y,RZ,1.4]; S.uFire=off?Math.max(0,1-(lt-1.6)*3):1; S.uTilt=off?cl((lt-1.6)/2)*2.4:0;
    S.uChar=[-40,0,0]; cam=[-0.5,y+0.5,11]; tgt=[RX,y+1.2,RZ]; }
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  if(k===0){ texts.push({text:'HO COSTRUITO UN RAZZO IN GIARDINO',y:300,size:72,color:'#FFFFFF',alpha:cl(lt/0.3)}); }
  if(DAYS[k]){ texts.push({text:'GIORNO',y:215,size:46,color:'#FFD23E',alpha:cl(lt/0.2)}); texts.push({text:DAYS[k],y:330,size:170,color:'#FFFFFF',scale:pop(lt)}); }
  if(k===7){ texts.push({text:'1000 M',y:330,size:110,color:'#FFFFFF',alpha:cl(lt/0.3)}); }
  if(SUBS[k]){ const s0=st[k]+0.15, v=vd[k], a=SUBS[k][0].length, b=SUBS[k][1].length, cut=v*a/(a+b);
    const r=t-s0; if(k===7&&lt>3.6){} else if(r>=0&&r<cut) texts.push({text:SUBS[k][0],y:1500,size:60,color:'#FFFFFF',alpha:cl(r/0.15)});
    else if(r>=cut) texts.push({text:SUBS[k][1],y:1500,size:60,color:'#FFD23E',alpha:cl((r-cut)/0.15)}); }
  if(k===7&&lt>3.6){ dark=0.3*cl((lt-3.6)/0.6);
    texts.push({text:'CONTINUA...',y:620,size:130,color:'#39FF6A',alpha:(Math.floor(lt*8)%7===0&&lt<4.6)?0.3:1});
    texts.push({text:'SCRIVI "RAZZO" NEI COMMENTI PER LA PARTE 2',y:1420,size:66,color:'#FFD23E',scale:pop(lt-3.8)}); }
  for(let i=1;i<8;i++){const a=t-st[i]; if(a>=0&&a<0.2) flash=Math.max(flash,0.6*(1-a/0.2));}
  return {S,C:{texts,flash,dark}};
}
(async()=>{
 const times=process.argv[2]?JSON.parse(process.argv[2]):null;
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});
 const p=await b.newPage({viewport:{width:1100,height:2900}});
 p.on('pageerror',e=>console.log('E',e.message));
 await p.goto('file:///tmp/claude-0/r3d/scene4.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`p4_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','video4.mp4']);
 const N=Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress4.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress4.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
