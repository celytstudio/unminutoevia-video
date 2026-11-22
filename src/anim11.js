const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24;
const st=[0,5.0,10.4,16.4,20.6,26.6,31.4,38.0];
const T=43.2;
const vd=[4.2,4.7,5.4,3.4,5.4,4.1,5.3,2.6];
const SUBS=[["HO COSTRUITO UNA CATAPULTA IN GIARDINO","E ALLA FINE HO LANCIATO ME STESSO"],
["UN CUCCHIAIO DI LEGNO","LANCIO UN POMODORO... IN FACCIA A ME"],
["BRACCIO DI TRE METRI","LANCIO UN'ANGURIA OLTRE LA RECINZIONE"],
["MARIO ME LA RILANCIA INDIETRO","PIÙ FORTE"],
["NE COSTRUISCO UNA ENORME","CON UNA GOMMA DI TRATTORE COME CONTRAPPESO"],
["TEST CON IL BIDONE","SPARISCE OLTRE LE NUVOLE"],
["MI SIEDO NEL CUCCHIAIO, SOLO PER PROVARE","POI MARIO TOCCA LA LEVA"],null];
const DAYS=[null,"1","3","5","7","9","12",null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
function state(t){
  const k=seg(t), lt=t-st[k], d=(k<7?st[k+1]:T)-st[k], x=cl(lt/d), e=ease(x);
  const CX=-0.6, CZ=-1.0;
  const S={uTime:t,uDepth:0.001,uNight:0,uChar:[-2.4,0,0.2],uCharRot:0.4,uArm:0.3,uBob:0,uShovel:0,uKneel:0,uFlash:0,uExc:[0,0,0,0],uExcArm:0,uGeyser:0,uPipeBroken:0,uHatch:0,uGreen:0,uLadder:0,
    uP:new Array(56).fill(0),uPType:4,uEye:0.7,uRocket:[0,0,0,0],uRocketV:0,uFire:0,uTilt:0,uHelm:0,uCola:0,uGeyPos:[0,0,0],
    uTree:[0,0,0,0],uBend:0,uTHStage:0,uLift:0,uHutPos:[100,0,0],uHutRot:0,uHutFly:0,uEyes:[0,0,0,0],uDArm:0,uRobe:1,
    uCat:[CX,0,CZ,0.5],uCatA:-0.35,uCatBig:0,uProj:[0,0,0,0],uProjT:0};
  let cam=[-0.6,1.6,9.5], tgt=[-0.4,1.2,-1], shake=0;
  const pop=(a)=>{const p=cl(a/0.25);return p<0.7?lerp(0.3,1.12,p/0.7):lerp(1.12,1,(p-0.7)/0.3);};
  const texts=[]; let flash=0, dark=0;
  const fire=(t0,dur)=>cl((lt-t0)/dur);
  const tip=(sc,a)=>[CX+sc*(-Math.cos(a)*1.6), sc*(1.0+Math.sin(a)*1.6), CZ];
  const splat=(c,t0,col)=>{const a=lt-t0; if(a<0||a>0.9) return; S.uPType=col; for(let i=0;i<14;i++){const th=rnd(i)*6.283; S.uP[i*4]=c[0]+Math.cos(th)*1.3*a; S.uP[i*4+1]=c[1]+Math.sin(th)*1.3*a-2*a*a; S.uP[i*4+2]=c[2]+0.4*a; S.uP[i*4+3]=0.06;}};
  if(k===0){ S.uCat=[CX,0,CZ,1.6]; S.uCatBig=1; const f=fire(1.2,0.35); S.uCatA=lerp(-0.4,1.9,f); S.uChar=[-60,0,0];
    const tp=tip(1.6,S.uCatA); if(f<1){ S.uChar=[tp[0],tp[1]-0.3,CZ+0.3]; S.uArm=2.6; S.uEye=1; } else { const a=lt-1.55; S.uChar=[tp[0]+6*a, tp[1]+9*a-3*a*a, CZ+0.3]; S.uArm=2.6; S.uBob=-0.4; }
    S.uEyes=[-3.6,1.75,0.2,1]; S.uDArm=1; cam=[0.0,2.4,12.5]; tgt=[0.6,lerp(2.6,4.5,cl((lt-1.5)/2)),-1]; shake=(lt>1.2&&lt<1.6)?0.06:0; }
  if(k===1){ S.uCat=[CX,0,CZ,0.25]; const f=fire(1.6,0.25); S.uCatA=lerp(-0.4,1.6,f); S.uChar=[-1.3,0,-0.5]; S.uCharRot=0.5; S.uArm=1.2; S.uKneel=0.7;
    if(f>0){ const a=lt-1.6; const hit=a>0.45; if(!hit) S.uProj=[lerp(CX-0.1,-1.3,a/0.45),lerp(0.6,1.3,a/0.45)+0.6*Math.sin(a/0.45*3.1),CZ+lerp(0,0.6,a/0.45),0.09]; splat([-1.25,1.25,0.0],2.05,4); if(hit){S.uEye=0.05; S.uBob=-0.3;} } else S.uProj=[CX+0.25*0.42*-1+0.0,0.25*(1.0+Math.sin(-0.4)*1.6)+0.08,CZ,0.09];
    S.uProjT=0; cam=L3([-1.0,1.0,4.2],[-1.0,1.0,3.6],e); tgt=[-1.0,0.8,-0.6]; }
  if(k===2){ S.uCat=[CX,0,CZ,0.9]; const f=fire(1.5,0.35); S.uCatA=lerp(-0.4,1.9,f); S.uChar=[-2.6,0,-0.3]; S.uArm=f>0?2.5:0.4; S.uProjT=1;
    const tp=tip(0.9,S.uCatA); if(f<1) S.uProj=[tp[0],tp[1]+0.25,CZ,0.3]; else { const a=lt-1.85; S.uProj=[tp[0]+5*a, tp[1]+6*a-4.9*a*a*0.6, CZ-0.3*a,0.3]; }
    cam=[0.6,2.4,11.5]; tgt=L3([0,1.2,-1],[2.5,2.5,-1.5],cl((lt-1.8)/2.0)); }
  if(k===3){ S.uCat=[CX,0,CZ,0.9]; S.uCatA=1.9; S.uChar=[-1.6,0,0.1]; S.uCharRot=0.3; S.uArm=0.4; S.uEyes=[3.4,1.75,-0.4,1]; S.uDArm=lt<1.0?1:2; S.uProjT=1;
    const a=lt-0.9; if(a>0&&a<1.0){ S.uProj=[lerp(3.0,-1.55,a), 1.5+3.5*Math.sin(a*3.14), lerp(-0.6,0.1,a),0.3]; } if(a>=1.0){ splat([-1.55,1.6,0.3],1.9,4); S.uEye=0.05; S.uBob=-0.4; S.uArm=2.6; }
    shake=(a>=1.0&&a<1.4)?0.06:0; cam=[1.0,2.2,12.5]; tgt=[1.0,1.5,-1]; }
  if(k===4){ S.uCat=[CX,0,CZ,lerp(0.9,1.6,ease(cl(lt/2.5)))]; S.uCatBig=lt>1.2?1:0; S.uCatA=-0.4; S.uChar=[-3.4,0,0.2]; S.uArm=2.4+0.2*Math.sin(t*6); S.uCharRot=0.5;
    cam=L3([0.0,2.0,11],[0.2,2.8,13],e); tgt=[-0.6,2.0,-1]; }
  if(k===5){ S.uCat=[CX,0,CZ,1.6]; S.uCatBig=1; const f=fire(1.2,0.35); S.uCatA=lerp(-0.4,1.9,f); S.uChar=[-3.4,0,0.2]; S.uArm=f>0?2.6:0.3; S.uEye=f>0?1:0.6; S.uProjT=2;
    const tp=tip(1.6,S.uCatA); if(f<1) S.uProj=[tp[0],tp[1]+0.4,CZ,0.4]; else { const a=lt-1.55; S.uProj=[tp[0]+4*a, tp[1]+12*a, CZ-0.5*a,0.4]; }
    shake=(lt>1.2&&lt<1.6)?0.05:0; cam=[0.2,1.6,12.5]; tgt=L3([-0.4,2.4,-1],[1.5,9,-1.5],cl((lt-1.5)/2.0)); }
  if(k===6){ S.uCat=[CX,0,CZ,1.6]; S.uCatBig=1; S.uCatA=-0.4; const tp=tip(1.6,-0.4); S.uChar=[tp[0],tp[1]-0.3,CZ+0.3]; S.uCharRot=0.2; S.uArm=lt<2.5?0.4:2.6; S.uEye=lt<2.5?0.5:1; S.uKneel=0.3;
    S.uEyes=[1.9,1.75,0.4,1]; S.uDArm=lt>3.0?1:0; cam=L3([-0.6,2.2,10],[-0.6,2.0,9],e); tgt=[-0.6,1.4,-0.6]; }
  if(k===7){ S.uCat=[CX,0,CZ,1.6]; S.uCatBig=1; const f=cl(lt/0.35); S.uCatA=lerp(-0.4,1.9,f); const tp=tip(1.6,S.uCatA);
    if(f<1){ S.uChar=[tp[0],tp[1]-0.3,CZ+0.3]; } else { const a=Math.min(lt-0.35,0.9); S.uChar=[tp[0]+6*a, tp[1]+9*a-3*a*a, CZ+0.3]; S.uBob=-0.4; }
    S.uArm=2.6; S.uEye=1; S.uEyes=[1.9,1.75,0.4,1]; S.uDArm=1; shake=lt<0.6?0.07:0; cam=[0.2,2.4,12.5]; tgt=[1.0,lerp(2.6,6.5,cl(lt/1.3)),-1]; dark=lt>1.3?0.25:0; }
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  if(k===0){ texts.push({text:'LA CATAPULTA',y:300,size:110,color:'#FFFFFF',alpha:cl(lt/0.3)}); if(lt>1.5) texts.push({text:'IIIIH!',y:470,size:120,color:'#FF3B30',scale:pop(lt-1.5)}); }
  if(DAYS[k]){ texts.push({text:'GIORNO',y:215,size:46,color:'#FFD23E',alpha:cl(lt/0.2)}); texts.push({text:DAYS[k],y:330,size:170,color:'#FFFFFF',scale:pop(lt)}); }
  if(SUBS[k]){ const s0=st[k]+0.15, v=vd[k], a=SUBS[k][0].length, b=SUBS[k][1].length, cut=v*a/(a+b);
    const r=t-s0; if(r>=0&&r<cut) texts.push({text:SUBS[k][0],y:1500,size:60,color:'#FFFFFF',alpha:cl(r/0.15)});
    else if(r>=cut) texts.push({text:SUBS[k][1],y:1500,size:60,color:'#FFD23E',alpha:cl((r-cut)/0.15)}); }
  if(k===7&&lt>1.3){ texts.push({text:'CONTINUA...',y:420,size:130,color:'#39FF6A',alpha:(Math.floor(lt*8)%7===0&&lt<2.3)?0.3:1});
    texts.push({text:'SCRIVI "LANCIO" NEI COMMENTI PER LA PARTE 2',y:1480,size:66,color:'#FFD23E',scale:pop(lt-1.6)}); }
  for(let i=1;i<8;i++){const a=t-st[i]; if(a>=0&&a<0.2) flash=Math.max(flash,0.6*(1-a/0.2));}
  return {S,C:{texts,flash,dark}};
}
(async()=>{
 const times=process.argv[2]?JSON.parse(process.argv[2]):null;
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});
 const p=await b.newPage({viewport:{width:1100,height:2900}});
 p.on('pageerror',e=>console.log('E',e.message));
 await p.goto('file:///tmp/claude-0/r3d/scene11.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`p11_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','video11.mp4']);
 const N=Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress11.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress11.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
