export type Vec={x:number;y:number};
export function damp(position:number,velocity:number,target:number,dt:number,omega=12){
 const step=Math.min(Math.max(dt,0),.05),delta=position-target,term=(velocity+omega*delta)*step,e=Math.exp(-omega*step);
 return {position:target+(delta+term)*e,velocity:(velocity-omega*term)*e};
}
const smooth=(n:number)=>{const t=Math.min(1,Math.max(0,n));return t*t*(3-2*t)};
const mix=(a:number,b:number,t:number)=>a+(b-a)*smooth(t);
export function examPose(time:number){
 const t=((time%12)+12)%12;
 if(t<2)return {x:mix(410,234,t/2),y:mix(258,357,t/2),contact:smooth((t-.9)/1.1)};
 if(t<5.3)return {x:234+Math.sin((t-2)*.7)*3,y:357+Math.sin((t-2)*.8)*2,contact:1};
 if(t<7)return {x:mix(236,280,(t-5.3)/1.7),y:mix(358,401,(t-5.3)/1.7),contact:1};
 if(t<9.4)return {x:280+Math.sin((t-7)*.7)*2,y:401,contact:1};
 return {x:mix(281,410,(t-9.4)/2.6),y:mix(401,258,(t-9.4)/2.6),contact:1-smooth((t-9.4)/1.3)};
}
export function deformPuppy(x:number,y:number,time:number,probe:Vec,contact:number,motion=true):Vec{
 if(!motion)return {x,y};
 const body=Math.exp(-Math.pow((x-250)/130,2)-Math.pow((y-390)/145,2))*smooth((y-240)/40)*(1-smooth((y-470)/50));
 const breathe=Math.sin(time*1.7)*2.8;
 const dx=x-probe.x,dy=y-probe.y,press=Math.exp(-(dx*dx+dy*dy)/1900)*contact*smooth((y-240)/25)*(1-smooth((y-495)/25));
 // Actual texture compression beneath the chestpiece; the face and paws stay stable.
 return {x:x+(x-250)/85*breathe*body-dx*.115*press,y:y-breathe*.55*body-dy*.115*press+3.5*press};
}
