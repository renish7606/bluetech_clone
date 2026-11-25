import {mix,smooth,clamp} from './geometry';
const rad=180/Math.PI;
const L=30;
export function createRig(svg:SVGSVGElement){
  const get=(id:string)=>{const e=svg.querySelector<SVGGElement>('#'+id);if(!e)throw new Error('Missing puppy joint: '+id);return e};
  const body=get('dog-body'),head=get('dog-head'),tail=get('dog-tail'),nearEar=get('dog-ear-near'),farEar=get('dog-ear-far'),shadow=get('dog-shadow');
  const names=['far-hind','far-front','near-hind','near-front'];
  const legs=names.map(id=>[get(id),get(id+'-lower')]);
  const transform=(e:SVGGElement,value:string)=>e.setAttribute('transform',value);
  // Two-link inverse kinematics keeps paws on the support line during stance.
  function leg(i:number,x:number,y:number,fx:number,fy:number){
    const dx=fx-x,dy=fy-y,d=clamp(Math.hypot(dx,dy),3,2*L-.05);
    const bend=(i%2===0?1:-1)*2*Math.acos(d/(2*L));
    const a=-Math.atan2(dx,dy)-bend/2;
    transform(legs[i][0],`translate(${x} ${y}) rotate(${a*rad})`);
    transform(legs[i][1],`translate(0 ${L}) rotate(${bend*rad})`);
  }
  return (distance:number,walk:number,sit:number,peek:number)=>{
    const p=distance/86*Math.PI*2, w=clamp(walk)*(1-sit),s=smooth(sit);
    const bob=Math.sin(p*2)*2.4*w, tilt=Math.sin(p)*2*w;
    // Sit: pelvis lowers, shoulders rise, rear paws tuck, chest and head rotate upright.
    transform(body,`translate(${mix(0,13,s)} ${bob+mix(0,12,s)}) rotate(${tilt-30*s} 110 110) scale(${1} ${1})`);
    transform(head,`translate(${mix(0,-18,s)} ${bob*.7-12*s+9*peek}) rotate(${-tilt*.7+4*peek+8*s} 165 104)`);
    transform(tail,`translate(${mix(60,80,s)} ${mix(101,134,s)+bob}) rotate(${Math.sin(p+0.5)*14*w+30*s})`);
    transform(nearEar,`rotate(${Math.sin(p-0.5)*5*w} 220 43)`);
    transform(farEar,`rotate(${-Math.sin(p-0.5)*4*w} 142 42)`);
    shadow.setAttribute('opacity',String((1-s)*.85));
    const offsets=[.5,.75,0,.25];
    legs.forEach((_,i)=>{
      const hind=i%2===0,far=i<2,phase=(p/(2*Math.PI)+offsets[i])%1;
      // Stance moves backward along the ground; swing recovers the foot with a lifted paw.
      const stance=phase<.62;
      const step=stance?mix(14,-14,phase/.62):mix(-14,14,smooth((phase-.62)/.38));
      const lift=stance?0:Math.sin((phase-.62)/.38*Math.PI)*14;
      const x=mix(hind?79:145,hind?100:137,s)+(far?8:0);
      const y=mix(108,hind?132:97,s)+bob;
      const fx=mix((hind?77:146)+step*w,hind?111:150,s)+(far?8:0);
      const fy=164-lift*w-(far?3:0)-peek*3;
      leg(i,x,y,fx,fy);
    });
  };
}
