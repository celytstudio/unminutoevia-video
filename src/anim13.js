const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24;
const st=[0,5.2,9.8,15.2,20.8,24.8,31.8,37.2];
const T=41.6;
const vd=[4.4,3.8,4.5,4.9,3.0,6.2,4.3,2.7];
const SUBS=[["MARIO HA PUNTATO LA SUA CATAPULTA SU CASA MIA","COSÌ HO DICHIARATO GUERRA"],
["NE COSTRUISCO UN'ALTRA","GRANDE COME LA SUA"],
["LUI MI LANCIA UN'ANGURIA","IO GLI RISPONDO CON UN BIDONE"],
["POMODORI, ANGURIE, BIDONI","IL GIARDINO DIVENTA UN CAMPO DI BATTAGLIA"],
["TIRIAMO LA LEVA","NELLO STESSO MOMENTO"],
["I DUE BIDONI SI SCONTRANO A METÀ STRADA","E RICADONO SULLE CATAPULTE. DISTRUTTE"],
["COSÌ ABBIAMO FATTO PACE","E STASERA GRIGLIAMO I POMODORI INSIEME"],null];
const DAYS=[null,"17","18",null,"20",null,null,null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
const A=[-1.3,0,0.2], B=[2.7,0,0.0], SC=1.25;
const tipA=(a)=>[A[0]-Math.cos(a)*1.6*SC, SC*(1+Math.sin(a)*1.6), A[2]];
const tipB=(a)=>[B[0]+Math.cos(a)*1.6*SC, SC*(1+Math.sin(a)*1.6), B[2]];
function state(t){
  const k=seg(t), lt=t-st[k], d=(k<7?st[k+1]:T)-st[k], x=cl(lt/d), e=ease(x);
  const S={uTime:t,uDepth:0.001,uNight:0,uChar:[-2.5,0,2.2],uCharRot:0.5,uArm:0.3,uBob:0,uShovel:0,uKneel:0,uFlash:0,uExc:[0,0,0,0],uExcArm:0,uGeyser:0,uPipeBroken:0,uHatch:0,uGreen:0,uLadder:0,
    uP:new Array(56).fill(0),uPType:4,uEye:0.7,uRocket:[0,0,0,0],uRocketV:0,uFire:0,uTilt:0,uHelm:0,uCola:0,uGeyPos:[0,0,0],
    uTree:[0,0,0,0],uBend:0,uTHStage:0,uLift:0,uHutPos:[100,0,0],uHutRot:0,uHutFly:0,uEyes:[3.9,1.75,2.2,1],uDArm:0,uRobe:1,
    uCat:[A[0],0,A[2],SC],uCatA:-0.4,uCatBig:1,uCatFlip:0,uProj:[0,0,0,0],uProjT:0,
    uCat2:[B[0],0,B[2],SC],uCatA2:-0.4,uCatBig2:1,uCatFlip2:1,uProj2:[0,0,0,0],uProjT2:0};
  let cam=[0.7,5.0,16], tgt=[0.7,2.0,0], shake=0;
  const pop=(a)=>{const p=cl(a/0.25);return p<0.7?lerp(0.3,1.12,p/0.7):lerp(1.12,1,(p-0.7)/0.3);};
  const texts=[]; let flash=0, dark=0;
  const splat=(c,t0,col)=>{const a=lt-t0; if(a<0||a>0.9) return; S.uPType=col; for(let i=0;i<14;i++){const th=rnd(i+Math.floor(t0*10))*6.283; S.uP[i*4]=c[0]+Math.cos(th)*1.6*a; S.uP[i*4+1]=c[1]+Math.abs(Math.sin(th))*2*a-3*a*a; S.uP[i*4+2]=c[2]+0.4*a; S.uP[i*4+3]=0.09;}};
  // generic throw: side 'A' or 'B', at time t0, type, target point
  const shot=(side,t0,type,target,dur)=>{ const a=lt-t0; const key=side==='A'?'uCatA':'uCatA2';
    if(a>=0&&a<0.3) S[key]=lerp(-0.4,1.6,a/0.3); else if(a>=0.3&&a<1.4) S[key]=lerp(1.6,-0.4,(a-0.3)/1.1);
    const tp=side==='A'?tipA(1.6):tipB(1.6); const pk=side==='A'?'uProj':'uProj2', tk=side==='A'?'uProjT':'uProjT2'; const r=type===0?0.2:(type===1?0.4:0.45);
    if(a<0&&a>-1.2){ const rt=side==='A'?tipA(-0.4):tipB(-0.4); S[pk]=[rt[0],rt[1]+r+0.1,rt[2],r]; S[tk]=type; }
    else if(a>=0&&a<0.3){ const ang=lerp(-0.4,1.6,a/0.3); const rt=side==='A'?tipA(ang):tipB(ang); S[pk]=[rt[0],rt[1]+r,rt[2],r]; S[tk]=type; }
    else if(a>=0.3&&a<0.3+dur){ const u=(a-0.3)/dur; S[pk]=[lerp(tp[0],target[0],u), lerp(tp[1],target[1],u)+5*Math.sin(u*3.14), lerp(tp[2],target[2],u), r]; S[tk]=type; }
    if(a>=0.3+dur){ splat(target,t0+0.3+dur,type===2?0:4); if(a<0.3+dur+0.4) shake=Math.max(shake,0.05); } };
  if(k===0){ shot('B',0.4,1,[-2.5,1.0,2.2],1.0); shot('A',1.6,2,[3.9,1.1,2.2],1.0); S.uArm=lt>1.4?2.6:1.2; S.uEye=1; S.uDArm=2;
    cam=L3([0.7,4.0,13],[0.7,5.0,16],e); }
  if(k===1){ S.uCat[3]=lerp(0.2,SC,ease(cl(lt/3.5))); S.uChar=[-3.4,0,1.4]; S.uCharRot=1.0; S.uArm=1.4+1.0*Math.abs(Math.sin(t*9)); S.uEye=0.9;
    if(Math.sin(t*9)>0.95) S.uFlash=1; cam=[-1.8,2.6,9]; tgt=[-1.8,1.5,0]; }
  if(k===2){ shot('B',0.6,1,[-2.5,1.0,2.2],1.0); shot('A',2.4,2,[3.9,1.1,2.2],1.0); if(lt>1.9&&lt<2.8){S.uEye=0.05;S.uBob=-0.3;} else S.uEye=1; S.uArm=lt>2.4?2.6:1.0; S.uDArm=lt>3.7?1:2; }
  if(k===3){ const tA=[0.2,1.6,3.0,4.4], tB=[0.9,2.3,3.7]; for(let i=0;i<tA.length;i++) if(lt>=tA[i]-1.2&&lt<tA[i]+2.4&&(i===tA.length-1||lt<tA[i+1]-1.2)) shot('A',tA[i],[0,2,1,0][i],[3.6+0.5*rnd(i),1.0,2.0],0.9);
    for(let i=0;i<tB.length;i++) if(lt>=tB[i]-1.2&&lt<tB[i]+2.4&&(i===tB.length-1||lt<tB[i+1]-1.2)) shot('B',tB[i],[1,0,2][i],[-2.3-0.5*rnd(i+5),1.0,2.0],0.9);
    S.uArm=2.4+0.3*Math.sin(t*8); S.uDArm=2; S.uEye=1; shake=Math.max(shake,0.02); cam=L3([0.7,5.0,16],[0.7,4.2,13.5],e); }
  if(k===4){ const f=cl((lt-2.3)/0.3); S.uCatA=lerp(-0.4,1.6,f); S.uCatA2=S.uCatA; const r=0.45;
    if(f<1){ const ta=tipA(S.uCatA), tb=tipB(S.uCatA2); S.uProj=[ta[0],ta[1]+r,ta[2],r]; S.uProjT=2; S.uProj2=[tb[0],tb[1]+r,tb[2],r]; S.uProjT2=2; }
    S.uArm=lt<2.3?1.2:2.6; S.uDArm=lt<2.3?1:2; S.uEye=1;
    cam=L3([0.7,2.6,9],[0.7,5.0,16],ease(cl(lt/2.3))); tgt=[0.7,2.0,0];
    if(lt<2.3) texts.push({text:['3','2','1'][Math.min(2,Math.floor(lt/0.77))],y:620,size:160,color:'#FF3B30',scale:pop(lt%0.77)}); }
  if(k===5){ const r=0.45, ta=tipA(1.6), tb=tipB(1.6), M=[0.7,6.0,0.1];
    if(lt<0.7){ const u=lt/0.7; S.uProj=[lerp(ta[0],M[0]-0.45,u),lerp(ta[1],M[1],Math.sin(u*1.57)),lerp(ta[2],M[2],u),r]; S.uProjT=2; S.uProj2=[lerp(tb[0],M[0]+0.45,u),lerp(tb[1],M[1],Math.sin(u*1.57)),lerp(tb[2],M[2],u),r]; S.uProjT2=2; }
    else if(lt<1.8){ const u=(lt-0.7)/1.1; S.uProj=[lerp(M[0]-0.5,A[0],u),lerp(M[1],1.4,u*u),A[2],r]; S.uProjT=2; S.uProj2=[lerp(M[0]+0.5,B[0],u),lerp(M[1],1.4,u*u),B[2],r]; S.uProjT2=2; }
    if(lt>=0.7&&lt<1.0) flash=Math.max(flash,0.8*(1-(lt-0.7)/0.3));
    if(lt>=0.7&&lt<1.5) texts.push({text:'BOOM!',y:520,size:170,color:'#FF8A00',scale:pop(lt-0.7)});
    if(lt>=1.8){ S.uCat[3]=0; S.uCat2[3]=0; S.uPType=0; const a=lt-1.8; if(a<1.2){ for(let i=0;i<14;i++){const c=i<7?A:B; const th=rnd(i)*3.14; S.uP[i*4]=c[0]+Math.cos(th)*2.2*a; S.uP[i*4+1]=0.6+Math.sin(th)*4*a-5*a*a; S.uP[i*4+2]=c[2]+(rnd(i+3)-0.5)*a*2; S.uP[i*4+3]=0.16;} }
      S.uProj=[A[0],0.35,A[2]+0.6,0.45]; S.uProjT=2; S.uProj2=[B[0],0.35,B[2]+0.6,0.45]; S.uProjT2=2; S.uEye=1; S.uArm=2.6; }
    if(lt>=1.8&&lt<2.4) shake=0.09; if(lt>2.6) texts.push({text:'CRASH!',y:520,size:140,color:'#FF3B30',scale:pop(lt-2.6)});
    cam=[0.7,5.0,16.5]; tgt=[0.7,lt<1.8?4.0:2.0,0]; }
  if(k===6||k===7){ S.uCat[3]=0; S.uCat2[3]=0; S.uNight=0.35; S.uChar=[0.0,0,1.4]; S.uCharRot=0.6; S.uArm=k===7?2.6:1.0; S.uEye=0.6; S.uEyes=[1.6,1.75,1.3,1]; S.uDArm=2;
    S.uProj=[0.8,1.15,2.0,0.14]; S.uProjT=0;
    if(k===6){ cam=L3([0.8,1.9,7.5],[0.8,1.8,6.2],e); tgt=[0.8,1.2,0.5]; }
    else { cam=L3([0.8,1.8,6.2],[0.8,4.5,14],ease(cl(lt/3))); tgt=[0.8,1.6,0.5]; dark=0.15; } }
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  if(k===0){ texts.push({text:'LA CATAPULTA',y:250,size:100,color:'#FFFFFF',alpha:cl(lt/0.3)}); texts.push({text:'FINALE',y:360,size:90,color:'#FF3B30',scale:pop(lt-0.2)}); }
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
 await p.goto('file:///tmp/claude-0/r3d/scene13.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`p13_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','video13.mp4']);
 const N=Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress13.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress13.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
