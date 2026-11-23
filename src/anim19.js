const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24;
const st=[0,4.6,9.6,11.8,15.8,20.4,25.8,30.6];
const T=35.0;
const vd=[3.8,4.2,1.0,3.0,3.8,4.2,4.0,2.7];
const SUBS=[["DIECI PUPAZZI DI NEVE CHE MI FISSANO","STANOTTE, SCOPRO LA VERITÀ"],
["MI AVVICINO AL PUPAZZO GRANDE","E GLI TOLGO LA CAROTA"],
["STARNUTISCE",""],
["LA TESTA CADE","E DENTRO C'È IL CASCO DI MARIO"],
["ERA LUI. TUTTE LE NOTTI","PER VENDICARSI DEL TAPPETO ELASTICO"],
["E I DIECI PUPAZZI? ERANO IL SUO ESERCITO","PER LA BATTAGLIA A PALLE DI NEVE"],
["HO PERSO","MA LA CIOCCOLATA CALDA, DOPO, L'HA OFFERTA LUI"],null];
const DAYS=[null,"9",null,null,null,null,null,null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
const SM=[3.2,0,0.9], HEAD=[3.2,1.95,0.9];
function state(t){
  const k=seg(t), lt=t-st[k], d=(k<7?st[k+1]:T)-st[k], x=cl(lt/d), e=ease(x);
  const S={uTime:t,uDepth:0.001,uNight:0.8,uChar:[1.0,0,1.8],uCharRot:1.3,uArm:0.3,uBob:0,uShovel:0,uKneel:0,uFlash:0,uExc:[0,0,0,0],uExcArm:0,uGeyser:0,uPipeBroken:0,uHatch:0,uGreen:0,uLadder:0,
    uP:new Array(56).fill(0),uPType:3,uEye:0.7,uRocket:[0,0,0,0],uRocketV:0,uFire:0,uTilt:0,uHelm:0,uCola:0,uGeyPos:[0,0,0],
    uTree:[0,0,0,0],uBend:0,uTHStage:0,uLift:0,uHutPos:[100,0,0],uHutRot:0,uHutFly:0,uEyes:[0,0,0,0],uDArm:0,uRobe:1,
    uCat:[0,0,0,0],uCatA:0,uCatBig:0,uCatFlip:0,uProj:[0,0,0,0],uProjT:0,
    uCat2:[0,0,0,0],uCatA2:0,uCatBig2:0,uCatFlip2:0,uProj2:[0,0,0,0],uProjT2:0,
    uTramp:[0,0,0,0],uTramp2:0,uTrampDip:0,uCloud:[0,0,0,0],
    uSnow:[SM[0],0,SM[2],1.0],uSnowRot:1.3,uSnowSmile:1,uSnowG:1,uSnowHead:1,uSnow2:[4.3,0,1.9,0.5],uSnowRot2:1.2,uArmy:[5.4,0,1.2,0.85],uArmyRot:1.25,uBall:[0,0,0,0],uBall2:[0,0,0,0]};
  let cam=[0.4,2.0,8], tgt=[0.4,1.3,0], shake=0;
  const pop=(a)=>{const p=cl(a/0.25);return p<0.7?lerp(0.3,1.12,p/0.7):lerp(1.12,1,(p-0.7)/0.3);};
  const texts=[]; let flash=0, dark=0;
  const snow=(c,span)=>{ S.uPType=3; for(let i=0;i<14;i++){ const ph=(t*0.25+rnd(i))%1; S.uP[i*4]=c[0]+(rnd(i+20)-0.5)*span+0.3*Math.sin(t+i); S.uP[i*4+1]=c[1]+3.5-ph*5; S.uP[i*4+2]=c[2]+(rnd(i+40)-0.5)*span*0.8; S.uP[i*4+3]=0.035; } };
  const burst=(c,t0,sz)=>{ const a=lt-t0; if(a<0||a>0.8) return; S.uPType=3; for(let i=0;i<14;i++){ const th=rnd(i)*6.283, ph=rnd(i+7)*3.14; S.uP[i*4]=c[0]+Math.cos(th)*Math.sin(ph)*2*a; S.uP[i*4+1]=c[1]+Math.cos(ph)*1.5*a-2*a*a; S.uP[i*4+2]=c[2]+Math.sin(th)*Math.sin(ph)*2*a; S.uP[i*4+3]=sz; } };
  if(k===0){ S.uChar=[lerp(-0.6,1.2,e),0,1.9]; S.uCharRot=1.4; S.uArm=1.4; S.uEye=1; S.uBob=0.05*Math.sin(t*10);
    cam=L3([-1.6,1.8,4.6],[-0.4,1.9,4.4],e); tgt=[4.0,1.2,1.0]; snow([2.5,1,2],5); }
  if(k===1){ S.uChar=[lerp(1.2,2.0,ease(cl(lt/2))),0,1.4]; S.uCharRot=1.3; S.uArm=lt>2.2?2.2:0.6; S.uEye=1; S.uSnowHead=lt<2.8?1:0.6;
    cam=L3([1.8,2.0,6.0],[2.2,2.0,4.8],e); tgt=[2.8,1.6,1.0]; snow([2.8,1,2],4); }
  if(k===2){ S.uChar=[2.0,0,1.4]; S.uCharRot=1.3; S.uArm=2.6; S.uEye=1; S.uSnowHead=0.6; S.uSnowRot=1.3+0.15*Math.sin(lt*30)*cl(1-lt); shake=lt<0.5?0.06:0;
    burst([HEAD[0]-0.3,HEAD[1],HEAD[2]],0.2,0.06); cam=[2.2,2.0,4.8]; tgt=[2.8,1.6,1.0]; texts.push({text:'ETCIÙ!',y:620,size:150,color:'#FFFFFF',scale:pop(lt-0.15)}); }
  if(k===3){ S.uChar=[2.0,0,1.4]; S.uCharRot=1.3; S.uArm=2.6; S.uEye=1; S.uSnowHead=0;
    const f=cl(lt/0.7); S.uBall=[lerp(HEAD[0],2.6,f),lerp(HEAD[1],0.3,f*f),lerp(HEAD[2],1.8,f),0.3];
    S.uEyes=[HEAD[0],HEAD[1]+0.05,HEAD[2],1]; S.uDArm=0; cam=L3([2.2,2.0,4.8],[2.4,2.1,3.8],ease(cl((lt-0.8)/2))); tgt=[3.0,1.7,1.0];
    if(lt>1.3) texts.push({text:'MARIO?!',y:620,size:140,color:'#FF3B30',scale:pop(lt-1.3)}); }
  if(k===4){ S.uChar=[2.0,0,1.4]; S.uCharRot=1.3; S.uArm=lt<2?2.6:1.2+0.5*Math.sin(t*8); S.uEye=1; S.uSnowHead=0; S.uBall=[2.6,0.3,1.8,0.3];
    S.uEyes=[HEAD[0],HEAD[1]+0.05+0.05*Math.abs(Math.sin(t*9)),HEAD[2],1]; S.uDArm=2; cam=[1.6,2.0,5.4]; tgt=[2.7,1.5,1.0];
    if(lt>1.5) texts.push({text:'AH AH AH!',y:620,size:110,color:'#FFD23E',scale:pop(lt-1.5)}); }
  if(k===5){ S.uNight=lerp(0.6,0,e); S.uSnowHead=0; S.uBall=[0,0,0,0]; S.uEyes=[HEAD[0],HEAD[1]+0.05,HEAD[2],1]; S.uDArm=2; S.uChar=[0.6,0,1.8]; S.uCharRot=1.2; S.uEye=1;
    const throws=[0.6,1.6,2.6,3.6]; let hit=false;
    throws.forEach((t0,i)=>{ const a=lt-t0; if(a>=0&&a<0.6){ const u=a/0.6; const src=[4.8+0.4*i,1.6,1.4]; const key=i%2?'uBall2':'uBall'; S[key]=[lerp(src[0],0.7,u),lerp(src[1],1.5,u)+1.2*Math.sin(u*3.14),lerp(src[2],1.9,u),0.14]; } if(a>=0.6&&a<1.2){ hit=true; burst([0.7,1.5,1.9],t0+0.6,0.05);} });
    S.uArm=hit?2.6:1.2; S.uBob=hit?-0.2:0; cam=L3([1.0,2.6,8.0],[1.6,2.8,9.0],e); tgt=[3.0,1.2,1.0]; snow([2,1,2],6); }
  if(k===6||k===7){ S.uNight=0.35; S.uSnow=[0,0,0,0]; S.uChar=[1.0,0,1.9]; S.uCharRot=0.8; S.uKneel=k===6?1:0; S.uArm=k===7?2.6:0.8; S.uEye=0.8; S.uEyes=[2.2,1.75,2.0,1]; S.uDArm=k===7?2:1;
    S.uProj=[1.6,0.9,2.4,0.0]; snow([2,1,2],6);
    if(k===6){ cam=L3([1.6,1.9,7.4],[1.6,1.8,6.6],e); tgt=[1.6,1.1,1.8]; } else { cam=L3([1.6,1.8,6.6],[1.8,3.6,11],ease(cl(lt/3))); tgt=[2.6,1.2,1.4]; dark=0.1; } }
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  if(k===0){ texts.push({text:'IL PUPAZZO DI NEVE',y:250,size:90,color:'#FFFFFF',alpha:cl(lt/0.3)}); texts.push({text:'FINALE',y:350,size:90,color:'#FF3B30',scale:pop(lt-0.2)}); }
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
 await p.goto('file:///tmp/claude-0/r3d/scene18.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`p19_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','video19.mp4']);
 const N=Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress19.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress19.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
