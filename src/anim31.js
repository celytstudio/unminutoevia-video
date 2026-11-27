const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24;
const st=[0,4.1,7.6,11.5,15.5,18.9,23.4];
const T=27.6;
const vd=[3.0,2.5,2.9,3.0,2.4,3.5,2.4];
const SUBS=[["IL MIO ROBOT STA INSEGUENDO MARIO","IN TUTTO IL GIARDINO"],
["MARIO SALTA","IL ROBOT SALTA"],
["MARIO SI FERMA","E ANCHE IL ROBOT SI FERMA"],
["MARIO ALZA IL BRACCIO","IL ROBOT ALZA IL BRACCIO"],
["NON LO VUOLE PRENDERE","LO VUOLE COPIARE"],
["POI MARIO INDICA ME","E IL ROBOT SI GIRA VERSO DI ME"],null];
const DAYS=[null,null,null,null,null,null,null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
const RP=[0.2,0,0.0]; const face=(dx,dz)=>Math.atan2(-dx,dz);
function state(t){
  const k=seg(t), lt=t-st[k], d=(k<6?st[k+1]:T)-st[k], x=cl(lt/d), e=ease(x);
  const S={uTime:t,uDepth:0.001,uNight:0,uChar:[-0.8,0,0.8],uCharRot:0.6,uArm:0.3,uBob:0,uShovel:0,uKneel:0,uFlash:0,uExc:[0,0,0,0],uExcArm:0,uGeyser:0,uPipeBroken:0,uHatch:0,uGreen:0,uLadder:0,
    uP:new Array(56).fill(0),uPType:2,uEye:0.7,uRocket:[0,0,0,0],uRocketV:0,uFire:0,uTilt:0,uHelm:0,uCola:0,uGeyPos:[0,0,0],
    uTree:[0,0,0,0],uBend:0,uTHStage:0,uLift:0,uHutPos:[100,0,0],uHutRot:0,uHutFly:0,uEyes:[0,0,0,0],uDArm:0,uRobe:1,
    uCat:[0,0,0,0],uCatA:0,uCatBig:0,uCatFlip:0,uProj:[0,0,0,0],uProjT:0,
    uCat2:[0,0,0,0],uCatA2:0,uCatBig2:0,uCatFlip2:0,uProj2:[0,0,0,0],uProjT2:0,
    uTramp:[0,0,0,0],uTramp2:0,uTrampDip:0,uCloud:[0,0,0,0],
    uSnow:[0,0,0,0],uSnowRot:0,uSnowSmile:0,uSnowG:0,uSnowHead:1,uSnow2:[0,0,0,0],uSnowRot2:0,uArmy:[0,0,0,0],uArmyRot:0,uBall:[0,0,0,0],uBall2:[0,0,0,0],
    uPool:0,uWater:0,uLadderP:0,uTiles:0,uHatchY:-0.4,uFurn:0,uHatchOpen:0,uParty:0,uCake:[0,0,0,0],uPump:[0,0,0,0],uSprout:0,uPDoor:0,uMini:[0,0,0,0],uMiniT:0,uFace:0,uLantern:0,uWink:0,
    uBal:[0,0,0,0],uInflate:0,uFireB:0};
  let cam=[0.4,1.8,7.5], tgt=[0.7,1.0,-0.6], shake=0;
  const pop=(a)=>{const p=cl(a/0.25);return p<0.7?lerp(0.3,1.12,p/0.7):lerp(1.12,1,(p-0.7)/0.3);};
  const texts=[]; let flash=0, dark=0;
  const flame=(c)=>{ S.uPType=2; for(let i=0;i<14;i++){ const ph=(t*1.8+rnd(i))%1; S.uP[i*4]=c[0]+(rnd(i+3)-0.5)*0.12; S.uP[i*4+1]=c[1]+ph*0.5; S.uP[i*4+2]=c[2]+(rnd(i+5)-0.5)*0.12; S.uP[i*4+3]=0.04*(1-ph); } };
  const inBasket=(by,bx,bz)=>{ S.uChar=[bx,by+0.08,bz+0.05]; S.uCharRot=0.2; };
  S.uRobot=[RP[0],0,RP[2],1.0]; S.uRobRot=0.3; S.uRobEye=0; S.uRobArm=0.2; S.uRobBuild=3; S.uBal=[0,0,0,0];
  S.uChar=[-0.85,0,0.25]; S.uCharRot=0.9; S.uArm=0.4; S.uEye=0.8;
  S.uRobEye=2; S.uRobBuild=3; S.uEyes=[1.2,1.55,-0.5,1]; S.uRobe=1; S.uDArm=0.3; S.uChar=[-2.6,0,-2.2]; S.uArm=0.4;
  const jump=(x)=>x>0&&x<0.6?0.55*Math.sin(Math.PI*x/0.6):0;
  const M=[1.2,1.55,-0.5], R=[-0.2,0,0.3];
  if(k===0){ const C=[0.6,0,0.2], a=t*1.7, b2=a-1.5; const mp=[C[0]+1.4*Math.cos(a),0.06*Math.abs(Math.sin(t*14)),C[2]+0.9*Math.sin(a)];
    const rp=[C[0]+1.4*Math.cos(b2),0.04*Math.abs(Math.sin(t*12)),C[2]+0.9*Math.sin(b2)];
    S.uEyes=[mp[0],mp[1]+1.55,mp[2]-0.3,1]; S.uDArm=2; S.uRobot=[rp[0],rp[1],rp[2],1]; S.uRobRot=face(mp[0]-rp[0],mp[2]-rp[2]); S.uRobArm=1.5+0.3*Math.sin(t*10);
    cam=L3([0.6,3.0,6.6],[0.6,2.7,6.0],e); tgt=[0.6,0.5,0.0]; }
  if(k>=1&&k<=4){ S.uEyes=[M[0],M[1],M[2],1]; S.uRobot=[R[0],0,R[2],1]; S.uRobRot=face(1.4,-0.8); S.uRobArm=0.15;
    cam=[0.5,1.6,5.2]; tgt=[0.5,0.7,0.0]; }
  if(k===1){ S.uEyes[1]=M[1]+jump(lt-0.3); S.uRobot[1]=jump(lt-1.3); if(lt>0.3) S.uDArm=lt<0.9?2:0.3; }
  if(k===2){ S.uRobEye=(lt%1.4<0.12)?0:2; cam=L3([0.5,1.6,5.2],[0.5,1.5,4.6],e); }
  if(k===3){ S.uDArm=lt>0.3?2:0.3; S.uRobArm=lt>1.4?lerp(0.15,2.9,ease(cl((lt-1.4)/0.4))):0.15; cam=[0.5,1.5,4.6]; }
  if(k===4){ S.uDArm=2; S.uRobArm=2.9; S.uRobEye=1; cam=L3([0.5,1.5,4.6],[0.3,1.4,3.6],e); tgt=[0.3,0.9,0.0];
    if(lt>1.0) texts.push({text:'COPIA!',y:640,size:140,color:'#39FF6A',scale:pop(lt-1.0)}); }
  if(k>=5){ const tt=t-st[5]; S.uChar=[-1.2,0,0.9]; S.uCharRot=0.6; S.uEyes=[M[0],M[1],M[2],1]; S.uDArm=2;
    const turn=ease(cl((tt-1.6)/0.6)); S.uRobRot=lerp(face(1.4,-0.8),face(-1.0,0.6),turn); S.uRobEye=turn>0.5?2:1; S.uRobArm=lerp(2.9,0.3,turn);
    S.uArm=turn>0.5?2.6:0.6; S.uEye=turn>0.5?1.3:0.8; S.uRobot=[R[0],0,R[2],1];
    cam=[0.2,1.7,5.6]; tgt=[0.1,0.75,0.2]; if(tt>2.2&&tt<2.4) flash=0.5;
    if(k===6){ const g=cl((t-st[6])/2.5); S.uRobot=[lerp(R[0],-0.6,g),0.03*Math.abs(Math.sin(t*7)),lerp(R[2],0.6,g),1]; dark=0.15; } }
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  if(k===0){ texts.push({text:'IL ROBOT 2',y:250,size:100,color:'#FFFFFF',alpha:cl(lt/0.3)}); }
  if(DAYS[k]){ texts.push({text:'GIORNO',y:215,size:46,color:'#FFD23E',alpha:cl(lt/0.2)}); texts.push({text:DAYS[k],y:330,size:170,color:'#FFFFFF',scale:pop(lt)}); }
  if(SUBS[k]){ const s0=st[k]+0.15, v=vd[k], a=SUBS[k][0].length, b=Math.max(1,SUBS[k][1].length), cut=SUBS[k][1]?v*a/(a+b):99;
    const r=t-s0; if(r>=0&&r<cut) texts.push({text:SUBS[k][0],y:1500,size:60,color:'#FFFFFF',alpha:cl(r/0.15)});
    else if(r>=cut) texts.push({text:SUBS[k][1],y:1500,size:60,color:'#FFD23E',alpha:cl((r-cut)/0.15)}); }
  if(k===6&&lt>0.4){ texts.push({text:'CONTINUA...',y:420,size:130,color:'#39FF6A',alpha:(Math.floor(lt*8)%7===0&&lt<1.6)?0.3:1});
    texts.push({text:'SCRIVI "COPIA" NEI COMMENTI PER IL FINALE',y:1480,size:66,color:'#FFD23E',scale:pop(lt-0.7)}); }
  for(let i=1;i<7;i++){const a=t-st[i]; if(a>=0&&a<0.2) flash=Math.max(flash,0.6*(1-a/0.2));}
  return {S,C:{texts,flash,dark}};
}
(async()=>{
 const times=process.argv[2]?JSON.parse(process.argv[2]):null;
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});
 const p=await b.newPage({viewport:{width:1100,height:2900}});
 p.on('pageerror',e=>console.log('E',e.message));
 await p.goto('file:///tmp/claude-0/r3d/scene27.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`p31_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','video31.mp4']);
 const N=Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress31.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress31.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
