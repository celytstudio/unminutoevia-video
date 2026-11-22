const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24;
const st=[0,5.0,8.8,12.2,16.6,19.8,23.4,27.8];
const T=33.4;
const vd=[4.2,3.0,2.6,3.3,2.4,2.7,3.4,2.6];
const SUBS=[["PARTE 3: IL FINALE","IL RAZZO PUNTA DRITTO NELLA BUCA"],
["ENTRA NELLA BUCA","E SFONDA IL PORTELLONE"],
["SCENDE PER VENTI METRI","NEL BUIO"],
["E FINISCE... SPLASH!","NELLA PISCINA SEGRETA DI MARIO"],
["ESCO DALL'OBLÒ","BAGNATO FRADICIO"],
["MARIO MI GUARDA E DICE:","\"BENTORNATO\""],
["VOLEVO ANDARE SULLA LUNA","SONO FINITO NELLA PISCINA DEL VICINO"],null];
const DAYS=[null,"10 M","-5 M","-20 M",null,null,null,null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
function state(t){
  const k=seg(t), lt=t-st[k], d=(k<7?st[k+1]:T)-st[k], x=cl(lt/d), e=ease(x);
  const RX=0.9, RZ=-0.9, SC=0.95, PI=Math.PI;
  const S={uTime:t,uDepth:5.2,uNight:0,uChar:[-60,0,0],uCharRot:0,uArm:0.3,uBob:0,uShovel:0,uKneel:0,uFlash:0,uExc:[0,0,0,0],uExcArm:0,uGeyser:0,uPipeBroken:1,uHatch:1,uHatchOpen:0,uGreen:0.8,uLadder:1,uLadder2:1,uShaft:1,uWheel:0,uGreenPos:[1.0,-11.6,-1.0],
    uP:new Array(56).fill(0),uPType:3,uEye:1,uEyes:[0,0,0,0],uDArm:0,uTunnel:1,uRocket:[RX,10,RZ,SC],uRocketV:1,uFire:1,uTilt:PI,uGinoIn:1};
  let cam=[RX+3,1.0,RZ+11], tgt=[RX,2,RZ], shake=0;
  const pop=(a)=>{const p=cl(a/0.25);return p<0.7?lerp(0.3,1.12,p/0.7):lerp(1.12,1,(p-0.7)/0.3);};
  const texts=[]; let flash=0, dark=0;
  const smoke=(y)=>{for(let i=0;i<14;i++){const ph=((t*1.2)+i/14)%1; S.uP[i*4]=RX+(rnd(i)-0.5)*1.2*ph; S.uP[i*4+1]=y+2.7+ph*3; S.uP[i*4+2]=RZ+(rnd(i+5)-0.5)*0.8*ph; S.uP[i*4+3]=0.22*(0.4+ph);}};
  // rocket nose tip ~ uRocket.y when tilt=PI
  if(k===0){ const y=lerp(9,4,e); S.uRocket=[RX,y,RZ,SC]; smoke(y); cam=L3([RX+3,1.5,RZ+12],[RX+2.4,0.8,RZ+9],e); tgt=[RX,lerp(6.5,1.5,e),RZ]; shake=0.04; }
  if(k===1){ const y=lerp(4,-5.1,ease(cl(lt/2.2))); S.uRocket=[RX,y,RZ,SC]; smoke(y); S.uHatchOpen=y<-4.9?1:0; cam=[RX+2.4,lerp(0.5,-2.5,x),RZ+8.5]; tgt=[RX,lerp(0.5,-4.4,x),RZ];
    if(y<-4.9){ shake=0.08; S.uPType=0; const a=lt-2.0; for(let i=0;i<14;i++){const th=rnd(i)*6.283; S.uP[i*4]=0.9+Math.cos(th)*1.4*a; S.uP[i*4+1]=-5.0+1.5*a-4*a*a; S.uP[i*4+2]=-1+Math.sin(th)*0.6*a; S.uP[i*4+3]=a<0.8?0.07:0;} } }
  if(k===2){ const y=lerp(-5.1,-9.6,x); S.uRocket=[RX,y,RZ,SC]; S.uHatchOpen=1; S.uFire=0.6; S.uNight=0.4; cam=[RX+2.2,y+1.6,RZ+7]; tgt=[RX,y+1.2,RZ]; shake=0.03; }
  if(k===3){ const f=cl(lt/0.8); const y=lerp(-9.6,-12.6,f); S.uRocket=[RX+lerp(0,1.6,f),y,RZ-0.3*f,SC]; S.uTilt=lerp(PI,PI-0.5,f); S.uHatchOpen=1; S.uFire=f<1?0.6:0; S.uNight=0.3;
    if(lt>0.8){ S.uPType=1; const a=lt-0.8; for(let i=0;i<14;i++){const th=rnd(i)*6.283, v=1.5+2*rnd(i+4); S.uP[i*4]=2.5+Math.cos(th)*v*a; S.uP[i*4+1]=-11.6+4.5*a-6*a*a; S.uP[i*4+2]=-1.2+Math.sin(th)*v*a*0.4; S.uP[i*4+3]=a<1.4?0.1:0;} }
    shake=(lt>0.8&&lt<1.4)?0.08:0; cam=[1.6,-9.6,7.5]; tgt=[1.6,-10.9,-1.0]; }
  const floatR=()=>{ S.uRocket=[4.4,-12.4+0.06*Math.sin(t*2),-0.9,SC]; S.uTilt=PI-1.1; S.uFire=0; S.uGinoIn=0; S.uHatchOpen=1; S.uNight=0.3; };
  if(k===4){ floatR(); S.uChar=[0.9,-11.3,-0.9]; S.uCharRot=0.2; S.uArm=0.3; S.uBob=0.1; S.uEye=0.3; S.uPType=1;
    for(let i=0;i<14;i++){const ph=((t*1.5)+i/14)%1; S.uP[i*4]=0.9+(rnd(i)-0.5)*0.9; S.uP[i*4+1]=-9.6-ph*1.6; S.uP[i*4+2]=-0.9+(rnd(i+2)-0.5)*0.6; S.uP[i*4+3]=0.04;}
    cam=L3([1.3,-10.0,3.8],[1.2,-10.1,3.3],e); tgt=[0.9,-10.3,-0.9]; }
  if(k===5){ floatR(); S.uChar=[0.9,-11.3,-0.9]; S.uCharRot=0.5; S.uEye=1; S.uEyes=[2.5,-10.3,-1.8,1]; S.uDArm=2; cam=L3([2.6,-10.1,4.0],[2.8,-10.1,3.4],e); tgt=[2.5,-10.5,-1.6]; }
  if(k===6||k===7){ floatR(); S.uChar=[0.9,-11.3,-0.9]; S.uCharRot=0.3; S.uArm=k===6?1.6:0.3; S.uEye=0.6; S.uEyes=[2.5,-10.3,-1.8,1]; S.uDArm=k===7?2:0.6; cam=k===6?L3([2.4,-9.6,8.0],[2.4,-9.4,9.0],e):L3([2.4,-9.4,9.0],[2.4,-8.6,11.5],e); tgt=[2.6,-10.6,-1.2]; }
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  if(k===0){ texts.push({text:'PARTE 3',y:300,size:150,color:'#39FF6A',scale:pop(lt)}); if(lt>0.8) texts.push({text:'IL FINALE DEL RAZZO',y:470,size:72,color:'#FFFFFF',alpha:cl((lt-0.8)/0.3)}); }
  if(DAYS[k]){ texts.push({text:'ALTEZZA',y:215,size:46,color:'#FFD23E',alpha:cl(lt/0.2)}); texts.push({text:DAYS[k],y:330,size:130,color:'#FFFFFF',scale:pop(lt)}); }
  if(k===3&&lt>0.8&&lt<2.4) texts.push({text:'SPLASH!',y:760,size:190,color:'#39C8FF',scale:pop(lt-0.8)});
  if(SUBS[k]){ const s0=st[k]+0.15, v=vd[k], a=SUBS[k][0].length, b=SUBS[k][1].length, cut=v*a/(a+b);
    const r=t-s0; if(r>=0&&r<cut) texts.push({text:SUBS[k][0],y:1500,size:60,color:'#FFFFFF',alpha:cl(r/0.15)});
    else if(r>=cut) texts.push({text:SUBS[k][1],y:1500,size:60,color:'#FFD23E',alpha:cl((r-cut)/0.15)}); }
  if(k===7){ texts.push({text:'FINE',y:420,size:170,color:'#39FF6A',scale:pop(lt)}); if(lt>1.0) texts.push({text:'SEGUICI PER LA PROSSIMA STORIA',y:1480,size:68,color:'#FFD23E',scale:pop(lt-1.0)}); }
  for(let i=1;i<8;i++){const a=t-st[i]; if(a>=0&&a<0.2) flash=Math.max(flash,0.6*(1-a/0.2));}
  if(k===3&&lt>0.8&&lt<1.1) flash=Math.max(flash,0.8);
  return {S,C:{texts,flash,dark}};
}
(async()=>{
 const times=process.argv[2]?JSON.parse(process.argv[2]):null;
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});
 const p=await b.newPage({viewport:{width:1100,height:2900}});
 p.on('pageerror',e=>console.log('E',e.message));
 await p.goto('file:///tmp/claude-0/r3d/scene9.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`p9_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','video9.mp4']);
 const N=Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress9.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress9.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
