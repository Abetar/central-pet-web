"use client";
import { useEffect, useRef } from "react";
import {createFurField,stepFur,sampleFur} from "@/lib/furPhysics";

export function Dryer({ className = "" }: { className?: string }) {
 return <svg className={className} viewBox="0 0 240 240" aria-hidden="true"><defs><linearGradient id="dryer-body" x1="0" y1="0" x2=".7" y2="1"><stop stopColor="#ffb8d1"/><stop offset=".4" stopColor="#ed8bb1"/><stop offset="1" stopColor="#be5c89"/></linearGradient><linearGradient id="dryer-handle" x1="0" x2="1"><stop stopColor="#c66791"/><stop offset=".5" stopColor="#ee93b6"/><stop offset="1" stopColor="#e47da6"/></linearGradient><radialGradient id="dryer-shine"><stop stopColor="white" stopOpacity=".7"/><stop offset="1" stopColor="white" stopOpacity="0"/></radialGradient></defs><path d="M92 108 Q87 115 96 138 L122 217 Q128 230 151 219 L158 211 135 123Z" fill="url(#dryer-handle)"/><path d="M39 44 Q16 48 14 84 Q12 119 45 130 Q69 140 110 122 L175 102 215 97 215 54 170 53 106 38 Q68 30 39 44Z" fill="url(#dryer-body)"/><ellipse cx="34" cy="88" rx="15" ry="34" fill="#bb5c89"/><ellipse cx="31" cy="87" rx="9" ry="27" fill="#4c3856"/><path d="M27 68v38m6-44v50" stroke="#dd8bac" strokeWidth="2"/><path d="M206 55Q220 52 220 76Q220 99 207 98Z" fill="#a95980"/><ellipse cx="213" cy="76" rx="6" ry="20" fill="#34314e"/><ellipse cx="88" cy="61" rx="66" ry="17" fill="url(#dryer-shine)" transform="rotate(4 88 61)"/><rect x="127" y="150" width="9" height="23" rx="4" fill="#f7bad0" transform="rotate(-18 127 150)"/><path d="M141 222q12 15 27 17" stroke="#71536b" strokeWidth="4" fill="none"/></svg>;
}

// Prepare the alpha texture once, then reuse it for every animation frame.
export function makeCutout(image: HTMLImageElement, mode: "blue" | "cream" = "blue") {
 const canvas = document.createElement("canvas"); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
 const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
 ctx.drawImage(image, 0, 0);
 const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height), a = pixels.data;
 const w = canvas.width, h = canvas.height, seen = new Uint8Array(w*h), queue = new Int32Array(w*h); let start = 0, end = 0;
 const eligible = (i:number) => { const p=i*4,r=a[p],g=a[p+1],b=a[p+2]; return mode === "blue" ? (b>r*1.08 && g>r*1.08 && b>90) || (r>175 && Math.max(r,g,b)-Math.min(r,g,b)<32) : (r>175 && g>168 && b>152 && Math.max(r,g,b)-Math.min(r,g,b)<49); };
 const add = (i:number) => { if(i>=0 && i<w*h && !seen[i] && eligible(i)){seen[i]=1; queue[end++]=i;} };
 for(let x=0;x<w;x++){add(x);add((h-1)*w+x)}for(let y=0;y<h;y++){add(y*w);add(y*w+w-1)}
 while(start<end){const i=queue[start++];a[i*4+3]=0;const x=i%w;if(x>0)add(i-1);if(x<w-1)add(i+1);add(i-w);add(i+w)}
 // Remove the teal fringe at the photographic silhouette.
 for(let i=0;i<w*h;i++){const p=i*4;if(a[p+3] && a[p+2]>a[p]*1.12 && a[p+1]>a[p]*1.12)a[p+3]=0}
 ctx.putImageData(pixels,0,0); return canvas;
}

export function Cutout({src,className="",alt,mode="blue"}:{src:string;className?:string;alt:string;mode?:"blue"|"cream"}) {
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{const image=new Image();let disposed=false;image.onload=()=>{if(disposed || !ref.current)return;const c=makeCutout(image,mode);ref.current.width=c.width;ref.current.height=c.height;ref.current.getContext("2d")!.drawImage(c,0,0)};image.src=src;return()=>{disposed=true}},[src,mode]);
 return <canvas className={className} ref={ref} role="img" aria-label={alt}/>;
}

