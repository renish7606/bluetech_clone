import { useEffect, type PropsWithChildren } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { MotionConfig } from 'framer-motion';
gsap.registerPlugin(ScrollTrigger);
export default function AnimationProvider({children}:PropsWithChildren){useEffect(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const lenis=new Lenis({duration:1.05,smoothWheel:true});const tick=(t:number)=>lenis.raf(t*1000);lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(tick);return()=>{gsap.ticker.remove(tick);lenis.destroy()}},[]);return <MotionConfig reducedMotion="user">{children}</MotionConfig>}
