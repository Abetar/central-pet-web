import {clinic} from "./veterinary";
import {formatMXN} from "./currency";
export type OrderProduct={name:string;price:number};
export function whatsappUrl(message:string,rawNumber=clinic.whatsapp){
 const number=rawNumber.replace(/\D/g,"");
 return /^[1-9]\d{7,14}$/.test(number)?"https://wa.me/"+number+"?text="+encodeURIComponent(message):null;
}
export function orderMessage(products:readonly OrderProduct[],cart:Record<string,number>){
 const selected=products.filter(p=>Number.isInteger(cart[p.name])&&cart[p.name]>0);
 const money=formatMXN;
 const lines=selected.map(p=>"- "+cart[p.name]+" × "+p.name+" — "+money(p.price)+" c/u · Subtotal: "+money(p.price*cart[p.name]));
 const total=selected.reduce((sum,p)=>sum+p.price*cart[p.name],0);
 return ["¡Hola, "+clinic.name+"! Me gustaría comprar lo siguiente:","",...lines,"","Total de productos: "+money(total),"","¿Me confirman disponibilidad, entrega y forma de pago?"].join("\n");
}
