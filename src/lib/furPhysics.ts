export type FurField={step:number;cols:number;rows:number;width:number;height:number;x:Float32Array;y:Float32Array;vx:Float32Array;vy:Float32Array};
export type Impact={x:number;y:number;side:number;strength:number};
export function createFurField(width=500,height=630,step=20):FurField{
 const cols=Math.ceil(width/step)+1,rows=Math.ceil(height/step)+1,count=cols*rows;
 return {step,cols,rows,width,height,x:new Float32Array(count),y:new Float32Array(count),vx:new Float32Array(count),vy:new Float32Array(count)};
}
export function stepFur(field:FurField,impact:Impact,time:number){
 for(let row=0;row<field.rows;row++)for(let col=0;col<field.cols;col++){
  const i=row*field.cols+col,x=Math.min(col*field.step,field.width),y=Math.min(row*field.step,field.height);
  const head=Math.max(0,Math.min(1,(y-190)/35)),paws=Math.max(0,Math.min(1,(590-y)/65));
  const dx=(x-impact.x)/72,dy=(y-impact.y)/74;
  const focus=Math.exp(-(dx*dx+dy*dy)*1.6)*head*paws*impact.strength;
  const flutter=Math.sin(time*22+y*.13+x*.045);
  const tx=focus*impact.side*(17+flutter*6),ty=focus*(-30+Math.sin(time*19+x*.06+y*.08)*9);
  field.vx[i]=(field.vx[i]+(tx-field.x[i])*.24)*.71;
  field.vy[i]=(field.vy[i]+(ty-field.y[i])*.24)*.71;
  field.x[i]+=field.vx[i];field.y[i]+=field.vy[i];
 }
}
export function sampleFur(field:FurField,x:number,y:number){
 const col=Math.max(0,Math.min(field.cols-2,Math.floor(x/field.step))),row=Math.max(0,Math.min(field.rows-2,Math.floor(y/field.step)));
 const sx=Math.min(field.step,field.width-col*field.step)||field.step,sy=Math.min(field.step,field.height-row*field.step)||field.step;
 const u=Math.max(0,Math.min(1,(x-col*field.step)/sx)),v=Math.max(0,Math.min(1,(y-row*field.step)/sy)),i=row*field.cols+col;
 const blend=(values:Float32Array)=>(values[i]*(1-u)+values[i+1]*u)*(1-v)+(values[i+field.cols]*(1-u)+values[i+field.cols+1]*u)*v;
 return {x:blend(field.x),y:blend(field.y)};
}
