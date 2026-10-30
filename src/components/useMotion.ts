"use client";
import {useEffect} from "react";
type MotionWindow=Window & {gsap?:{registerPlugin:(plugin:unknown)=>void;fromTo:(target:Element,from:unknown,to:unknown)=>{kill:()=>void};to:(target:Element,to:unknown)=>{kill:()=>void}};ScrollTrigger?:{refresh:()=>void}};
export function useMotion(){useEffect(()=>{
 const reduced=matchMedia("(prefers-reduced-motion: reduce)"); if(reduced.matches)return;
 const animations:Animation[]=[];const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(!e.isIntersecting)return;observer.unobserve(e.target);animations.push(e.target.animate([{opacity:0,transform:"translateY(24px)"},{opacity:1,transform:"translateY(0)"}],{duration:650,easing:"cubic-bezier(.16,1,.3,1)",fill:"both"}))})},{threshold:.12});
 document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
 let cancelled=false;const tweens:{kill:()=>void}[]=[];
 // GSAP's real distribution is copied locally by postinstall. No CDN is needed.
 const load=(src:string)=>new Promise<void>((resolve,reject)=>{const script=document.createElement("script");script.src=src;script.onload=()=>resolve();script.onerror=()=>reject();document.head.appendChild(script)});
 if(process.env.NEXT_PUBLIC_GSAP_AVAILABLE==="true"){void (async()=>{try{await load("/motion/gsap.min.js");await load("/motion/ScrollTrigger.min.js");if(cancelled)return;const win=window as MotionWindow;if(!win.gsap||!win.ScrollTrigger)return;observer.disconnect();animations.forEach(a=>a.cancel());win.gsap.registerPlugin(win.ScrollTrigger);document.querySelectorAll(".reveal").forEach(el=>tweens.push(win.gsap!.fromTo(el,{autoAlpha:0,y:28},{autoAlpha:1,y:0,duration:.75,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 91%",once:true}})));document.querySelectorAll(".scene-badge").forEach(el=>tweens.push(win.gsap!.to(el,{y:-12,ease:"none",scrollTrigger:{trigger:el,scrub:1,start:"top bottom",end:"bottom top"}})));win.ScrollTrigger.refresh()}catch{/* Native entrances remain available when offline. */}})()}
 return()=>{cancelled=true;observer.disconnect();animations.forEach(a=>a.cancel());tweens.forEach(t=>t.kill())}
 },[])}
