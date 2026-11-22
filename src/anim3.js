const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24;
const st=[0,4.6,8.4,13.0,16.8,21.8,25.7,30.7];
const T=36.7;
const vd=[3.7,2.6,2.9,2.6,4.0,2.8,3.4,2.9];
const SUBS=[["PARTE 3: GLI OCCHI","NELLA PISCINA SOTTO IL MIO GIARDINO"],
["PRENDO LA PALA","GLI OCCHI SI AVVICINANO"],
["POI DALL'ACQUA ESCE...","UN CASCO DA SUB"],
["È IL MIO VICINO MARIO","CON LA MUTA"],
["\"QUESTA PISCINA L'HO SCAVATA IO\"","\"IN VENT'ANNI. DI NOTTE.\""],
["E PERCHÉ","SOTTO IL MIO GIARDINO?!"],
["LUI SORRIDE...","\"GUARDA DOVE ARRIVA IL TUNNEL\""],null];
const DAYS=[null,"00:18","00:19","00:19","00:20","00:21","00:22",null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
function state(t){
  const k=seg(t), lt=t-st[k], d=(k<7?st[k+1]:T)-st[k], x=cl(lt/d), e=ease(x);
  const S={uTime:t,uDepth:5.2,uNight:1,uChar:[0.6,-11.3,-0.7],uCharRot:0.5,uArm:0.3,uBob:0,uShovel:0,uKneel:0,uFlash:0,uExc:[0,0,0,0],uExcArm:0,uGeyser:0,uPipeBroken:1,uHatch:1,uHatchOpen:1,uGreen:1.6+0.3*Math.sin(t*5),uLadder:1,uLadder2:1,uShaft:1,uWheel:2.8,uGreenPos:[1.0,-11.6,-1.0],
    uP:new Array(56).fill(0),uPType:1,uEye:1,uEyes:[3.2,-11.25,-1.6,1],uDArm:0,uTunnel:1};
  let cam=[2.9,-10.6,3.4], tgt=[3.2,-11.0,-1.5], shake=0;
  const bub=(cx)=>{for(let i=0;i<14;i++){const ph=((t*0.7)+i/14)%1; S.uP[i*4]=cx+(rnd(i)-0.5)*1.6; S.uP[i*4+1]=-11.7+ph*0.4; S.uP[i*4+2]=-1.6+(rnd(i+3)-0.5)*1.2; S.uP[i*4+3]=0.06*(1-ph);}};
  if(k===0){ bub(3.2); cam=L3([3.1,-10.9,1.8],[2.6,-10.4,3.6],e); tgt=[3.0,-11.0,-1.5]; }
  if(k===1){ S.uEyes=[lerp(3.2,2.5,e),-11.25,-1.6,1]; S.uShovel=1; S.uArm=1.6+0.1*Math.sin(t*12); S.uBob=-0.15; S.uCharRot=0.6; bub(S.uEyes[0]);
    cam=L3([1.6,-10.2,5.4],[1.8,-10.4,4.6],e); tgt=[1.6,-11.0,-1.2]; }
  if(k===2){ const r=ease(cl((lt-0.5)/1.2)); S.uEyes=[2.5,lerp(-11.25,-10.3,r),-1.6,1]; S.uShovel=1; S.uArm=lerp(1.6,2.5,r); S.uBob=lerp(-0.15,-0.4,r); S.uCharRot=0.6;
    if(lt>0.5){ const a=lt-0.5; for(let i=0;i<14;i++){ const th=rnd(i)*6.283, v=1.5+1.5*rnd(i+5); S.uP[i*4]=2.5+Math.cos(th)*v*a; S.uP[i*4+1]=-11.5+3.2*a-6*a*a; S.uP[i*4+2]=-1.6+Math.sin(th)*v*a*0.4; S.uP[i*4+3]=a<1.0?0.08:0;} }
    shake=(lt>0.5&&lt<1.1)?0.06:0; cam=L3([1.7,-9.9,6.2],[1.6,-9.8,6.8],e); tgt=[1.9,-10.7,-1.2]; }
  if(k===3){ S.uEyes=[2.5,-10.3,-1.6,1]; S.uDArm=2; cam=L3([2.6,-10.0,2.4],[2.55,-10.1,1.9],e); tgt=[2.5,-10.5,-1.6]; }
  if(k===4){ S.uEyes=[2.5,-10.3,-1.6,1]; S.uDArm=0.6+0.4*Math.sin(t*4); S.uArm=0.4; cam=L3([1.4,-9.8,6.0],[1.6,-9.9,5.6],e); tgt=[1.6,-10.6,-1.2]; }
  if(k===5){ S.uEyes=[2.5,-10.3,-1.6,1]; S.uArm=2.6+0.15*Math.sin(t*6); S.uBob=-0.2; S.uCharRot=0.3; cam=L3([0.9,-10.1,2.8],[0.8,-10.2,2.4],e); tgt=[0.6,-10.5,-0.8]; }
  if(k===6){ S.uEyes=[2.5,-10.3,-1.6,1]; S.uDArm=ease(cl(lt/0.6)); S.uCharRot=-0.4; S.uArm=0.4;
    cam=L3([2.0,-9.9,6.0],[5.4,-10.0,6.0],ease(cl((lt-1.2)/2.5))); tgt=L3([2.2,-10.6,-1.3],[7.0,-10.6,-1.1],ease(cl((lt-1.2)/2.5))); }
  if(k===7){ S.uEyes=[2.5,-10.3,-1.6,1]; S.uDArm=1; cam=L3([5.4,-10.0,6.0],[6.6,-10.4,1.6],e); tgt=L3([7.0,-10.6,-1.1],[9.5,-10.6,-1.1],e); }
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  const texts=[]; let flash=0, dark=0;
  const pop=(a)=>{const p=cl(a/0.25);return p<0.7?lerp(0.3,1.12,p/0.7):lerp(1.12,1,(p-0.7)/0.3);};
  if(k===0){ texts.push({text:'PARTE 3',y:300,size:150,color:'#39FF6A',scale:pop(lt)});
    if(lt>0.8) texts.push({text:'DI CHI SONO QUESTI OCCHI?',y:470,size:72,color:'#FFFFFF',alpha:cl((lt-0.8)/0.3)}); }
  if(DAYS[k]){ texts.push({text:'ORE',y:215,size:46,color:'#FFD23E',alpha:cl(lt/0.2)}); texts.push({text:DAYS[k],y:330,size:150,color:'#FFFFFF',scale:pop(lt)}); }
  if(SUBS[k]){ const s0=st[k]+0.15, v=vd[k], a=SUBS[k][0].length, b=SUBS[k][1].length, cut=v*a/(a+b);
    const r=t-s0; if(r>=0&&r<cut) texts.push({text:SUBS[k][0],y:1500,size:60,color:'#FFFFFF',alpha:cl(r/0.15)});
    else if(r>=cut) texts.push({text:SUBS[k][1],y:1500,size:60,color:'#FFD23E',alpha:cl((r-cut)/0.15)}); }
  if(k===7){ dark=0.3*cl(lt/0.8);
    if(lt>0.6) texts.push({text:'CONTINUA...',y:420,size:130,color:'#39FF6A',alpha:(Math.floor(lt*8)%7===0&&lt<1.6)?0.3:1});
    if(lt>1.8) texts.push({text:'SCRIVI "TUNNEL" NEI COMMENTI PER LA PARTE 4',y:1420,size:66,color:'#FFD23E',scale:pop(lt-1.8)}); }
  for(let i=1;i<8;i++){const a=t-st[i]; if(a>=0&&a<0.2) flash=Math.max(flash,0.6*(1-a/0.2));}
  if(k===2&&lt>0.5&&lt<0.9) flash=Math.max(flash,0.8*(1-(lt-0.5)/0.4));
  return {S,C:{texts,flash,dark}};
}
(async()=>{
 const times=process.argv[2]?JSON.parse(process.argv[2]):null;
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});
 const p=await b.newPage({viewport:{width:1100,height:2900}});
 p.on('pageerror',e=>console.log('E',e.message));
 await p.goto('file:///tmp/claude-0/r3d/scene3.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`p3_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','video3.mp4']);
 const N=Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress3.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress3.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
