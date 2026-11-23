const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24;
const st=[0,4.6,9.0,13.0,17.8,22.4,26.2,32.6];
const T=37.2;
const vd=[3.8,3.5,2.9,3.8,3.7,2.9,5.0,2.7];
const SUBS=[["IL MIO PUPAZZO DI NEVE SI MUOVE DI NOTTE","STANOTTE, L'HO SEGUITO"],
["MI SIEDO DAVANTI ALLA PORTA","COPERTA E CAFFÈ"],
["MEZZANOTTE. NIENTE","L'UNA. NIENTE"],
["ALLE TRE IN PUNTO, SI GIRA","E COMINCIA A SCIVOLARE SULLA NEVE"],
["VA DRITTO VERSO IL GIARDINO DI MARIO","IO LO SEGUO, IN PIGIAMA"],
["E NEL GIARDINO DI MARIO","TROVO IL PUPAZZO PICCOLO"],
["E ALTRI DIECI PUPAZZI. TUTTI GIRATI VERSO CASA MIA","TUTTI CHE SORRIDONO"],null];
const DAYS=[null,"8",null,null,null,null,null,null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
const S0=[-0.6,0,0.4], SM=[3.2,0,0.9];
function state(t){
  const k=seg(t), lt=t-st[k], d=(k<7?st[k+1]:T)-st[k], x=cl(lt/d), e=ease(x);
  const S={uTime:t,uDepth:0.001,uNight:0.85,uChar:[-2.6,0,-2.6],uCharRot:0.6,uArm:0.3,uBob:0,uShovel:0,uKneel:0,uFlash:0,uExc:[0,0,0,0],uExcArm:0,uGeyser:0,uPipeBroken:0,uHatch:0,uGreen:0,uLadder:0,
    uP:new Array(56).fill(0),uPType:3,uEye:0.7,uRocket:[0,0,0,0],uRocketV:0,uFire:0,uTilt:0,uHelm:0,uCola:0,uGeyPos:[0,0,0],
    uTree:[0,0,0,0],uBend:0,uTHStage:0,uLift:0,uHutPos:[100,0,0],uHutRot:0,uHutFly:0,uEyes:[0,0,0,0],uDArm:0,uRobe:1,
    uCat:[0,0,0,0],uCatA:0,uCatBig:0,uCatFlip:0,uProj:[0,0,0,0],uProjT:0,
    uCat2:[0,0,0,0],uCatA2:0,uCatBig2:0,uCatFlip2:0,uProj2:[0,0,0,0],uProjT2:0,
    uTramp:[0,0,0,0],uTramp2:0,uTrampDip:0,uCloud:[0,0,0,0],
    uSnow:[S0[0],0,S0[2],1.0],uSnowRot:-0.5,uSnowSmile:0.3,uSnowG:1,uSnow2:[0,0,0,0],uSnowRot2:0,uArmy:[0,0,0,0],uArmyRot:0};
  let cam=[0.4,2.0,8], tgt=[0.4,1.3,0], shake=0;
  const pop=(a)=>{const p=cl(a/0.25);return p<0.7?lerp(0.3,1.12,p/0.7):lerp(1.12,1,(p-0.7)/0.3);};
  const texts=[]; let flash=0, dark=0;
  const snow=(c,span)=>{ S.uPType=3; for(let i=0;i<14;i++){ const ph=(t*0.25+rnd(i))%1; S.uP[i*4]=c[0]+(rnd(i+20)-0.5)*span+0.3*Math.sin(t+i); S.uP[i*4+1]=c[1]+3.5-ph*5; S.uP[i*4+2]=c[2]+(rnd(i+40)-0.5)*span*0.8; S.uP[i*4+3]=0.035; } };
  const slide=(f)=>{ const p=L3(S0,SM,f); S.uSnow=[p[0],0.04*Math.abs(Math.sin(f*40)),p[2],1.0]; };
  if(k===0){ slide(lerp(0.2,0.55,e)); S.uSnowRot=1.2; S.uSnowSmile=0.6; const sp=L3(S0,SM,lerp(0.2,0.55,e)); S.uChar=[sp[0]-2.0,0,sp[2]+0.6]; S.uCharRot=1.4; S.uArm=1.6; S.uEye=1;
    cam=[sp[0]-0.4,1.4,sp[2]+5.5]; tgt=[sp[0]-0.6,1.2,sp[2]]; snow([sp[0],1,sp[2]+2],4); }
  if(k===1||k===2){ S.uChar=[-2.3,0,2.3]; S.uCharRot=2.4; S.uKneel=1; S.uArm=0.8; S.uEye=k===1?0.8:lerp(0.6,0.15,e); S.uBob=k===2?-0.1*e:0;
    cam=k===1?L3([-4.0,1.8,5.6],[-3.8,1.7,5.0],e):[-3.8,1.7,5.0]; tgt=[-1.2,1.1,0.6]; snow([-1.4,1,1.2],4);
    if(k===2) texts.push({text:lt<1.6?'00:00':'01:00',y:620,size:110,color:'#FFFFFF',scale:pop(lt<1.6?lt:lt-1.6)}); }
  if(k===3){ S.uChar=[-2.3,0,2.3]; S.uCharRot=2.4; S.uKneel=lt<2.8?1:0; S.uArm=lt>2.8?2.4:0.8; S.uEye=lt<0.8?0.15:1;
    S.uSnowRot=lerp(-0.5,1.3,ease(cl((lt-0.6)/0.6))); S.uSnowSmile=lt>0.6?0.6:0.3; if(lt>1.8) slide(ease(cl((lt-1.8)/6)));
    cam=[-3.8,1.8,5.6]; tgt=[-0.6,1.1,0.6]; snow([-1.0,1,1.0],4); texts.push({text:'03:00',y:620,size:110,color:'#FF3B30',alpha:cl(lt/0.3)}); }
  if(k===4){ const f=lerp(0.5,1,e); slide(f); S.uSnowRot=1.3; S.uSnowSmile=0.6; const sp=L3(S0,SM,f); S.uChar=[sp[0]-2.6,0,sp[2]+0.8]; S.uCharRot=1.4; S.uArm=1.6; S.uEye=1; S.uBob=0.06*Math.sin(t*10);
    cam=[sp[0]-1.6,2.2,sp[2]+6.5]; tgt=[sp[0]-0.8,1.1,sp[2]]; snow([sp[0],1,sp[2]+2],5); }
  if(k===5){ S.uSnow=[SM[0],0,SM[2],1.0]; S.uSnowRot=1.3; S.uSnowSmile=0.6; S.uSnow2=[4.3,0,1.9,0.5]; S.uSnowRot2=1.2; S.uChar=[1.4,0,2.2]; S.uCharRot=1.3; S.uArm=lt>1?2.4:1.4; S.uEye=1;
    cam=L3([1.0,1.6,5.8],[1.6,1.3,4.6],e); tgt=[3.8,0.8,1.8]; snow([3,1,2],4); }
  if(k===6||k===7){ S.uSnow=[SM[0],0,SM[2],1.0]; S.uSnowRot=1.3; S.uSnowSmile=1; S.uSnow2=[4.3,0,1.9,0.5]; S.uSnowRot2=1.2; S.uArmy=[5.4,0,1.2,0.85]; S.uArmyRot=1.25;
    S.uChar=[1.4,0,2.2]; S.uCharRot=1.3; S.uArm=2.6; S.uEye=1;
    if(k===6){ cam=L3([1.4,1.5,5.0],[-0.6,2.6,7.5],ease(cl(lt/3))); tgt=L3([3.8,1.0,1.8],[4.6,1.0,0.8],ease(cl(lt/3))); }
    else { cam=[-0.6,2.6,7.5]; tgt=[4.6,1.0,0.8]; dark=0.2; } snow([3,1,2],6); }
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  if(k===0){ texts.push({text:'IL PUPAZZO DI NEVE',y:250,size:90,color:'#FFFFFF',alpha:cl(lt/0.3)}); texts.push({text:'PARTE 2',y:350,size:80,color:'#FFD23E',scale:pop(lt-0.2)}); }
  if(DAYS[k]){ texts.push({text:'GIORNO',y:215,size:46,color:'#FFD23E',alpha:cl(lt/0.2)}); texts.push({text:DAYS[k],y:330,size:170,color:'#FFFFFF',scale:pop(lt)}); }
  if(SUBS[k]){ const s0=st[k]+0.15, v=vd[k], a=SUBS[k][0].length, b=SUBS[k][1].length, cut=v*a/(a+b);
    const r=t-s0; if(r>=0&&r<cut) texts.push({text:SUBS[k][0],y:1500,size:60,color:'#FFFFFF',alpha:cl(r/0.15)});
    else if(r>=cut) texts.push({text:SUBS[k][1],y:1500,size:60,color:'#FFD23E',alpha:cl((r-cut)/0.15)}); }
  if(k===7&&lt>0.4){ texts.push({text:'CONTINUA...',y:420,size:130,color:'#39FF6A',alpha:(Math.floor(lt*8)%7===0&&lt<1.6)?0.3:1});
    texts.push({text:'SCRIVI "CAROTA" NEI COMMENTI PER LA PARTE FINALE',y:1480,size:66,color:'#FFD23E',scale:pop(lt-0.7)}); }
  for(let i=1;i<8;i++){const a=t-st[i]; if(a>=0&&a<0.2) flash=Math.max(flash,0.6*(1-a/0.2));}
  return {S,C:{texts,flash,dark}};
}
(async()=>{
 const times=process.argv[2]?JSON.parse(process.argv[2]):null;
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});
 const p=await b.newPage({viewport:{width:1100,height:2900}});
 p.on('pageerror',e=>console.log('E',e.message));
 await p.goto('file:///tmp/claude-0/r3d/scene17.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`p18_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','video18.mp4']);
 const N=Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress18.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress18.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
