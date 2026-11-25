import { type Anchor, clamp, distanceAt, distanceTable, facingAt, mix, pointAt, range, RUNWAY_DOG_END, RUNWAY_DOG_START, smooth } from './geometry';
import { createRig } from './pose';

export function createJourney(home: HTMLElement, dog: HTMLDivElement) {
  const svg = dog.querySelector<SVGSVGElement>('svg')!;
  const pose = createRig(svg);
  const side = svg.querySelector<SVGGElement>('#dog-rig')!, front = svg.querySelector<SVGGElement>('#dog-turn')!;
  const peekLip = home.querySelector<HTMLElement>('[data-peek-lip]');
  const basket = home.querySelector<HTMLElement>('[data-basket]')!;
  const flight = home.querySelector<HTMLElement>('[data-flight]');
  const path = flight?.querySelector<SVGPathElement>('[data-flight-path]');
  const plane = flight?.querySelector<SVGGElement>('[data-plane]');

  let anchors: Anchor[] = [],
    distances: ReturnType<typeof distanceTable> = [],
    start = 0,
    end = 1,
    approach = 0,
    entry = 0,
    flightStart = 0,
    flightEnd = 1,
    width = 0,
    rootY = 0,
    size = 0,
    peekEnd = 0,
    routeLength = 0;

  const pageY = (e: Element) => e.getBoundingClientRect().top + window.scrollY;

  function measure() {
    const rect = home.getBoundingClientRect();
    rootY = rect.top + window.scrollY;
    width = rect.width;
    const vh = window.innerHeight;
    size = dog.offsetWidth || 140;
    const mobile = width <= 760;
    const edge = Math.max(size * 0.51 + 8, width * (mobile ? 0.16 : 0.09));

    // 1. START AT THE MIDDLE BOX IN HERO ARCHES (Arch 4)
    const mascotBox = home.querySelector<HTMLElement>('#hero-mascot-box') || home.querySelector<HTMLElement>('.lineup-mascot');
    let firstX = width * 0.5;
    let firstY = vh * 0.62;
    if (mascotBox) {
      const mRect = mascotBox.getBoundingClientRect();
      firstX = mRect.left - rect.left + mRect.width * 0.5;
      firstY = mRect.top + window.scrollY - rootY + mRect.height * 0.72;
    }
    const first = { x: firstX, y: firstY };
    start = 0;
    const peekDistance = Math.min(260, vh * 0.35);
    peekEnd = peekDistance;

    // 2. BASKET ON THE LEFT SIDE AT FOOTER
    const b = basket.getBoundingClientRect();
    const target = {
      x: b.left - rect.left + b.width * 0.48,
      y: b.top + window.scrollY - rootY + b.height * 0.56,
    };
    const finalY = rootY + target.y;
    anchors = [
      { ...first, scroll: 0 },
      { x: first.x + size * 0.05, y: first.y + peekDistance * 0.42, scroll: peekDistance },
    ];

    // 3. RUNWAY (Meet the Pups): Mascot walks on the floorboard as doors scroll horizontally
    const runway = home.querySelector<HTMLElement>('.door-runway');
    const runwayFloor = runway?.querySelector<HTMLElement>('.door-floor');

    if (runway && runwayFloor && !mobile) {
      const runwayTop = pageY(runway);
      const runwayTravel = Math.max(1, runway.offsetHeight - vh);
      const runwayEntryScroll = Math.max(anchors[anchors.length - 1].scroll + 100, runwayTop);
      const runwayExitScroll = runwayTop + runwayTravel;

      if (runwayExitScroll > runwayEntryScroll) {
        const floorViewportOffset = vh - runwayFloor.offsetHeight - size * 0.06;

        anchors.push({
          scroll: runwayEntryScroll - 80,
          x: width * RUNWAY_DOG_START,
          y: runwayEntryScroll - 80 - rootY + floorViewportOffset * 0.85,
        });

        anchors.push(
          {
            scroll: runwayEntryScroll,
            x: width * RUNWAY_DOG_START,
            y: runwayEntryScroll - rootY + floorViewportOffset,
          },
          {
            scroll: runwayExitScroll,
            x: width * RUNWAY_DOG_END,
            y: runwayExitScroll - rootY + floorViewportOffset,
          }
        );
      }
    }

    // 4. YOUR PUPPY JOURNEY: Dog parks right next to the WhatsApp smartphone frame for points 1, 2, 3
    const journeyEl = home.querySelector<HTMLElement>('[data-journey-scene="journey"]');
    const phoneSeat = journeyEl?.querySelector<HTMLElement>('.journey-phone-dog-seat') || journeyEl?.querySelector<HTMLElement>('.phone-device-frame');
    if (journeyEl && phoneSeat) {
      const pRect = phoneSeat.getBoundingClientRect();
      const phoneWrap = phoneSeat.closest<HTMLElement>('.phone-device-wrap') || phoneSeat;
      const phoneRect = phoneWrap.getBoundingClientRect();
      const stickyTop = Number.parseFloat(getComputedStyle(phoneWrap).top) || 0;
      const jScrollStart = Math.max(anchors[anchors.length - 1].scroll + 80, pageY(journeyEl) + stickyTop);
      const jScrollEnd = Math.max(
        jScrollStart + 180,
        pageY(journeyEl) + journeyEl.offsetHeight - stickyTop - phoneWrap.offsetHeight
      );
      const pX = Math.max(edge, pRect.left - rect.left - size * 0.36);
      const seatOffsetY = pRect.bottom - phoneRect.top - size * 0.52;

      anchors.push(
        { scroll: jScrollStart, x: pX, y: jScrollStart - rootY + stickyTop + seatOffsetY },
        { scroll: jScrollEnd, x: pX, y: jScrollEnd - rootY + stickyTop + seatOffsetY }
      );
    }

    // 5. THE PUPPY PASSPORT: Mascot sits at the booklet center bottom
    const passEl = home.querySelector<HTMLElement>('[data-journey-scene="passport"]');
    const passSeat = passEl?.querySelector<HTMLElement>('.passport-dog-seat') || passEl?.querySelector<HTMLElement>('.passport-book');
    if (passEl && passSeat) {
      const psScroll = Math.max(anchors[anchors.length - 1].scroll + 80, pageY(passEl) + passEl.offsetHeight * 0.42);
      const psRect = passSeat.getBoundingClientRect();
      const psX = psRect.left - rect.left + psRect.width * 0.46;
      const psY = psRect.bottom + window.scrollY - rootY - size * 0.44;

      anchors.push(
        { scroll: psScroll, x: psX, y: psY },
        { scroll: psScroll + 180, x: psX, y: psY }
      );
    }

    // 6. HAPPY FAMILIES & PUPPIES: Floor base near miniature door
    const famEl = home.querySelector<HTMLElement>('[data-journey-scene="families"]');
    const famDoor = famEl?.querySelector<HTMLElement>('.family-mini-door');
    if (famEl && famDoor) {
      const fScroll = Math.max(anchors[anchors.length - 1].scroll + 80, pageY(famEl) + famEl.offsetHeight * 0.62);
      const fRect = famDoor.getBoundingClientRect();
      const fX = fRect.right - rect.left + 24;
      const fY = fRect.bottom + window.scrollY - rootY - size * 0.28;

      anchors.push(
        { scroll: fScroll, x: fX, y: fY },
        { scroll: fScroll + 160, x: fX, y: fY }
      );
    }

    // 7. QUESTIONS, ANSWERED: Under button at dock with floating question mark
    const faqEl = home.querySelector<HTMLElement>('[data-journey-scene="faq"]');
    const faqDock = faqEl?.querySelector<HTMLElement>('.faq-mascot-dock');
    if (faqEl) {
      const faqScroll = Math.max(anchors[anchors.length - 1].scroll + 80, pageY(faqEl) + faqEl.offsetHeight * 0.38);
      let qX = Math.max(edge, width * 0.17);
      let qY = pageY(faqEl) - rootY + vh * 0.44;
      if (faqDock) {
        const qRect = faqDock.getBoundingClientRect();
        qX = qRect.left - rect.left + qRect.width * 0.5;
        qY = qRect.top + window.scrollY - rootY + 20;
      }
      anchors.push(
        { scroll: faqScroll, x: qX, y: qY },
        { scroll: faqScroll + 180, x: qX, y: qY }
      );
    }

    // Leave enough scroll room after the FAQ for the final walk into the basket.
    const lastSceneScroll = anchors[anchors.length - 1].scroll;
    const requestedEnd = Math.max(lastSceneScroll + 560, finalY - vh * (mobile ? 0.64 : 0.68));
    end = Math.min(document.documentElement.scrollHeight - vh, requestedEnd);
    if (end < lastSceneScroll + 500) end = lastSceneScroll + 500;
    approach = Math.max(lastSceneScroll + 140, end - 420);
    entry = Math.max(approach + 120, end - 180);
    end = Math.max(entry + 160, end);

    // 8. FINAL WELCOME HOME & BASKET ON THE LEFT
    const approachX = Math.min(width - edge, target.x + size * (mobile ? 0.95 : 1.2));
    anchors.push(
      { scroll: approach, x: approachX, y: target.y - (end - approach) + size * 0.05 },
      { scroll: entry, x: target.x + size * 0.42, y: target.y - (end - entry) + size * 0.08 },
      { scroll: end, ...target }
    );

    distances = distanceTable(anchors);
    if (peekLip) {
      peekLip.style.left = `${first.x}px`;
      peekLip.style.top = `${first.y + size * 0.14}px`;
    }

    if (flight && path && plane) {
      const flightSection = flight.closest<HTMLElement>('.home-meet-section') || flight;
      const fY = pageY(flightSection), fh = flightSection.offsetHeight;
      flightStart = Math.max(0, fY - vh * 0.4);
      flightEnd = Math.max(flightStart + 80, fY + vh * 0.56);
      routeLength = path.getTotalLength();
    }
  }

  function render(scroll: number) {
    if (!anchors.length) return;
    const s = clamp(scroll, start, end);
    const p = pointAt(anchors, s);
    const sit = smooth(range(s, entry + (end - entry) * 0.55, end));
    const peek = 1 - smooth(range(s, 0, peekEnd));
    const jump = range(s, entry, end);
    const lift = Math.sin(jump * Math.PI) * size * 0.33;
    const walk = smooth(range(s, 0, peekEnd)) * (1 - smooth(range(s, entry, end)));
    const face = facingAt(anchors, s);
    const turn = smooth(range(Math.abs(face), 0.18, 0.72));

    side.setAttribute(
      'transform',
      `translate(120 0) scale(${face < 0 ? -Math.max(0.25, Math.abs(face)) : Math.max(0.25, Math.abs(face))} 1) translate(-120 0)`
    );
    side.setAttribute('opacity', String(turn));
    front.setAttribute('opacity', String(1 - turn));

    const emerge = smooth(range(s, 0, peekEnd));
    const emergeLift = Math.sin(emerge * Math.PI) * size * 0.22;
    const dogScale = mix(1, 0.9, sit);

    dog.style.transform = `translate3d(${p.x}px,${p.y - lift - emergeLift}px,0) translate(-50%,-92%) scale(${dogScale})`;
    dog.style.clipPath = 'none';
    dog.style.visibility = 'visible';

    pose(distanceAt(distances, s) * 240 / Math.max(1, size), walk, sit, peek);
    if (peekLip) peekLip.style.opacity = '0';

    dog.dataset.stage = peek > 0.05 ? 'peeking' : s < approach ? 'walking' : s < entry ? 'approach' : sit < 0.999 ? 'entering' : 'sitting';
    dog.dataset.progress = (s / end).toFixed(5);
    dog.dataset.facing = String(face);

    if (flight && path && plane && routeLength > 0) {
      const fp = clamp(range(scroll, flightStart, flightEnd), 0, 1);
      const d = routeLength * fp;
      const a = path.getPointAtLength(d);
      const before = path.getPointAtLength(Math.max(0, d - 1));
      const after = path.getPointAtLength(Math.min(routeLength, d + 1));
      const angle = Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI;
      plane.setAttribute('transform', `translate(${a.x} ${a.y}) rotate(${angle})`);
      plane.dataset.progress = fp.toFixed(5);
    }
  }

  function staticPose() {
    render(end);
    dog.dataset.stage = 'sitting';
  }

  return { measure, render, staticPose };
}
