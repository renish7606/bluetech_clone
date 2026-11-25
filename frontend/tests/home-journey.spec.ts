import {test,expect,type Page} from '@playwright/test';

async function frame(page:Page,scroll:number){
  return page.evaluate(async s=>{
    window.scrollTo({top:s,behavior:'instant'});
    // Allow native scroll, Lenis and GSAP's scroll listener to settle.
    for(let i=0;i<4;i++)await new Promise<void>(r=>requestAnimationFrame(()=>r()));
    const dog=document.querySelector<HTMLElement>('[data-journey-dog]')!;
    const plane=document.querySelector<SVGGElement>('[data-plane]')!;
    const r=dog.getBoundingClientRect();
    return {scroll:scrollY,stage:dog.dataset.stage,progress:Number(dog.dataset.progress),face:Number(dog.dataset.facing),flight:Number(plane.dataset.progress),plane:plane.getAttribute('transform'),dog:dog.style.transform,rig:dog.querySelector('#dog-rig')?.getAttribute('transform'),joints:[...dog.querySelectorAll('[id$="-lower"]')].map(e=>e.getAttribute('transform')),within:r.left>=-2&&r.right<=innerWidth+2};
  },scroll);
}

test('entire scroll journey is reversible and airplane follows its path',async({page})=>{
  test.setTimeout(90000);
  await page.goto('/');
  await expect(page.locator('[data-journey-dog]')).toHaveAttribute('data-stage','peeking');
  await expect(page.locator('[data-journey-scene="catalogue"] .puppy-card').first()).toBeVisible();
  await page.locator('.home-journey').evaluate(e=>document.fonts.ready.then(()=>e.getBoundingClientRect().height));
  await page.waitForTimeout(650); // complete initial route reveal; not an animation clock
  const max=await page.evaluate(()=>document.documentElement.scrollHeight-innerHeight);
  const step=Math.max(10,Math.min(24,Math.floor(max/160)));
  const positions=Array.from({length:Math.ceil(max/step)+1},(_,i)=>Math.min(max,i*step));
  const snapshots=[];
  for(const s of positions)snapshots.push(await frame(page,s));
  expect([...new Set(snapshots.map(s=>s.stage))]).toEqual(['peeking','walking','approach','entering','sitting']);
  expect(snapshots.every(s=>s.within)).toBeTruthy();
  expect(snapshots.at(-1)?.flight).toBe(1);
  expect(snapshots.some(s=>s.flight>0&&s.flight<1)).toBeTruthy();
  expect(snapshots.some(s=>s.face>0)).toBeTruthy();expect(snapshots.some(s=>s.face<0)).toBeTruthy();
  expect(new Set(snapshots.filter(s=>s.stage==='walking').map(s=>JSON.stringify(s.joints))).size).toBeGreaterThan(10);
  for(let i=snapshots.length-1;i>=0;i-=7){const previous=snapshots[i];const reverse=await frame(page,previous.scroll);expect(reverse).toEqual(previous)}
  expect(await frame(page,0)).toMatchObject({stage:'peeking',progress:0,flight:0});
});

test('final basket foreground physically covers the seated dog, reduced motion is static, other routes have no rig',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  const dog=page.locator('[data-journey-dog]');await expect(dog).toHaveAttribute('data-stage','sitting');
  await expect(page.locator('[data-basket] .journey-basket-front')).toBeAttached();
  const result=await page.evaluate(()=>{
    const d=document.querySelector('[data-journey-dog]')!,b=document.querySelector('[data-basket]')!,f=b.querySelector('.journey-basket-front')!,back=b.querySelector('.journey-basket-back')!;
    const dr=d.getBoundingClientRect(),br=b.getBoundingClientRect();
    return {intersects:dr.left<br.right&&dr.right>br.left&&dr.bottom>br.top&&dr.top<br.bottom,layering:Number(getComputedStyle(back).zIndex)<Number(getComputedStyle(d).zIndex)&&Number(getComputedStyle(f).zIndex)>Number(getComputedStyle(d).zIndex)};
  });expect(result).toEqual({intersects:true,layering:true});
  const initial=await dog.getAttribute('style');await frame(page,0);expect(await dog.getAttribute('style')).toBe(initial);
  await page.getByRole('link',{name:'View available puppies'}).click();await expect(page).toHaveURL(/\/puppies/);await expect(dog).toHaveCount(0);
  await page.goBack();await expect(dog).toHaveCount(1);
});
