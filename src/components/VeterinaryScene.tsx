"use client";
import {useEffect,useRef,useState} from "react";
import {Heart,Pause,Play,Plus,ShieldCheck,Hand} from "lucide-react";
import {damp,examPose,deformPuppy} from "../lib/vetMotion";

export default function VeterinaryScene(){
 const canvasRef=useRef<HTMLCanvasElement>(null),stageRef=useRef<HTMLDivElement>(null),scopeRef=useRef<SVGGElement>(null),tubeRef=useRef<SVGPathElement>(null),pulseRef=useRef<HTMLDivElement>(null);
 const pointer=useRef({x:240,y:365,active:false}),playing=useRef(true);
 const [paused,setPaused]=useState(false),[ready,setReady]=useState(false),[failed,setFailed]=useState(false),[reducedMotion,setReducedMotion]=useState(false);
 useEffect(()=>{
  const canvas=canvasRef.current,stage=stageRef.current;if(!canvas||!stage)return;
  const ctx=canvas.getContext("2d");if(!ctx){setFailed(true);return}
  const media=window.matchMedia("(prefers-reduced-motion: reduce)");let reduced=media.matches,visible=true,disposed=false,frame=0,last=0,time=0,texture:HTMLImageElement|null=null;
  const onPreference=()=>{reduced=media.matches;setReducedMotion(reduced);last=0;start()};setReducedMotion(reduced);media.addEventListener("change",onPreference);
  const ratio=Math.min(window.devicePixelRatio||1,1.75);canvas.width=640*ratio;canvas.height=700*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);
  const probe={x:410,y:258,vx:0,vy:0,contact:0};
  function triangle(ax:number,ay:number,bx:number,by:number,cx:number,cy:number,u:number,v:number,w:number,h:number,second:boolean){
   if(!texture)return;ctx!.save();const mx=(ax+bx+cx)/3,my=(ay+by+cy)/3;ctx!.beginPath();ctx!.moveTo(mx+(ax-mx)*1.08,my+(ay-my)*1.08);ctx!.lineTo(mx+(bx-mx)*1.08,my+(by-my)*1.08);ctx!.lineTo(mx+(cx-mx)*1.08,my+(cy-my)*1.08);ctx!.closePath();ctx!.clip();
   if(!second){const a=(bx-ax)/w,b=(by-ay)/w,c=(cx-ax)/h,d=(cy-ay)/h;ctx!.transform(a,b,c,d,ax-u*a-v*c,ay-u*b-v*d)}
   else{const a=(ax-cx)/w,b=(ay-cy)/w,c=(ax-bx)/h,d=(ay-by)/h;ctx!.transform(a,b,c,d,ax-(u+w)*a-(v+h)*c,ay-(u+w)*b-(v+h)*d)}
   const sx=Math.max(0,u-1),sy=Math.max(0,v-1),sw=Math.min(500-sx,w+2),sh=Math.min(620-sy,h+2);ctx!.drawImage(texture,sx*2,sy*2,sw*2,sh*2,sx,sy,sw,sh);ctx!.restore();
  }
  function draw(timestamp:number){
   frame=0;if(disposed||!texture)return;
   if(!playing.current&&!reduced)return;
   const dt=last?Math.min((timestamp-last)/1000,.05):1/60;last=timestamp;
   const moving=playing.current&&!reduced;
   if(moving)time+=dt;
   const pose=pointer.current.active?{x:pointer.current.x,y:pointer.current.y,contact:1}:examPose(time);
   const target=moving?pose:{x:248,y:373,contact:.95};
   const sx=damp(probe.x,probe.vx,target.x,dt),sy=damp(probe.y,probe.vy,target.y,dt);
   probe.x=moving?sx.position:target.x;probe.y=moving?sy.position:target.y;probe.vx=sx.velocity;probe.vy=sy.velocity;probe.contact+=(target.contact-probe.contact)*(1-Math.exp(-dt*9));
   ctx!.clearRect(0,0,640,700);
   const point=(x:number,y:number)=>{const p=deformPuppy(x,y,time,probe,probe.contact,moving);return {x:p.x+70,y:p.y+35}};
   // Keep the head/paws crisp; warp only the chest, using a small cached mesh.
   ctx!.drawImage(texture,0,0,1000,480,70,35,500,240);
   ctx!.drawImage(texture,0,1040,1000,200,70,555,500,100);
   for(let y=240;y<520;y+=28)for(let x=0;x<500;x+=28){
    const w=Math.min(28,500-x),h=Math.min(28,520-y),a=point(x,y),b=point(x+w,y),c=point(x,y+h),d=point(x+w,y+h);
    // Source coordinates are local to the subject; inverse translation belongs in the affine transform.
    triangle(a.x,a.y,b.x,b.y,c.x,c.y,x,y,w,h,false);
    triangle(d.x,d.y,b.x,b.y,c.x,c.y,x,y,w,h,true);
   }
   const px=probe.x+70,py=probe.y+35;
   if(scopeRef.current)scopeRef.current.setAttribute("transform",`translate(${px} ${py}) rotate(${-15+(probe.x-240)*.08})`);
   if(tubeRef.current)tubeRef.current.setAttribute("d",`M 529 127 C 575 225, ${px+130} ${py+120}, ${px+8} ${py+4}`);
   stage!.style.setProperty("--listening",String(probe.contact));
   if(pulseRef.current)pulseRef.current.style.opacity=String(.28+probe.contact*.72);
   if(moving&&visible&&!document.hidden)frame=requestAnimationFrame(draw);
  }
  function start(){if(!disposed&&texture&&!frame){last=0;frame=requestAnimationFrame(draw)}}
  const image=new Image();image.onload=()=>{
   if(disposed)return;
   const source=document.createElement("canvas");source.width=image.naturalWidth;source.height=image.naturalHeight;const context=source.getContext("2d",{willReadFrequently:true});if(!context){setFailed(true);return}context.drawImage(image,0,0);
   const pixels=context.getImageData(0,0,source.width,source.height).data;let minX=source.width,minY=source.height,maxX=0,maxY=0,coreX=0,coreCount=0;
   for(let y=0;y<source.height;y++)for(let x=0;x<source.width;x++)if(pixels[(y*source.width+x)*4+3]>40){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);if(y>source.height*.32&&y<source.height*.52&&pixels[(y*source.width+x)*4+3]>200){coreX+=x;coreCount++}}
   const w=maxX-minX+1,h=maxY-minY+1,scale=Math.min(460/w,600/h),dw=w*scale,dh=h*scale;
   const normalized=document.createElement("canvas");normalized.width=1000;normalized.height=1240;const center=coreCount?coreX/coreCount:minX+w/2;const left=Math.max(0,Math.min(1000-dw*2,500-(center-minX)*scale*2));normalized.getContext("2d")!.drawImage(source,minX,minY,w,h,left,2*(615-dh),dw*2,dh*2);
   const bitmap=new Image();bitmap.onload=()=>{if(disposed)return;texture=bitmap;setReady(true);start()};bitmap.onerror=()=>setFailed(true);bitmap.src=normalized.toDataURL("image/png");
  };image.onerror=()=>setFailed(true);image.src="/assets/vet-puppy.webp";
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)start();else if(frame){cancelAnimationFrame(frame);frame=0}},{rootMargin:"80px"});observer.observe(stage);
  const onVisibility=()=>{if(!document.hidden)start();else if(frame){cancelAnimationFrame(frame);frame=0}};document.addEventListener("visibilitychange",onVisibility);
  const wake=()=>start();stage.addEventListener("pointermove",wake);stage.addEventListener("pointerleave",wake);stage.addEventListener("click",wake);
  return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();media.removeEventListener("change",onPreference);document.removeEventListener("visibilitychange",onVisibility);stage.removeEventListener("pointermove",wake);stage.removeEventListener("pointerleave",wake);stage.removeEventListener("click",wake)};
 },[]);
 return <div className={`vet-scene ${paused||reducedMotion?"is-paused":""}`} ref={stageRef} onPointerMove={event=>{if(event.pointerType==="touch"||!playing.current)return;const box=canvasRef.current?.getBoundingClientRect()||event.currentTarget.getBoundingClientRect();const x=(event.clientX-box.left)/box.width*640-70,y=(event.clientY-box.top)/box.height*700-35;const inside=Math.pow((x-250)/100,2)+Math.pow((y-370)/105,2)<1;pointer.current={x:Math.max(185,Math.min(310,x)),y:Math.max(300,Math.min(445,y)),active:inside}}} onPointerLeave={()=>{pointer.current.active=false}} onPointerCancel={()=>{pointer.current.active=false}}>
  <div className="scene-halo" aria-hidden="true"/><div className="scene-grid" aria-hidden="true"/><span className="scene-plus plus-one" aria-hidden="true"><Plus/></span><span className="scene-plus plus-two" aria-hidden="true"><Plus/></span><div className="scene-ground" aria-hidden="true"/>
  <img className={`puppy-fallback ${ready&&!failed?"is-loaded":""}`} src="/assets/vet-puppy.webp" alt="Perrito golden retriever tranquilo durante una revisión veterinaria ilustrativa" width="1024" height="1536" fetchPriority="high"/>
  <canvas ref={canvasRef} className="puppy-canvas" aria-hidden="true"/>
  <svg className={`scope-layer ${!ready||failed?"not-ready":""}`} viewBox="0 0 640 700" aria-hidden="true"><defs><linearGradient id="scope-metal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fafff4"/><stop offset=".35" stopColor="#98afa5"/><stop offset=".6" stopColor="#eff4eb"/><stop offset="1" stopColor="#6a837a"/></linearGradient><radialGradient id="scope-disc"><stop stopColor="#f7fbf1"/><stop offset="1" stopColor="#d0dccf"/></radialGradient></defs><path ref={tubeRef} d="M529 127 C575 225 450 500 315 412" fill="none" stroke="#12392f" strokeWidth="12" strokeLinecap="round"/><path d="M529 127 L506 105 Q476 78 485 45 M529 127 L551 100 Q572 67 552 38" fill="none" stroke="url(#scope-metal)" strokeWidth="9" strokeLinecap="round"/><path d="M485 45 L481 36 M552 38 L548 29" stroke="#173b32" strokeWidth="16" strokeLinecap="round"/><g ref={scopeRef} transform="translate(304 392) rotate(-15)"><ellipse cx="1" cy="8" rx="31" ry="20" fill="#203e36" opacity=".15"/><path d="M7 0 L23 -19" stroke="url(#scope-metal)" strokeWidth="12" strokeLinecap="round"/><ellipse rx="28" ry="25" fill="#b9cbbd" stroke="#7c9488" strokeWidth="1"/><ellipse cy="-2" rx="22" ry="19" fill="#edf4e5"/><ellipse cy="-2" rx="16" ry="14" fill="none" stroke="#a4b8a6" strokeWidth="1"/><path d="M-5 -2h10M0 -7v10" stroke="#587564" strokeWidth="2" strokeLinecap="round"/></g></svg>
  <div className="scene-badge"><ShieldCheck size={18}/><span>Un pequeño chequeo.<strong>Mucho cariño.</strong></span></div>
  <div className="heartbeat-card" ref={pulseRef}><span className="heartbeat-icon"><Heart size={18}/></span><svg viewBox="0 0 150 42" aria-hidden="true"><path className="pulse-baseline" d="M0 25H30l7-8 8 16 11-28 12 34 8-14h74"/><path className="pulse-line" d="M0 25H30l7-8 8 16 11-28 12 34 8-14h74"/></svg><span>Su bienestar,<br/><strong>en buenas manos.</strong></span></div>
  <div className="scene-controls"><span><Hand size={13}/><span className="desktop-hint">{reducedMotion?"Cuidado en cada detalle":"Acércate a su pecho"}</span><span className="touch-hint">Una visita con mucho cariño</span></span><button type="button" disabled={reducedMotion||!ready||failed} aria-label={reducedMotion?"Animación desactivada por movimiento reducido":paused?"Reanudar animación":"Pausar animación"} aria-pressed={paused} onClick={()=>{playing.current=!playing.current;setPaused(!playing.current)}}>{paused||reducedMotion?<Play size={14}/>:<Pause size={14}/>}</button></div><small className="scene-disclaimer">Animación ilustrativa</small>
 </div>;
}
