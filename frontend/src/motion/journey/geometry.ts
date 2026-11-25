/** Scroll is the single clock. Geometry is measured in the homepage coordinate space. */
export type Point = {x:number;y:number};
export type Anchor = Point & {scroll:number};
/** The puppy crosses the runway in step with the horizontal puppy rail. */
export const RUNWAY_DOG_START = 0.16;
export const RUNWAY_DOG_END = 0.84;
export const clamp=(n:number,a=0,b=1)=>Math.min(b,Math.max(a,n));
export const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
export const smooth=(t:number)=>{t=clamp(t);return t*t*(3-2*t)};
export const range=(v:number,a:number,b:number)=>clamp((v-a)/Math.max(1e-6,b-a));
export function pointAt(anchors:Anchor[],scroll:number):Point{
  const i=anchors.findIndex(a=>a.scroll>=scroll);
  if(i===0)return anchors[0];if(i<0)return anchors[anchors.length-1];
  const a=anchors[i-1],b=anchors[i],t=range(scroll,a.scroll,b.scroll);
  // Horizontal easing provides curved paths and a zero lateral velocity at each turn.
  return {x:mix(a.x,b.x,smooth(t)),y:mix(a.y,b.y,t)};
}
export function distanceTable(anchors:Anchor[]){
  const table=[{scroll:anchors[0].scroll,distance:0}];let last=pointAt(anchors,anchors[0].scroll),d=0;
  for(let i=1;i<anchors.length;i++)for(let k=1;k<=32;k++){
    const scroll=mix(anchors[i-1].scroll,anchors[i].scroll,k/32),p=pointAt(anchors,scroll);
    d+=Math.hypot(p.x-last.x,p.y-last.y);table.push({scroll,distance:d});last=p;
  }return table;
}
export function distanceAt(table:ReturnType<typeof distanceTable>,s:number){
  const i=table.findIndex(a=>a.scroll>=s);if(i===0)return 0;if(i<0)return table[table.length-1].distance;
  const a=table[i-1],b=table[i];return mix(a.distance,b.distance,range(s,a.scroll,b.scroll));
}
/** Facing is a deterministic function of path progress, so replay is truly reversible. */
export function facingAt(anchors:Anchor[],s:number){
  let face=Math.sign(anchors[1].x-anchors[0].x)||1;
  for(let i=1;i<anchors.length-1;i++){
    const next=Math.sign(anchors[i+1].x-anchors[i].x)||face;
    const window=Math.min(100,(anchors[i].scroll-anchors[i-1].scroll)*.28,(anchors[i+1].scroll-anchors[i].scroll)*.28);
    if(s<anchors[i].scroll-window)return face;
    if(s<=anchors[i].scroll+window)return mix(face,next,smooth(range(s,anchors[i].scroll-window,anchors[i].scroll+window)));
    face=next;
  }return face;
}