export default function DryingScene() {
 const canvasRef=useRef<HTMLCanvasElement>(null),stageRef=useRef<HTMLDivElement>(null),dryerRef=useRef<HTMLDivElement>(null);
 const point=useRef({x:265,y:360,active:false}),enabled=useRef(true);
 useEffect(()=>{
  const canvas=canvasRef.current!,ctx=canvas.getContext("2d")!,stage=stageRef.current!,dryer=dryerRef.current!;
  const ratio=Math.min(window.devicePixelRatio||1,2);canvas.width=630*ratio;canvas.height=700*ratio;ctx.scale(ratio,ratio);
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
  let disposed=false,raf=0,visible=true,texture:HTMLImageElement|null=null,data:Uint8ClampedArray|null=null;
  const left=new Int16Array(630).fill(-1),right=new Int16Array(630).fill(-1);
  const hairs:{x:number;y:number;r:number;g:number;b:number;length:number;phase:number}[]=[];
  const image=new Image();
  image.onload=()=>{
   if(disposed)return;
   const source=makeCutout(image),mask=source.getContext("2d")!.getImageData(0,0,source.width,source.height).data;
   let minX=source.width,minY=source.height,maxX=0,maxY=0;
   for(let y=0;y<source.height;y++)for(let x=0;x<source.width;x++)if(mask[(y*source.width+x)*4+3]>25){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y)}
   const w=maxX-minX+1,h=maxY-minY+1,scale=Math.min(492/w,620/h),dw=w*scale,dh=h*scale;
   const normalized=document.createElement("canvas");normalized.width=1000;normalized.height=1260;
   normalized.getContext("2d")!.drawImage(source,minX,minY,w,h,500-dw,2*(630-dh),dw*2,dh*2);
   const sample=document.createElement("canvas");sample.width=500;sample.height=630;sample.getContext("2d")!.drawImage(normalized,0,0,500,630);
   data=sample.getContext("2d")!.getImageData(0,0,500,630).data;
   for(let y=0;y<630;y++)for(let x=0;x<500;x++)if(data[(y*500+x)*4+3]>210){if(left[y]<0)left[y]=x;right[y]=x}
   for(let y=215;y<550;y+=11)for(let x=30;x<470;x+=11){
    const seed=Math.sin(x*17.13+y*7.17),sx=Math.floor(x+seed*4),sy=Math.floor(y+Math.cos(x*.13)*3),p=(sy*500+sx)*4;
    if(data[p+3]>220)hairs.push({x:sx,y:sy,r:data[p],g:data[p+1],b:data[p+2],length:16+(seed+1)*11,phase:x*.17+y*.11});
   }
   const bitmap=new Image();bitmap.onload=()=>{if(!disposed)texture=bitmap};bitmap.src=normalized.toDataURL("image/png");
  };
  image.src="/assets/hero-cat.webp";
  const observer=new IntersectionObserver(([e])=>{visible=e.isIntersecting},{rootMargin:"80px"});observer.observe(stage);
  const W=630,H=700,sourceX=65,sourceY=26,field=createFurField();
  const current={x:265,y:360,vx:0,vy:0},nozzle={x:135,y:400,vx:0,vy:0};
  let impact={x:200,y:334,side:1,strength:0},last=0,lastInteraction=-100,angle=-.25,intensity=0;
  // Exact critically damped spring: smooth tracking without overshoot, independent of frame rate.
  function follow(position:number,velocity:number,target:number,dt:number,omega=13){
   const delta=position-target,term=(velocity+omega*delta)*dt,e=Math.exp(-omega*dt);
   return {position:target+(delta+term)*e,velocity:(velocity-omega*term)*e};
  }
  function vertex(x:number,y:number){
   const d=sampleFur(field,x,y);return {x:x+sourceX+d.x,y:y+sourceY+d.y};
  }
  function triangle(a:{x:number;y:number},b:{x:number;y:number},c:{x:number;y:number},u:number,v:number,sx:number,sy:number,second:boolean){
   ctx.save();ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.closePath();ctx.clip();
   if(!second)ctx.transform((b.x-a.x)/sx,(b.y-a.y)/sx,(c.x-a.x)/sy,(c.y-a.y)/sy,a.x-u*(b.x-a.x)/sx-v*(c.x-a.x)/sy,a.y-u*(b.y-a.y)/sx-v*(c.y-a.y)/sy);
   else{const ax=(a.x-c.x)/sx,ay=(a.y-c.y)/sx,bx=(a.x-b.x)/sy,by=(a.y-b.y)/sy;ctx.transform(ax,ay,bx,by,a.x-(u+sx)*ax-(v+sy)*bx,a.y-(u+sx)*ay-(v+sy)*by)}
   const x=Math.max(0,u-.5),y=Math.max(0,v-.5),w=Math.min(500-x,sx+1),h=Math.min(630-y,sy+1);
   ctx.drawImage(texture!,x*2,y*2,w*2,h*2,x,y,w,h);ctx.restore();
  }
  function drawHair(time:number){
   for(let i=0;i<hairs.length;i++){
    const hair=hairs[i],dx=(hair.x-impact.x)/72,dy=(hair.y-impact.y)/74,power=Math.exp(-(dx*dx+dy*dy)*1.6)*impact.strength;
    if(power<.05)continue;
    const v=vertex(hair.x,hair.y),flutter=Math.sin(time*17+hair.phase),lift=hair.length*power,bend=(10+hair.length*.28)*power+flutter*3*power;
    if(i%3===0&&power>.2){
     ctx.save();ctx.globalAlpha=power*.65;ctx.translate(v.x,v.y);ctx.rotate(.18*power);
     ctx.beginPath();ctx.moveTo(-5,3);ctx.quadraticCurveTo(-7,-13,-1,-26-lift*.35);ctx.quadraticCurveTo(7,-13,5,3);ctx.closePath();ctx.clip();
     ctx.drawImage(texture!,(hair.x-5)*2,(hair.y-26)*2,20,58,-5,-26-lift*.35,10,29+lift*.35);ctx.restore();
    }
    ctx.save();ctx.globalAlpha=power*.65;ctx.lineCap="round";ctx.lineWidth=1.3;ctx.strokeStyle=`rgb(${hair.r} ${hair.g} ${hair.b})`;
    ctx.beginPath();ctx.moveTo(v.x,v.y+2);ctx.bezierCurveTo(v.x+bend*.15,v.y-lift*.3,v.x+bend*.65,v.y-lift,v.x+bend,v.y-lift+flutter*2*power);ctx.stroke();
    ctx.lineWidth=.6;ctx.strokeStyle=`rgb(${Math.min(255,hair.r+20)} ${Math.min(255,hair.g+16)} ${Math.min(255,hair.b+12)})`;
    ctx.beginPath();ctx.moveTo(v.x+.5,v.y);ctx.quadraticCurveTo(v.x+bend*.5,v.y-lift*.8,v.x+bend+.5,v.y-lift+flutter*2*power);ctx.stroke();ctx.restore();
   }
  }
  function draw(ms:number){
   raf=requestAnimationFrame(draw);
   if(!visible||document.hidden||ms-last<1000/30)return;
   const dt=Math.min(.05,last?(ms-last)/1000:1/30),time=ms/1000;last=ms;
   const active=enabled.current&&!reduced.matches;
   if(point.current.active)lastInteraction=time;
   const mix=point.current.active?0:Math.max(0,Math.min(1,(time-lastInteraction-1.6)/1.8)),blend=mix*mix*(3-2*mix);
   const idleX=265+Math.sin(time*.48)*70,idleY=365+Math.sin(time*.58)*85;
   const tx=active?point.current.x*(1-blend)+idleX*blend:current.x,ty=active?point.current.y*(1-blend)+idleY*blend:current.y;
   const px=follow(current.x,current.vx,tx,dt),py=follow(current.y,current.vy,ty,dt);
   current.x=px.position;current.vx=px.velocity;current.y=py.position;current.vy=py.velocity;
   const localY=Math.max(210,Math.min(545,current.y-sourceY)),row=Math.round(localY);
   const lo=left[row]>=0?left[row]:100,hi=right[row]>=0?right[row]:380;
   const localX=Math.max(lo+8,Math.min(hi-8,current.x-sourceX)),contact=Math.max(0,1-Math.abs(localX+sourceX-current.x)/140);
   const aimX=localX+sourceX,aimY=localY+sourceY;
   const nx=follow(nozzle.x,nozzle.vx,Math.max(125,aimX-128),dt,10),ny=follow(nozzle.y,nozzle.vy,aimY+33,dt,10);
   nozzle.x=nx.position;nozzle.vx=nx.velocity;nozzle.y=ny.position;nozzle.vy=ny.velocity;
   intensity+=((active?contact:0)-intensity)*(1-Math.exp(-9*dt));
   impact={x:localX,y:localY,side:1,strength:intensity};stepFur(field,impact,time);
   ctx.clearRect(0,0,W,H);
   if(texture){
    const moving=intensity>.006||field.y.some(v=>Math.abs(v)>.05);
    if(!moving)ctx.drawImage(texture,sourceX,sourceY,500,630);
    else{
     const step=25;
     for(let y=0;y<630;y+=step)for(let x=0;x<500;x+=step){
      const sx=Math.min(step,500-x),sy=Math.min(step,630-y),a=vertex(x,y),b=vertex(x+sx,y),c=vertex(x,y+sy),d=vertex(x+sx,y+sy);
      const quiet=Math.abs(a.x-x-sourceX)+Math.abs(a.y-y-sourceY)+Math.abs(b.x-x-sx-sourceX)+Math.abs(b.y-y-sourceY)+Math.abs(c.x-x-sourceX)+Math.abs(c.y-y-sy-sourceY)+Math.abs(d.x-x-sx-sourceX)+Math.abs(d.y-y-sy-sourceY)<.12;
      if(quiet)ctx.drawImage(texture,x*2,y*2,sx*2,sy*2,x+sourceX,y+sourceY,sx,sy);
      else{triangle(a,b,c,x,y,sx,sy,false);triangle(d,b,c,x,y,sx,sy,true);}
     }
     drawHair(time);
    }
   }
   const dx=aimX-nozzle.x,dy=aimY-nozzle.y,len=Math.max(1,Math.hypot(dx,dy)),ux=dx/len,uy=dy/len;
   const wantedAngle=Math.atan2(dy,dx);angle+=(wantedAngle-angle)*(1-Math.exp(-10*dt));
   dryer.style.transformOrigin="0 0";
   dryer.style.transform=`translate3d(${nozzle.x/W*100}cqw,${nozzle.y/H*100}cqh,0) rotate(${angle*180/Math.PI}deg) translate(-89.2%,-31.7%)`;
   if(active&&intensity>.03){
    ctx.save();ctx.lineCap="round";
    for(let i=0;i<12;i++){const phase=(time*1.8+i*.17)%1,d=phase*len,spread=Math.sin(i*2.4)*12*(.35+phase),x=nozzle.x+ux*d-uy*spread,y=nozzle.y+uy*d+ux*spread;ctx.strokeStyle=`rgba(255,255,255,${(1-phase)*.28*intensity})`;ctx.lineWidth=.8+(i%3)*.3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+ux*11,y+uy*11);ctx.stroke()}ctx.restore();
   }
  }
  raf=requestAnimationFrame(draw);
  return()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect()};
 },[]);
 const update=(event:React.PointerEvent<HTMLDivElement>)=>{
  if(event.pointerType==="touch"&&event.type==="pointermove"&&event.buttons===0)return;
  const r=event.currentTarget.getBoundingClientRect();
  point.current={x:Math.max(80,Math.min(550,(event.clientX-r.left)/r.width*630)),y:Math.max(220,Math.min(590,(event.clientY-r.top)/r.height*700)),active:true};
 };
 return <div className="drying-wrap">
  <div className="drying-scene" ref={stageRef} onPointerMove={update} onPointerDown={update} onPointerUp={event=>{if(event.pointerType==="touch")point.current.active=false}} onPointerCancel={()=>{point.current.active=false}} onPointerLeave={()=>{point.current.active=false}} aria-label="Demostración de secado suave: recorre el pelaje del gato para ver cómo reacciona al aire.">
   <div className="cat-shadow"/><canvas ref={canvasRef} width="630" height="700" role="img" aria-label="Gato con pelaje que se levanta localmente con el aire"/>
   <div ref={dryerRef} className="interactive-dryer"><Dryer/></div><span className="foam foam-one"/><span className="foam foam-two"/><span className="foam foam-three"/>
  </div>
  <button className="animation-toggle" type="button" onClick={e=>{enabled.current=!enabled.current;e.currentTarget.textContent=enabled.current?"Pausar animación":"Reanudar animación";e.currentTarget.setAttribute("aria-pressed",String(!enabled.current))}} aria-pressed="false">Pausar animación</button>
  <span className="drying-hint">Recorre su pelaje y mira cómo reacciona al aire</span>
 </div>;
}
