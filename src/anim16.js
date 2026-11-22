const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24;
const st=[0,5.4,10.6,15.0,18.6,23.0,27.6,31.6];
const T=36.0;
const vd=[4.7,4.6,3.6,2.7,3.6,3.8,3.0,2.6];
const SUBS=[["LA NUVOLA DI MARIO SE NE STAVA ANDANDO","POI È SUCCESSA UNA COSA CHE NESSUNO SI ASPETTAVA"],
["LA NUVOLA DIVENTA GRIGIA","E COMINCIA A PIOVERE"],
["MARIO SCIVOLA GIÙ CON LA PIOGGIA","DRITTO VERSO IL MIO GIARDINO"],
["SPOSTO I TAPPETI","ALL'ULTIMO SECONDO"],
["RIMBALZA UNA, DUE, TRE VOLTE","SEMPRE PIÙ BASSO"],
["E ATTERRA TRA LE MIE BRACCIA","BAGNATO. MA SORRIDENTE"],
["IL TAPPETO ELASTICO ADESSO È IN GARAGE","CHIUSO A CHIAVE"],null];
const DAYS=[null,"14",null,null,null,null,null,null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
const TP=[1.0,0,0.3], CL=[3.2,13.0,0.0], CS=1.3;
const MTOP=CL[1]+1.0*CS;
function state(t){
  const k=seg(t), lt=t-st[k], d=(k<7?st[k+1]:T)-st[k], x=cl(lt/d), e=ease(x);
  const S={uTime:t,uDepth:0.001,uNight:0,uChar:[-0.6,0,1.6],uCharRot:0.4,uArm:0.3,uBob:0,uShovel:0,uKneel:0,uFlash:0,uExc:[0,0,0,0],uExcArm:0,uGeyser:0,uPipeBroken:0,uHatch:0,uGreen:0,uLadder:0,
    uP:new Array(56).fill(0),uPType:1,uEye:0.7,uRocket:[0,0,0,0],uRocketV:0,uFire:0,uTilt:0,uHelm:0,uCola:0,uGeyPos:[0,0,0],
    uTree:[0,0,0,0],uBend:0,uTHStage:0,uLift:0,uHutPos:[100,0,0],uHutRot:0,uHutFly:0,uEyes:[0,0,0,0],uDArm:0,uRobe:1,
    uCat:[0,0,0,0],uCatA:0,uCatBig:0,uCatFlip:0,uProj:[0,0,0,0],uProjT:0,
    uCat2:[0,0,0,0],uCatA2:0,uCatBig2:0,uCatFlip2:0,uProj2:[0,0,0,0],uProjT2:0,
    uTramp:[TP[0],0,TP[2],1.0],uTramp2:2,uTrampDip:0,uCloud:[CL[0],CL[1],CL[2],CS]};
  let cam=[0.4,2.2,17], tgt=[2.0,8,0], shake=0;
  const pop=(a)=>{const p=cl(a/0.25);return p<0.7?lerp(0.3,1.12,p/0.7):lerp(1.12,1,(p-0.7)/0.3);};
  const texts=[]; let flash=0, dark=0;
  const top=()=>S.uTramp[3]*(0.7+0.75*S.uTramp2);
  const rain=(cx,cy,cz,span,hgt)=>{ S.uPType=1; for(let i=0;i<14;i++){ const ph=(t*1.6+rnd(i))%1; S.uP[i*4]=cx+(rnd(i+20)-0.5)*span; S.uP[i*4+1]=cy-ph*hgt; S.uP[i*4+2]=cz+(rnd(i+40)-0.3)*2; S.uP[i*4+3]=0.07; } };
  const marioCloud=()=>{ S.uEyes=[S.uCloud[0],MTOP+1.55,CL[2]+0.3,1]; };
  if(k===0){ S.uNight=lerp(0,0.5,cl((lt-1.5)/2)); marioCloud(); S.uDArm=2; S.uChar=[-0.4,0,1.8]; S.uArm=2.6; S.uEye=1;
    cam=[0.4,2.2,17]; tgt=[2.2,8.6,0]; if(lt>3.0&&lt<3.15) flash=0.9; if(lt>3.4) rain(CL[0],CL[1]-1,0.5,4,10); }
  if(k===1){ S.uNight=0.5; marioCloud(); S.uDArm=lt>2?0:1; rain(CL[0],CL[1]-0.6,0.5,3.5,6);
    cam=L3([1.4,MTOP+1.2,9],[1.8,MTOP+0.6,7.5],e); tgt=[CL[0],MTOP-0.2,0]; if(lt>1.0&&lt<1.12) flash=0.8; }
  if(k===2){ S.uNight=0.45; const my=MTOP+1.55-lerp(0,10,e*e); const mx=lerp(CL[0],TP[0],e); S.uEyes=[mx,my,0.3,1]; S.uDArm=2; rain(mx,my+3,0.5,4,7);
    cam=[mx-1.2,my+0.6,8]; tgt=[mx,my-0.3,0]; if(lt>2.4) texts.push({text:'AAAH!',y:560,size:130,color:'#FF3B30',scale:pop(lt-2.4)}); }
  if(k===3){ S.uNight=0.4; const f=ease(cl(lt/1.8)); S.uTramp=[lerp(-1.8,TP[0],f),0,TP[2],1.0]; S.uChar=[S.uTramp[0]-1.5,0,TP[2]+0.2]; S.uCharRot=1.5; S.uArm=1.6; S.uEye=1; S.uBob=0.1*Math.sin(t*14);
    const my=lerp(9,4.5,cl(lt/3.6)); S.uEyes=[TP[0],my,0.3,1]; S.uDArm=2; rain(0.5,8,0.6,6,8);
    cam=[0.2,3.0,12.5]; tgt=[0.2,3.2,0]; }
  if(k===4){ S.uNight=0.3; const tp=top(); const hs=[3.5,1.8,0.7]; let h=0, dt=lt-0.2; const P=[1.4,1.0,0.65];
    if(dt<0){ h=lerp(2.5,0,(dt+0.2)/0.2); } else { let acc=0; for(let i=0;i<3;i++){ if(dt<acc+P[i]){ const u=(dt-acc)/P[i]; h=hs[i]*4*u*(1-u); break;} acc+=P[i]; if(i===2) h=0; } }
    S.uTrampDip=h<0.25?0.4:0; S.uEyes=[TP[0],tp+h+1.7,0.3,1]; S.uDArm=2; S.uChar=[-0.8,0,1.6]; S.uCharRot=0.5; S.uArm=1.6+0.8*Math.sin(t*6); S.uEye=1;
    rain(0.8,8,0.6,6,8); cam=[0.4,2.8,11.5]; tgt=[0.6,2.6,0];
    const cnt=dt<0?0:(dt<1.4?1:(dt<2.4?2:3)); if(cnt>0) texts.push({text:String(cnt),y:560,size:150,color:'#39C6FF',scale:pop((dt-[0,0,1.4,2.4][cnt]))}); }
  if(k===5){ S.uNight=lerp(0.3,0,e); const tp=top(); const f=ease(cl(lt/0.9)); const G=[-0.8,0,1.6];
    S.uEyes=[lerp(TP[0],G[0]+0.7,f), lerp(tp+1.7,1.75+0.7,f)+1.4*Math.sin(f*3.14), lerp(0.3,G[2]+0.45,f),1]; S.uDArm=f>=1?2:1;
    S.uChar=G; S.uCharRot=0.3; S.uArm=2.6; S.uEye=1; S.uBob=f>=1?-0.15:0; cam=L3([0.4,2.4,10],[-0.2,2.2,7.5],e); tgt=[-0.4,1.8,0.8];
    if(lt>1.0) texts.push({text:'SALVO!',y:560,size:140,color:'#39FF6A',scale:pop(lt-1.0)}); }
  if(k===6||k===7){ S.uTramp=[0,0,0,0]; S.uCloud=[8,13,-3,CS]; S.uChar=[-0.4,0,1.6]; S.uCharRot=0.3; S.uArm=k===7?2.6:1.0; S.uEye=0.7; S.uEyes=[1.0,1.75,1.5,1]; S.uDArm=2;
    if(k===6){ cam=L3([0.3,2.0,8.5],[0.3,1.9,7.5],e); tgt=[0.3,1.3,0.5]; } else { cam=L3([0.3,1.9,7.5],[0.3,4.0,13],ease(cl(lt/3))); tgt=[0.3,1.6,0.5]; dark=0.1; } }
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  if(k===0){ texts.push({text:'IL TAPPETO ELASTICO',y:250,size:90,color:'#FFFFFF',alpha:cl(lt/0.3)}); texts.push({text:'FINALE',y:350,size:90,color:'#FF3B30',scale:pop(lt-0.2)}); }
  if(DAYS[k]){ texts.push({text:'GIORNO',y:215,size:46,color:'#FFD23E',alpha:cl(lt/0.2)}); texts.push({text:DAYS[k],y:330,size:170,color:'#FFFFFF',scale:pop(lt)}); }
  if(SUBS[k]){ const s0=st[k]+0.15, v=vd[k], a=SUBS[k][0].length, b=SUBS[k][1].length, cut=v*a/(a+b);
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
 await p.goto('file:///tmp/claude-0/r3d/scene15.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`p16_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','video16.mp4']);
 const N=Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress16.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress16.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
