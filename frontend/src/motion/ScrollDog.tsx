import {useLayoutEffect,useRef,type RefObject} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import dog from './dog.svg?raw';
import {createJourney} from './journey/controller';
import './journey/journey.css';
gsap.registerPlugin(ScrollTrigger);

export default function ScrollDog({home}: {home:RefObject<HTMLDivElement>}){
  const root=useRef<HTMLDivElement>(null);
  useLayoutEffect(()=>{
    if(!root.current)return;
    const el=root.current, page=home.current??el.closest<HTMLElement>('.home-journey');
    if(!page)return;
    const mm=gsap.matchMedia();
    mm.add({'motion':'(prefers-reduced-motion: no-preference)','reduced':'(prefers-reduced-motion: reduce)'},context=>{
      const controller=createJourney(page,el);
      const reduced=Boolean(context.conditions?.reduced);
      const render=()=>reduced?controller.staticPose():controller.render(window.scrollY);
      let frame=0;
      const refresh=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{controller.measure();render()})};
      controller.measure();render();
      // ScrollTrigger is the sole animation clock; no looping tweens or independent timers.
      const trigger=reduced?undefined:ScrollTrigger.create({start:0,end:()=>ScrollTrigger.maxScroll(window),onUpdate:render,onRefresh:refresh});
      const reflow=()=>{refresh();trigger?.refresh()};
      const observer=new ResizeObserver(reflow);observer.observe(page);
      page.querySelectorAll('[data-journey-scene],[data-basket],[data-flight]').forEach(e=>observer.observe(e));
      window.addEventListener('resize',reflow);document.fonts?.addEventListener('loadingdone',reflow);
      return()=>{trigger?.kill();observer.disconnect();window.removeEventListener('resize',reflow);document.fonts?.removeEventListener('loadingdone',reflow);cancelAnimationFrame(frame)};
    });
    return()=>mm.revert();
  },[home]);
  return <><div className="journey-peek-lip" data-peek-lip aria-hidden="true"/><div className="journey-dog" data-journey-dog aria-hidden="true" ref={root} style={{width:'clamp(90px,12vw,166px)',maxWidth:'none'}} dangerouslySetInnerHTML={{__html:dog}}/></>;
}
