const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24;
const st=[0,5.4,11.0,16.8,22.2,27.2,32.4,37.8];
const T=42.4;
const vd=[4.7,5.0,5.1,4.8,4.4,4.6,4.2,2.6];
const SUBS=[["HO COSTRUITO UN TAPPETO ELASTICO IN GIARDINO","E IL MIO VICINO NON È PIÙ TORNATO GIÙ"],
["UN TAPPETO ELASTICO NORMALE","SALTO, E MI SENTO UN BAMBINO"],
["CAMBIO LE MOLLE CON QUELLE DI UN CAMION","SALTO PIÙ IN ALTO DELLA CASA"],
["MARIO MI VEDE PASSARE DAVANTI ALLA FINESTRA","DUE VOLTE"],
["METTO UN SECONDO TAPPETO SOPRA IL PRIMO","ARRIVO ALLE NUVOLE"],
["MARIO SCAVALCA LA RECINZIONE","VUOLE PROVARE ANCHE LUI"],
["FA UN SALTO SOLO. SPARISCE SOPRA LE NUVOLE","E NON TORNA PIÙ GIÙ"],null];
const DAYS=[null,"1","3","5","8","10",null,null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
const TP=[1.0,0,0.3];
function state(t){
  const k=seg(t), lt=t-st[k], d=(k<7?st[k+1]:T)-st[k], x=cl(lt/d), e=ease(x);
  const S={uTime:t,uDepth:0.001,uNight:0,uChar:[-1.6,0,1.4],uCharRot:0.5,uArm:0.3,uBob:0,uShovel:0,uKneel:0,uFlash:0,uExc:[0,0,0,0],uExcArm:0,uGeyser:0,uPipeBroken:0,uHatch:0,uGreen:0,uLadder:0,
    uP:new Array(56).fill(0),uPType:4,uEye:0.7,uRocket:[0,0,0,0],uRocketV:0,uFire:0,uTilt:0,uHelm:0,uCola:0,uGeyPos:[0,0,0],
    uTree:[0,0,0,0],uBend:0,uTHStage:0,uLift:0,uHutPos:[100,0,0],uHutRot:0,uHutFly:0,uEyes:[0,0,0,0],uDArm:0,uRobe:1,
    uCat:[0,0,0,0],uCatA:0,uCatBig:0,uCatFlip:0,uProj:[0,0,0,0],uProjT:0,
    uCat2:[0,0,0,0],uCatA2:0,uCatBig2:0,uCatFlip2:0,uProj2:[0,0,0,0],uProjT2:0,
    uTramp:[TP[0],0,TP[2],1.0],uTramp2:0,uTrampDip:0};
  let cam=[1.0,2.4,10], tgt=[1.0,1.6,0], shake=0;
  const pop=(a)=>{const p=cl(a/0.25);return p<0.7?lerp(0.3,1.12,p/0.7):lerp(1.12,1,(p-0.7)/0.3);};
  const texts=[]; let flash=0, dark=0;
  const top=()=>S.uTramp[3]*(S.uTramp2>0.5?1.45:0.7);
  const bounce=(H,P,ph)=>{ const u=((lt+ph)/P)%1; const h=H*4*u*(1-u); S.uTrampDip=h<0.25*H*0.2?0.25*(1-h/(0.05*H+0.01)):0; if(S.uTrampDip<0)S.uTrampDip=0; return h; };
  const gino=(h)=>{ S.uChar=[TP[0],top()+h,TP[2]]; S.uArm=h>0.3?2.6:1.2; S.uEye=1; S.uBob=h<0.2?-0.25:0.1; };
  const mario=(h,x0)=>{ const xx=x0===undefined?TP[0]:x0; S.uEyes=[xx,top()+h+1.7,TP[2],1]; S.uDArm=2; };
  const launch=(t0)=>{ const a=lt-t0; if(a<0){ mario(bounce(0.6,0.7,0)); return 0; } S.uTrampDip=a<0.25?0.45*(1-a/0.25):0; const h=a<0.12?0:14*(a-0.12)+6*(a-0.12)*(a-0.12); mario(h); return h; };
  if(k===0){ S.uTramp=[TP[0],0,TP[2],1.2]; S.uTramp2=1; const h=launch(1.0); S.uChar=[-0.9,0,2.2]; S.uCharRot=0.6; S.uArm=lt>1.2?2.6:0.6; S.uEye=1;
    cam=[0.2,1.6,11]; tgt=[0.6,lerp(2.4,9,cl((lt-1.0)/1.5)),0]; if(lt>1.3) texts.push({text:'BOING!',y:560,size:130,color:'#39C6FF',scale:pop(lt-1.3)}); }
  if(k===1){ gino(bounce(1.0,0.8,0)); S.uEyes=[0,0,0,0]; cam=L3([1.0,2.0,7.5],[1.0,2.2,6.5],e); tgt=[1.0,1.8,0]; }
  if(k===2){ gino(bounce(4.8,1.9,0.2)); cam=[0.0,3.0,13.5]; tgt=[1.0,lerp(2.5,3.6,e),0]; }
  if(k===3){ const h=bounce(6.5,2.4,0.3); gino(h); S.uEyes=[3.8,1.75,0.9,1]; S.uDArm=lt>2?1:0;
    cam=[6.2,2.6,7.5]; tgt=[2.2,2.4,0]; if(lt>2.4) texts.push({text:'?!',y:560,size:150,color:'#FFD23E',scale:pop(lt-2.4)}); }
  if(k===4){ S.uTramp2=lt>0.6?1:0; const h=lt<0.6?0:bounce(10.5,3.0,-0.6); gino(h); cam=[1.0,lerp(2.5,8,ease(cl(lt/3))),14]; tgt=[1.0,lerp(2,10,ease(cl(lt/3))),0]; }
  if(k===5){ S.uTramp2=1; const f=cl(lt/3.0); const mx=lerp(5.4,TP[0],f); const hop=f<1?0.4*Math.abs(Math.sin(lt*6)):0;
    if(f<1) S.uEyes=[mx,1.75+hop+(f>0.85?(f-0.85)/0.15*top():0),TP[2]+0.2,1]; else { mario(bounce(0.5,0.7,0)); } S.uDArm=f<1?1:2;
    S.uChar=[-1.6,0,1.4]; S.uCharRot=0.4; S.uArm=lt>3?2.4:0.4; S.uEye=lt>3?1:0.7; cam=[1.4,2.6,11.5]; tgt=[1.6,1.9,0]; }
  if(k===6){ S.uTramp2=1; const h=launch(1.2); S.uChar=[-0.9,0,2.2]; S.uCharRot=0.4; S.uArm=lt>1.4?2.6:0.6; S.uEye=1;
    cam=[0.6,1.8,11.5]; tgt=[0.8,lerp(2.6,9.5,ease(cl((lt-1.2)/1.6))),0]; shake=(lt>1.2&&lt<1.5)?0.06:0; }
  if(k===7){ S.uTramp2=1; S.uChar=[-1.6,0,1.4]; S.uCharRot=0.4; S.uArm=2.6; S.uEye=1; cam=[0.6,1.8,11.5]; tgt=[0.8,9.5,0]; dark=lt>0.8?0.2:0; }
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  if(k===0){ texts.push({text:'IL TAPPETO ELASTICO',y:250,size:90,color:'#FFFFFF',alpha:cl(lt/0.3)}); }
  if(DAYS[k]){ texts.push({text:'GIORNO',y:215,size:46,color:'#FFD23E',alpha:cl(lt/0.2)}); texts.push({text:DAYS[k],y:330,size:170,color:'#FFFFFF',scale:pop(lt)}); }
  if(SUBS[k]){ const s0=st[k]+0.15, v=vd[k], a=SUBS[k][0].length, b=SUBS[k][1].length, cut=v*a/(a+b);
    const r=t-s0; if(r>=0&&r<cut) texts.push({text:SUBS[k][0],y:1500,size:60,color:'#FFFFFF',alpha:cl(r/0.15)});
    else if(r>=cut) texts.push({text:SUBS[k][1],y:1500,size:60,color:'#FFD23E',alpha:cl((r-cut)/0.15)}); }
  if(k===7&&lt>0.5){ texts.push({text:'CONTINUA...',y:420,size:130,color:'#39FF6A',alpha:(Math.floor(lt*8)%7===0&&lt<1.6)?0.3:1});
    texts.push({text:'SCRIVI "MOLLA" NEI COMMENTI PER LA PARTE 2',y:1480,size:66,color:'#FFD23E',scale:pop(lt-0.8)}); }
  for(let i=1;i<8;i++){const a=t-st[i]; if(a>=0&&a<0.2) flash=Math.max(flash,0.6*(1-a/0.2));}
  return {S,C:{texts,flash,dark}};
}
(async()=>{
 const times=process.argv[2]?JSON.parse(process.argv[2]):null;
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});
 const p=await b.newPage({viewport:{width:1100,height:2900}});
 p.on('pageerror',e=>console.log('E',e.message));
 await p.goto('file:///tmp/claude-0/r3d/scene14.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`p14_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','video14.mp4']);
 const N=Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress14.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress14.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
