const { chromium } = require('playwright');const fs=require('fs');const {spawn}=require('child_process');
const FPS=24;
const st=[0,4.8,8.6,12.2,15.8,19.0,23.6,27.6];
const T=33.2;
const vd=[3.8,2.6,2.5,2.5,2.1,3.6,2.9,2.7];
const SUBS=[["PARTE 4: IL FINALE","DOVE PORTA IL TUNNEL DI MARIO?"],
["LO SEGUIAMO","100 METRI DI LAMPADINE"],
["IN FONDO C'È UNA PORTA","LA APRO"],
["È LA MIA CANTINA","SOTTO CASA MIA"],
["E C'È UN CAVO","COLLEGATO AL MIO ROUTER"],
["MARIO SORRIDE E DICE:","\"IL TUO WIFI PRENDE BENISSIMO\""],
["VENT'ANNI DI INTERNET GRATIS","A SPESE MIE"],null];
const DAYS=[null,"00:23","00:30","00:31","00:32","00:32","00:33",null];
const lerp=(a,b,x)=>a+(b-a)*x, cl=x=>Math.max(0,Math.min(1,x)), ease=x=>x*x*(3-2*x);
const L3=(a,b,x)=>[0,1,2].map(i=>lerp(a[i],b[i],x));
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function seg(t){let k=0;for(let i=0;i<st.length;i++) if(t>=st[i]) k=i; return k;}
function state(t){
  const k=seg(t), lt=t-st[k], d=(k<7?st[k+1]:T)-st[k], x=cl(lt/d), e=ease(x);
  const FY=-11.4;
  const S={uTime:t,uDepth:5.2,uNight:1,uChar:[0.6,-11.3,-0.7],uCharRot:0.5,uArm:0.3,uBob:0,uShovel:0,uKneel:0,uFlash:0,uExc:[0,0,0,0],uExcArm:0,uGeyser:0,uPipeBroken:1,uHatch:1,uHatchOpen:1,uGreen:1.4+0.2*Math.sin(t*4),uLadder:1,uLadder2:1,uShaft:1,uWheel:2.8,uGreenPos:[1.0,-11.6,-1.0],
    uP:new Array(56).fill(0),uPType:1,uEye:1,uEyes:[2.5,-10.3,-1.6,1],uDArm:1,uTunnel:1,uRocket:[0,0,0,0],uRocketV:1,uFire:0,uTilt:0,uGinoIn:0,uCellar:1,uDoor:0};
  let cam=[3.0,-9.9,6.5], tgt=[4.5,-10.6,-1.1], shake=0;
  const pop=(a)=>{const p=cl(a/0.25);return p<0.7?lerp(0.3,1.12,p/0.7):lerp(1.12,1,(p-0.7)/0.3);};
  const texts=[]; let flash=0, dark=0;
  const walk=(gx,mx)=>{ S.uChar=[gx,FY+0.02*Math.abs(Math.sin(t*8)),-0.9]; S.uCharRot=-0.8; S.uBob=0.05; S.uArm=0.4+0.3*Math.sin(t*8);
    S.uEyes=[mx,FY+1.75+0.03*Math.abs(Math.sin(t*8+1)),-1.4,1]; S.uDArm=0.3; };
  if(k===0){ S.uDArm=1; cam=L3([2.0,-9.9,6.0],[5.4,-10.0,6.0],e); tgt=L3([2.2,-10.6,-1.3],[7.0,-10.6,-1.1],e); }
  if(k===1){ walk(lerp(5.2,8.0,x),lerp(6.0,8.8,x)); cam=[lerp(5.5,8.2,x),-9.9,4.8]; tgt=[lerp(6.6,9.2,x),-10.7,-1.1]; }
  if(k===2){ walk(8.6,9.1); S.uChar=[8.6,FY,-0.9]; S.uArm=lt>1.0?1.4:0.4; S.uDoor=ease(cl((lt-1.4)/0.8)); cam=L3([7.4,-10.0,3.8],[7.8,-10.0,3.4],e); tgt=[9.4,-10.7,-1.0]; }
  if(k===3){ S.uDoor=1; S.uChar=[lerp(9.2,10.6,ease(cl(lt/1.5))),FY,-0.8]; S.uCharRot=-0.6; S.uArm=2.5; S.uEye=1; S.uEyes=[9.0,FY+1.75,-1.4,1]; S.uDArm=0;
    cam=L3([10.6,-9.6,5.5],[11.0,-9.5,6.2],e); tgt=[11.6,-10.2,-1.4]; flash=lt<0.3?0.5:0; }
  if(k===4){ S.uDoor=1; S.uChar=[11.3,FY,-0.8]; S.uCharRot=-0.2; S.uArm=1.2; S.uEye=1; S.uEyes=[9.6,FY+1.75,-1.4,1];
    cam=L3([12.0,-9.6,1.2],[12.2,-9.7,0.8],e); tgt=[12.3,-9.95,-2.3]; }
  if(k===5){ S.uDoor=1; S.uChar=[11.3,FY,-0.8]; S.uCharRot=0.6; S.uArm=0.4; S.uEye=1; S.uEyes=[10.2,FY+1.75,-1.4,1]; S.uDArm=lt>0.8?2:1;
    cam=L3([10.4,-10.0,3.2],[10.3,-10.0,2.8],e); tgt=[10.3,-10.2,-1.3]; }
  if(k===6){ S.uDoor=1; S.uChar=[11.3,FY,-0.8]; S.uCharRot=0.3; S.uArm=lerp(0.3,1.5,cl(lt/0.6)); S.uBob=0.15; S.uEye=0.4; S.uEyes=[10.2,FY+1.75,-1.4,1]; S.uDArm=0.6;
    cam=L3([11.4,-9.9,3.2],[11.4,-9.9,2.8],e); tgt=[11.2,-10.2,-0.9]; }
  if(k===7){ S.uDoor=1; S.uChar=[11.3,FY,-0.8]; S.uCharRot=0.3; S.uArm=0.3; S.uEyes=[10.2,FY+1.75,-1.4,1]; S.uDArm=2;
    cam=L3([11.0,-9.7,5.0],[10.0,-9.4,8.5],e); tgt=[10.8,-10.2,-1.4]; }
  if(shake){cam=cam.map((v,i)=>v+(rnd(Math.floor(t*30)+i*7)-0.5)*shake*2);}
  S.uCamPos=cam; S.uCamTgt=tgt;
  if(k===0){ texts.push({text:'PARTE 4',y:300,size:150,color:'#39FF6A',scale:pop(lt)}); if(lt>0.8) texts.push({text:'IL FINALE DELLA BUCA',y:470,size:72,color:'#FFFFFF',alpha:cl((lt-0.8)/0.3)}); }
  if(DAYS[k]){ texts.push({text:'ORE',y:215,size:46,color:'#FFD23E',alpha:cl(lt/0.2)}); texts.push({text:DAYS[k],y:330,size:150,color:'#FFFFFF',scale:pop(lt)}); }
  if(k===4&&lt>0.4) texts.push({text:'WIFI DI GINO',y:700,size:84,color:'#39FF6A',scale:pop(lt-0.4)});
  if(SUBS[k]){ const s0=st[k]+0.15, v=vd[k], a=SUBS[k][0].length, b=SUBS[k][1].length, cut=v*a/(a+b);
    const r=t-s0; if(r>=0&&r<cut) texts.push({text:SUBS[k][0],y:1500,size:60,color:'#FFFFFF',alpha:cl(r/0.15)});
    else if(r>=cut) texts.push({text:SUBS[k][1],y:1500,size:60,color:'#FFD23E',alpha:cl((r-cut)/0.15)}); }
  if(k===7){ texts.push({text:'FINE',y:420,size:170,color:'#39FF6A',scale:pop(lt)}); if(lt>1.0) texts.push({text:'SEGUICI PER LA PROSSIMA STORIA',y:1480,size:68,color:'#FFD23E',scale:pop(lt-1.0)}); }
  for(let i=1;i<8;i++){const a=t-st[i]; if(a>=0&&a<0.2) flash=Math.max(flash,0.6*(1-a/0.2));}
  return {S,C:{texts,flash,dark}};
}
(async()=>{
 const times=process.argv[2]?JSON.parse(process.argv[2]):null;
 const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--allow-file-access-from-files']});
 const p=await b.newPage({viewport:{width:1100,height:2900}});
 p.on('pageerror',e=>console.log('E',e.message));
 await p.goto('file:///tmp/claude-0/r3d/scene10.html'); await p.waitForFunction(()=>window.ready,{timeout:60000});
 if(times){ for(const t of times){const {S,C}=state(t); const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]); fs.writeFileSync(`p10_${t}.jpg`,Buffer.from(d.split(',')[1],'base64'));} await b.close(); return; }
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p','video10.mp4']);
 const N=Math.round(T*FPS); const t0=Date.now();
 for(let i=0;i<N;i++){ const t=i/FPS; const {S,C}=state(t);
   const d=await p.evaluate(([S,C])=>{renderGL(S);return compose(C)},[S,C]);
   const ok=ff.stdin.write(Buffer.from(d.split(',')[1],'base64')); if(!ok) await new Promise(r=>ff.stdin.once('drain',r));
   if(i%48===0) fs.writeFileSync('progress10.txt',`${i}/${N} ${((Date.now()-t0)/1000).toFixed(0)}s`);
 }
 ff.stdin.end(); await new Promise(r=>ff.on('close',r)); fs.writeFileSync('progress10.txt','DONE '+((Date.now()-t0)/1000).toFixed(0)+'s');
 await b.close();
})();
