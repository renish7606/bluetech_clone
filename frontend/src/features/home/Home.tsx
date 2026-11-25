import { useState, useRef, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, ShieldCheck, Plane, MessageCircle, Globe, Play, ArrowUpRight } from 'lucide-react';
import { useApi, type Puppy } from '../../lib/api';
import { Button, WhatsApp } from '../../components/UI';
import ScrollDog from '../../motion/ScrollDog';
import { BasketScene } from '../../motion/journey/SceneArt';
import { DoorCard } from '../../components/DoorCard';
import { FAQList } from '../information/FAQ';
import { RUNWAY_DOG_END, RUNWAY_DOG_START, smooth } from '../../motion/journey/geometry';
import { FlightScene } from '../../motion/journey/SceneArt';

const journeySteps = [
  {
    title: 'Choose your breed',
    description: "Select your preferred breed or tell us what you're looking for. We'll guide you based on availability and your lifestyle.",
  },
  {
    title: 'Get photos & details',
    description: 'Our team will share real photos, health details, and all necessary information directly on WhatsApp.',
  },
  {
    title: 'Secure & safe delivery',
    description: 'Once confirmed, we handle everything professionally and ensure your puppy reaches you safely and stress-free.',
  },
];

const featuredBreeds = [
  ['Maltipoo', 'maltipoo'],
  ['Pomeranian', 'pomeranian'],
  ['Poodle', 'poodle'],
  ['Cavapoo', 'cavapoo'],
  ['Shih Tzu', 'shih-tzu'],
];

const heroLineupPups = [
  {
    name: 'Max',
    breed: 'Maltipoo',
    slug: 'maltipoo-max-male',
    image: 'https://puppy.instabizweb.com/_next/image?url=%2Fmedia%2FZ0ToauDx7Eve%2F5fffe4d022%2Fb942a5_4b8cfb8204d24eadaf524332aba1dc15-mv2.webp&w=3840&q=75',
    tilt: '-5deg',
    width: '8.6rem',
  },
  {
    name: 'Bella',
    breed: 'Pomeranian',
    slug: 'pomeranian-female',
    image: 'https://puppy.instabizweb.com/_next/image?url=%2Fmedia%2F3yOfnmoyPooH%2F81e0c7e00c%2Fb942a5_556841b9a73942e5a9d782a683f3bc68-mv2.jpg&w=3840&q=75',
    tilt: '3deg',
    width: '10.4rem',
  },
  {
    name: 'Luna',
    breed: 'Korean Teacup Maltipoo',
    slug: 'korean-teacup-maltipoo-female',
    image: 'https://puppy.instabizweb.com/_next/image?url=%2Fmedia%2FgAaGwoGej2g6%2F5523e884dd%2Fb942a5_50f0ae67c9ff437d911597d52a9e63b3-mv2.jpg&w=3840&q=75',
    tilt: '-2deg',
    width: '9.2rem',
  },
  {
    name: 'Milo',
    breed: 'Maltipoo & Cavapoo',
    slug: 'maltipoo-cavapoo-male',
    image: 'https://puppy.instabizweb.com/_next/image?url=%2Fmedia%2FYQhey4j7uWvZ%2F3ea10db6c1%2Fb942a5_7ce7e7bd18424b6c8fb16dd30113ade2-mv2.jpg&w=3840&q=75',
    tilt: '3deg',
    width: '9.4rem',
  },
  {
    name: 'Teddy',
    breed: 'Toy Poodle',
    slug: 'toy-poodle-male-female',
    image: 'https://puppy.instabizweb.com/_next/image?url=%2Fmedia%2FvMu0BPvkAZ-j%2Fc65e53967d%2Fb942a5_0b2c0c0d178c4005acbe28725a5ea573-mv2.jpg&w=3840&q=75',
    tilt: '-3deg',
    width: '10.4rem',
  },
  {
    name: 'Coco',
    breed: 'Shih Tzu',
    slug: 'shitzu-female',
    image: 'https://puppy.instabizweb.com/_next/image?url=%2Fmedia%2FqNrTCSrsYyzY%2F168fa8c4ff%2Fb942a5_eb14616c76c24da89afe7fa3b7d7ae6a-mv2.jpeg&w=3840&q=75',
    tilt: '4deg',
    width: '8.4rem',
  },
];

const fallbackPuppies: Puppy[] = [
  {
    slug: 'maltipoo-max-male',
    name: 'Max',
    breed: 'Maltipoo',
    sex: 'Boy',
    age: '3 months',
    origin: 'local',
    status: 'available',
    has_video: true,
    media: [
      {
        url: 'https://puppy.instabizweb.com/_next/image?url=%2Fmedia%2FZ0ToauDx7Eve%2F5fffe4d022%2Fb942a5_4b8cfb8204d24eadaf524332aba1dc15-mv2.webp&w=3840&q=75',
        type: 'image',
      },
    ],
  },
  {
    slug: 'korean-teacup-maltipoo-female',
    name: 'Korean Teacup Maltipoo',
    breed: 'Korean Teacup Maltipoo',
    sex: 'Girl',
    age: '2 months',
    origin: 'imported',
    status: 'available',
    has_video: true,
    media: [
      {
        url: 'https://puppy.instabizweb.com/_next/image?url=%2Fmedia%2FgAaGwoGej2g6%2F5523e884dd%2Fb942a5_50f0ae67c9ff437d911597d52a9e63b3-mv2.jpg&w=3840&q=75',
        type: 'image',
      },
    ],
  },
  {
    slug: 'korean-teacup-poodle-female',
    name: 'Korean Teacup Poodle',
    breed: 'Korean Teacup Poodle',
    sex: 'Girl',
    age: '2 months',
    origin: 'imported',
    status: 'available',
    has_video: false,
    media: [
      {
        url: 'https://puppy.instabizweb.com/_next/image?url=%2Fmedia%2FxeMJCapr5vcU%2Fe618c653b2%2Fb942a5_14376a216177484dbbb27995d0f6aeb7-mv2.jpg&w=3840&q=75',
        type: 'image',
      },
    ],
  },
  {
    slug: 'maltipoo-cavapoo-male',
    name: 'Maltipoo & Cavapoo',
    breed: 'Maltipoo & Cavapoo',
    sex: 'Boy',
    age: '3 months Maltipoo & 2 months Cavapoo',
    origin: 'local',
    status: 'available',
    has_video: true,
    media: [
      {
        url: 'https://puppy.instabizweb.com/_next/image?url=%2Fmedia%2FYQhey4j7uWvZ%2F3ea10db6c1%2Fb942a5_7ce7e7bd18424b6c8fb16dd30113ade2-mv2.jpg&w=3840&q=75',
        type: 'image',
      },
    ],
  },
  {
    slug: 'toy-poodle-male-female',
    name: 'Toy Poodle',
    breed: 'Toy Poodle',
    sex: 'Boy & girl',
    age: '2 months',
    origin: 'imported',
    status: 'available',
    has_video: false,
    media: [
      {
        url: 'https://puppy.instabizweb.com/_next/image?url=%2Fmedia%2FvMu0BPvkAZ-j%2Fc65e53967d%2Fb942a5_0b2c0c0d178c4005acbe28725a5ea573-mv2.jpg&w=3840&q=75',
        type: 'image',
      },
    ],
  },
  {
    slug: 'maltipoo-female',
    name: 'Maltipoo',
    breed: 'Maltipoo',
    sex: 'Girl',
    age: '3 months',
    origin: 'imported',
    status: 'available',
    has_video: true,
    media: [
      {
        url: 'https://puppy.instabizweb.com/_next/image?url=%2Fmedia%2F3WJNmn6VVgVu%2F732f779474%2Fb942a5_2b5dcece361b4589890ae920c66a1b70-mv2.jpg&w=3840&q=75',
        type: 'image',
      },
    ],
  },
  {
    slug: 'pomeranian-female',
    name: 'Pomeranian',
    breed: 'Pomeranian',
    sex: 'Girl',
    age: '3 months',
    origin: 'imported',
    status: 'available',
    has_video: false,
    media: [
      {
        url: 'https://puppy.instabizweb.com/_next/image?url=%2Fmedia%2F3yOfnmoyPooH%2F81e0c7e00c%2Fb942a5_556841b9a73942e5a9d782a683f3bc68-mv2.jpg&w=3840&q=75',
        type: 'image',
      },
    ],
  },
  {
    slug: 'cavapoo-copper',
    name: 'Copper',
    breed: 'Cavapoo',
    sex: 'Boy',
    age: '2 months',
    origin: 'imported',
    status: 'available',
    has_video: false,
    media: [
      {
        url: 'https://puppy.instabizweb.com/_next/image?url=%2Fmedia%2FO-6w4FYqE10j%2Fbe76f399cc%2Fb942a5_bb73ebbb952047988f944f3a8e3052bd-mv2.jpg&w=3840&q=75',
        type: 'image',
      },
    ],
  },
  {
    slug: 'shitzu-female',
    name: 'Shih Tzu',
    breed: 'Shih Tzu',
    sex: 'Girl',
    age: '2 months',
    origin: 'imported',
    status: 'available',
    has_video: false,
    media: [
      {
        url: 'https://puppy.instabizweb.com/_next/image?url=%2Fmedia%2FqNrTCSrsYyzY%2F168fa8c4ff%2Fb942a5_eb14616c76c24da89afe7fa3b7d7ae6a-mv2.jpeg&w=3840&q=75',
        type: 'image',
      },
    ],
  },
  {
    slug: 'shitzu-male',
    name: 'Shih Tzu',
    breed: 'Shih Tzu',
    sex: 'Boy',
    age: '2 months',
    origin: 'imported',
    status: 'available',
    has_video: false,
    media: [
      {
        url: 'https://puppy.instabizweb.com/_next/image?url=%2Fmedia%2Fcrgs9ih6as_M%2Fe37bafb1bf%2Fb942a5_344e49c6c34940d2b09a3ddd5c2e3234-mv2.jpg&w=3840&q=75',
        type: 'image',
      },
    ],
  },
  {
    slug: 'maltipoo-female-2',
    name: 'Maltipoo',
    breed: 'Maltipoo',
    sex: 'Girl',
    age: '2.5 months',
    origin: 'imported',
    status: 'available',
    has_video: false,
    media: [
      {
        url: 'https://puppy.instabizweb.com/_next/image?url=%2Fmedia%2FwNm2_VIBEQvK%2F4b68f59e75%2Fb942a5_7dd33c9b78c04f78a6a1c7386fb55620-mv2.jpg&w=3840&q=75',
        type: 'image',
      },
    ],
  },
];

export default function Home() {
  const pups = useApi<Puppy[]>('/puppies?status=available');
  const home = useRef<HTMLDivElement>(null);
  const runwayRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const stepperRef = useRef<HTMLOListElement>(null);
  const [openDoors, setOpenDoors] = useState<Set<number>>(() => new Set());
  const [activeStep, setActiveStep] = useState(0);

  const displayPuppies = (pups.data && pups.data.length > 0) ? pups.data : fallbackPuppies;
  const activeJourneyStep = journeySteps[activeStep];

  useEffect(() => {
    const runway = runwayRef.current;
    const rail = railRef.current;
    if (!runway || !rail) return;

    let frame = 0;
    const measure = () => {
      if (window.innerWidth <= 760) {
        runway.style.height = '';
        rail.style.transform = '';
        setOpenDoors(new Set());
        return;
      }

      const maxShift = Math.max(0, rail.scrollWidth - runway.clientWidth);
      runway.style.height = `${window.innerHeight + maxShift}px`;
    };

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (window.innerWidth <= 760) return;
        const rect = runway.getBoundingClientRect();
        const travel = Math.max(1, runway.offsetHeight - window.innerHeight);
        const progress = Math.min(1, Math.max(0, -rect.top / travel));
        const maxShift = Math.max(0, rail.scrollWidth - runway.clientWidth);
        rail.style.transform = `translate3d(${-maxShift * progress}px, 0, 0)`;

        const laneProgress = smooth(progress);
        const laneX = window.innerWidth * (
          RUNWAY_DOG_START + (RUNWAY_DOG_END - RUNWAY_DOG_START) * laneProgress
        );
        const approaching = new Set<number>();
        rail.querySelectorAll<HTMLElement>('.tp-door-wrap').forEach((door, index) => {
          const doorRect = door.getBoundingClientRect();
          if (Math.abs(doorRect.left + doorRect.width / 2 - laneX) < 150) approaching.add(index);
        });
        setOpenDoors((previous) => (
          previous.size === approaching.size &&
          [...previous].every((index) => approaching.has(index))
            ? previous
            : approaching
        ));
      });
    };

    const refresh = () => {
      measure();
      update();
    };

    refresh();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', refresh);
    const observer = new ResizeObserver(refresh);
    observer.observe(rail);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', refresh);
    };
  }, [displayPuppies.length]);

  useEffect(() => {
    const stepper = stepperRef.current;
    const section = stepper?.closest<HTMLElement>('.journey-section');
    const items = stepper ? [...stepper.querySelectorAll('li')] : [];
    if (!stepper || !section || !items.length) return;

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = section.getBoundingClientRect();
        if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
        const target = window.innerHeight * 0.46;
        let closest = 0;
        let distance = Number.POSITIVE_INFINITY;
        items.forEach((item, index) => {
          const rect = item.getBoundingClientRect();
          const point = Math.min(rect.bottom, Math.max(rect.top, target));
          const nextDistance = Math.abs(point - target);
          if (nextDistance < distance) {
            distance = nextDistance;
            closest = index;
          }
        });
        setActiveStep((current) => current === closest ? current : closest);
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div className="home-journey" ref={home}>
      {/* Scroll-tracked dog mascot that journeys from Hero Arch 4 down to basket */}
      <ScrollDog home={home} />

      {/* =========================================================================
          1. HERO SECTION WITH 7 ARCHED PEEK-A-BOO PORTALS + SCALLOPED CLOUD AWNING
          ========================================================================= */}
      <section
        data-journey-scene="hero"
        className="tp-hero-section"
        aria-label="TeddyPups Hero"
      >
        <span className="hero-sun-glow" aria-hidden="true" />
        <div className="hero-copy-wrap">
          <p className="hero-sticker-note">
            <span>every puppy is family</span>
            <svg viewBox="0 0 220 24" preserveAspectRatio="none" className="squiggle-svg" aria-hidden="true">
              <path
                d="M4 14c18-10 30 8 48-1s28-9 46 0 30 8 48-1 30-9 48 0 18 2 22 0"
                fill="none"
                stroke="#c2622b"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </p>
          <h1 className="hero-title font-display">
            <span>Premium teacup</span>
            <span className="hero-title-accent">puppies in Dubai</span>
          </h1>
          <p className="hero-lede">
            Meet your new best friend in our Dubai showroom, or order a rare miniature breed from trusted breeders worldwide.
          </p>
          <div className="hero-actions">
            <Button to="/puppies">View available puppies</Button>
            <WhatsApp secondary>Enquire on WhatsApp</WhatsApp>
          </div>
        </div>

        {/* 7 Arched Peek-a-boo Portals Lineup */}
        <div className="hero-stage">
          <ul className="hero-lineup" aria-label="Puppies in our showroom">
            {/* Left 3 puppy portals */}
            {heroLineupPups.slice(0, 3).map((pup, index) => (
              <li
                key={pup.name}
                className={`lineup-seat lineup-seat-${index + 1}`}
                style={{ '--tilt': pup.tilt, '--w': pup.width } as CSSProperties}
              >
                <Link to={`/puppies/${pup.slug}`} className="lineup-card tp-door">
                  <span className="lineup-photo">
                    <img src={pup.image} alt={`${pup.name}, ${pup.breed}`} loading="eager" />
                  </span>
                  <span className="lineup-bubble">{pup.breed}</span>
                </Link>
              </li>
            ))}

            {/* Portal 4 (CENTER): Mascot Portal */}
            <li className="lineup-seat lineup-mascot-seat">
              <div
                id="hero-mascot-box"
                className="lineup-mascot"
                data-pup-stop="true"
                data-pose="peek"
                data-facing="right"
                aria-label="TeddyPups Mascot"
              >
                {/* The single animated ScrollDog actor emerges from here */}
                <div className="mascot-portal-bg" />
              </div>
            </li>

            {/* Right 3 puppy portals */}
            {heroLineupPups.slice(3).map((pup, index) => (
              <li
                key={pup.name}
                className={`lineup-seat lineup-seat-${index + 4}`}
                style={{ '--tilt': pup.tilt, '--w': pup.width } as CSSProperties}
              >
                <Link to={`/puppies/${pup.slug}`} className="lineup-card tp-door">
                  <span className="lineup-photo">
                    <img src={pup.image} alt={`${pup.name}, ${pup.breed}`} loading="eager" />
                  </span>
                  <span className="lineup-bubble">{pup.breed}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Scalloped Quilted Cloud Awning across the bottom of the hero */}
          <div className="hero-cloud-awning" aria-hidden="true">
            <div className="cloud-scallop-strip" />
            <div className="cloud-quilt-texture" />
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. AVAILABLE PUPPIES
          ========================================================================= */}
      <section
        ref={runwayRef}
        data-journey-scene="runway"
        className="door-runway"
        aria-label="Available puppies"
      >
        <div className="door-stage">
          <div className="door-stage-header">
            <div className="door-stage-titles">
              <h2 className="font-display door-main-title">Meet the pups</h2>
              <p className="door-main-desc">
                Real puppies, real photos, looking for their families right now.
              </p>
            </div>
            <Link to="/puppies" className="door-browse-all-btn">
              See all available puppies
            </Link>
          </div>

          <div className="door-conveyor">
            <div className="door-rail" ref={railRef}>
              {displayPuppies.map((pup, index) => (
                <DoorCard
                  key={pup.slug}
                  puppy={pup}
                  index={index}
                  isOpenExternal={openDoors.has(index)}
                />
              ))}
            </div>
          </div>
          <div className="door-floor" aria-hidden="true" />
        </div>
      </section>

      <section className="home-meet-section" aria-labelledby="home-meet-title">
        <div className="home-meet-inner container">
          <div className="home-meet-heading">
            <h2 id="home-meet-title">Two ways to meet your puppy</h2>
          </div>
          <div className="home-meet-grid">
            <Link to="/puppies?origin=local" className="home-way-card">
              <span className="home-way-sign home-way-sign--local">Puppies in Dubai</span>
              <span className="home-way-visual home-way-visual--local">
                <svg className="home-way-skyline" viewBox="0 0 300 120" aria-hidden="true">
                  <path d="M4 116h292M20 116V78h16v38M44 116V60h18v56M70 116V84h12v32M150 116V36l4-6v-14l3-4 3 4v14l4 6v80M118 116V70l12-8v54M174 116V64l14 8v44M200 116V82h18v34M226 116V56h14v60M248 116V88h22v28" />
                </svg>
                <span className="home-way-photo">
                  <img
                    src="https://puppy.instabizweb.com/_next/image?url=%2Fmedia%2FFHyoHcIosLZE%2F60f6e7e00a%2F27b888_323008bb0f6a41d4bde2a0da7206cd98f000.jpg&w=640&q=75"
                    alt="A tiny apricot puppy at the TeddyPups Dubai showroom"
                    loading="lazy"
                  />
                </span>
              </span>
              <span className="home-way-copy">
                <span className="home-way-description">Meet locally available puppies in person and take the time to find your match.</span>
                <span className="home-way-link">Meet local puppies <ArrowUpRight size={17} /></span>
              </span>
            </Link>
            <Link to="/puppies?origin=imported" className="home-way-card">
              <span className="home-way-sign home-way-sign--imported">Imported for you</span>
              <span className="home-way-visual home-way-visual--flight">
                <span className="home-way-flight">
                  <FlightScene />
                </span>
              </span>
              <span className="home-way-copy">
                <span className="home-way-description">Choose from trusted breeders worldwide and let us guide the journey to Dubai.</span>
                <span className="home-way-link">Explore imported puppies <ArrowUpRight size={17} /></span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. YOUR PUPPY JOURNEY (WHATSAPP PHONE MOCKUP WITH 3 SMOOTH POINTS)
          ========================================================================= */}
      <section data-journey-scene="journey" className="journey-section">
        <div className="journey-inner container">
          <div className="journey-copy">
            <h2 className="font-display journey-title">Your puppy journey</h2>
            <p className="journey-subtitle">
              A premium, step-by-step concierge experience. We make adoption simple, secure, and purely joyful.
            </p>
            <ol ref={stepperRef} className="journey-stepper" aria-label="Puppy journey steps">
              {journeySteps.map((step, index) => (
                <li key={step.title}>
                  <button
                    type="button"
                    className={`step-item step-${index + 1} ${activeStep === index ? 'active' : ''}`}
                    onClick={() => setActiveStep(index)}
                    aria-pressed={activeStep === index}
                  >
                    <span className="step-num-badge">{index + 1}</span>
                    <span className="step-content">
                      <span className="step-heading">{step.title}</span>
                      <span className="step-desc">{step.description}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="journey-actions">
              <Link to="/how-it-works" className="button secondary journey-how-btn">
                How it works
              </Link>
            </div>
          </div>

          {/* Realistic WhatsApp Smartphone Mockup */}
          <div className="phone-device-wrap">
            {/* Dock station where the dog mascot sits right next to the phone */}
            <div className="journey-phone-dog-seat" aria-hidden="true" />

            <div className="phone-device-frame">
              {/* Phone Header */}
              <div className="phone-header-bar">
                <img
                  src="https://puppy.instabizweb.com/_next/image?url=%2Fbrand%2Flogo.png&w=96&q=75"
                  className="phone-avatar-img"
                  alt="TeddyPups U.A.E."
                />
                <div className="phone-profile-info">
                  <span className="phone-profile-name">TeddyPups U.A.E.</span>
                  <span className="phone-profile-status">online</span>
                </div>
              </div>

              {/* Chat Canvas with Paw Pattern */}
              <div className="phone-chat-screen">
                {/* Incoming User Inquiry Bubble */}
                <div className="chat-bubble user-bubble">
                  Hi TeddyPups! I'd love to know more about your puppies.
                </div>

                {/* TeddyPups Concierge Bot Response */}
                <div className="chat-bubble bot-bubble">
                  <p className="chat-step-label">Step {activeStep + 1} · {activeJourneyStep.title}</p>
                  <p className="bot-text">{activeJourneyStep.description}</p>
                  <div className="breed-chip-grid">
                    {featuredBreeds.map(([name, slug]) => (
                      <Link key={slug} className="breed-chip" to={`/puppies?breed=${slug}`}>
                        {name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Photos & Video Preview Sent in WhatsApp */}
                <div className="chat-media-row">
                  <img
                    src="https://puppy.instabizweb.com/_next/image?url=%2Fmedia%2FFHyoHcIosLZE%2F60f6e7e00a%2F27b888_323008bb0f6a41d4bde2a0da7206cd98f000.jpg&w=3840&q=75"
                    alt="Puppy sample"
                    className="chat-snap-thumb"
                  />
                  <img
                    src="https://puppy.instabizweb.com/_next/image?url=%2Fmedia%2FVi-kzyvemRl4%2Fe740ed8a24%2F27b888_323008bb0f6a41d4bde2a0da7206cd98f001.jpg&w=3840&q=75"
                    alt="Puppy close up"
                    className="chat-snap-thumb"
                  />
                </div>

                <div className="chat-video-preview">
                  <img
                    src="https://puppy.instabizweb.com/_next/image?url=%2Fmedia%2Fg_e4ebbc7fyG%2F8276289ae7%2F27b888_323008bb0f6a41d4bde2a0da7206cd98f002.jpg&w=3840&q=75"
                    alt="Puppy video"
                    className="chat-video-img"
                  />
                  <span className="chat-play-overlay">
                    <Play size={20} fill="#ffffff" color="#ffffff" />
                  </span>
                </div>

                <div className="chat-bubble bot-bubble">
                  <p className="bot-text">
                    {activeStep === 0
                      ? 'Choose a breed to explore available puppies.'
                      : activeStep === 1
                        ? 'We will share real photos, health details, and updates directly on WhatsApp.'
                        : 'We coordinate a safe journey and help your puppy arrive home comfortably.'}
                  </p>
                </div>
              </div>

              {/* Phone Footer Input Bar */}
              <div className="phone-bottom-bar">
                <span className="phone-input-placeholder">Say hello on WhatsApp</span>
                <a
                  href="https://wa.me/919898124987?text=Hi%20TeddyPups%2C%20I'd%20like%20to%20know%20more%20about%20your%20puppies."
                  className="phone-send-btn"
                  aria-label="Send WhatsApp message"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. THE PUPPY PASSPORT (OPEN 2-PAGE BOOKLET WITH 4 AUTHENTIC STAMPS)
          ========================================================================= */}
      <section data-journey-scene="passport" className="passport-section">
        <div className="passport-container">
          <div className="passport-book">
            {/* Left Page: Booklet Title & Headline */}
            <div className="passport-page passport-page-left">
              <span className="passport-script-tag font-hand">puppy passport</span>
              <h2 className="passport-heading font-display">
                Why<br />families trust<br />TeddyPups
              </h2>
            </div>

            {/* Mascot Dock at the Booklet Center Bottom */}
            <div className="passport-dog-seat" aria-hidden="true" />

            {/* Right Page: 2x2 Official Stamps Grid */}
            <div className="passport-page passport-page-right">
              <div className="stamps-grid-2x2">
                {/* Stamp 1: Vet-checked & Healthy (Circular Double-Ring) */}
                <div className="passport-stamp-cell">
                  <div className="passport-stamp stamp-vet-healthy">
                    <div className="stamp-inner-ring">
                      <ShieldCheck size={22} className="stamp-icon" />
                      <span className="stamp-title-text">Vet-checked &amp; healthy</span>
                    </div>
                  </div>
                  <p className="stamp-explanation">
                    Every puppy comes vaccinated, dewormed, and with a verified health certificate.
                  </p>
                </div>

                {/* Stamp 2: Korea to Dubai, Safely (Green Dashed Rounded Rectangle) */}
                <div className="passport-stamp-cell">
                  <div className="passport-stamp stamp-korea-dubai">
                    <div className="stamp-inner-dashed">
                      <Plane size={22} className="stamp-icon" />
                      <span className="stamp-title-text">Korea to Dubai, safely</span>
                    </div>
                  </div>
                  <p className="stamp-explanation">
                    Trusted breeders, safe travel, and premium care from start to finish.
                  </p>
                </div>

                {/* Stamp 3: Support 24/7 (Double Oval Stamp) */}
                <div className="passport-stamp-cell">
                  <div className="passport-stamp stamp-support-oval">
                    <div className="stamp-inner-oval">
                      <MessageCircle size={20} className="stamp-icon" />
                      <span className="stamp-title-text">Support 24/7</span>
                    </div>
                  </div>
                  <p className="stamp-explanation">
                    Always here to help, from choosing your puppy to post-delivery support.
                  </p>
                </div>

                {/* Stamp 4: Trusted by Families Worldwide (Scalloped Serrated Seal) */}
                <div className="passport-stamp-cell">
                  <div className="passport-stamp stamp-families-seal">
                    <div className="stamp-inner-scallop">
                      <Globe size={22} className="stamp-icon" />
                      <span className="stamp-title-text">Trusted by families worldwide</span>
                    </div>
                  </div>
                  <p className="stamp-explanation">
                    Puppies delivered to loving homes all around the world.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CONTINUOUS DARK CHOCOLATE WRAPPER FOR SECTIONS 5, 6, 7 & FOOTER
          (Eliminates white breaks; background seamlessly continues to page bottom)
          ========================================================================= */}
      <div className="chocolate-night-zone">
        {/* =======================================================================
            5. HAPPY FAMILIES & PUPPIES (SUNSET SKYLINE + POLAROID WALL + MINI DOOR)
            ======================================================================= */}
        <section data-journey-scene="families" className="families-night-scene">
          {/* Sunset Skyline Silhouette with Glowing Half-Sun */}
          <div className="sunset-skyline-wrap" aria-hidden="true">
            <div className="skyline-silhouette-buildings" />
            <div className="sunset-glowing-half-sun" />
          </div>

          <div className="families-header-content container">
            <div className="families-header-left">
              <h2 className="font-display families-title">Happy families &amp; puppies</h2>
              <p className="families-lead-desc">
                We are truly honored to see our puppies become cherished members of loving families. These heartwarming moments have been shared by our valued clients who welcomed a Teddy Pup into their homes and hearts.
              </p>
            </div>

            {/* Client Testimonial Quote Bubble */}
            <div className="testimonial-quote-bubble">
              <p className="testimonial-quote-text">
                &ldquo;TeddyPups truly made our dream a reality. They supported us at every step of the import journey. Our Maltipoo arrived healthy, cheerful, and absolutely perfect. Having 24/7 support throughout the process gave us complete peace of mind.&rdquo;
              </p>
              <cite className="testimonial-author">Sarah M., Dubai, UAE</cite>
            </div>
          </div>

          {/* Dark Wood Plank Photo Wall with 4 Taped Polaroids */}
          <div className="dark-wood-gallery-wall">
            <div className="gallery-polaroid-row">
              {/* Polaroid 1: Young boy holding golden puppy */}
              <div className="polaroid-pin-card">
                <div className="polaroid-tape-tab" />
                <div className="polaroid-img-frame">
                  <img
                    src="https://puppy.instabizweb.com/_next/image?url=%2Fmedia%2FdI8Jv0KRTiLJ%2Fd2d7e5375b%2F27b888_7d940ce5701f48d98327e4a242b53ac4-mv2.jpg&w=3840&q=75"
                    alt="Happy boy with new puppy"
                  />
                </div>
                <p className="polaroid-caption">New puppy 🐶🥰</p>
              </div>

              {/* Polaroid 2: Gang of 3 Pomeranians */}
              <div className="polaroid-pin-card">
                <div className="polaroid-tape-tab" />
                <div className="polaroid-img-frame">
                  <img
                    src="https://puppy.instabizweb.com/_next/image?url=%2Fmedia%2FTI-WtaFssfQt%2Fc41fb2a387%2F27b888_15920f828b864dd1b44b98ec4e964c53-mv2.jpg&w=3840&q=75"
                    alt="Gang of 3 Pomeranians"
                  />
                </div>
                <p className="polaroid-caption">Gang of 3 🐶🥰</p>
              </div>

              {/* Polaroid 3: Person holding 3 fluffy puppies */}
              <div className="polaroid-pin-card">
                <div className="polaroid-tape-tab" />
                <div className="polaroid-img-frame">
                  <img
                    src="https://puppy.instabizweb.com/_next/image?url=%2Fmedia%2Fj6T9eswP2eS8%2F59c6879a1d%2F27b888_bc27df54dcce410196c6016475364ff3-mv2.jpg&w=3840&q=75"
                    alt="So happy with three puppies"
                  />
                </div>
                <p className="polaroid-caption">So happy 🇦🇪</p>
              </div>

              {/* Polaroid 4: Young girl cuddling puppy */}
              <div className="polaroid-pin-card">
                <div className="polaroid-tape-tab" />
                <span className="polaroid-ig-tag">@teddypups.official 💖</span>
                <div className="polaroid-img-frame">
                  <img
                    src="https://puppy.instabizweb.com/_next/image?url=%2Fmedia%2FHJgL4rRnmReV%2F533701358f%2F27b888_082e47dfd8144423a96dc70d966fa5b2-mv2.jpg&w=3840&q=75"
                    alt="Girl cuddling new puppy"
                  />
                </div>
                <p className="polaroid-caption">New pup 🥰💫</p>
              </div>
            </div>

            {/* Gallery Floor Line with Street Light & Miniature Arched Door */}
            <div className="gallery-floor-base">
              {/* Vintage Street Lantern Post */}
              <div className="street-lantern-post" aria-hidden="true">
                <div className="lantern-globe-glow" />
                <div className="lantern-metal-pole" />
              </div>

              {/* Miniature Arched Wooden Door */}
              <div className="family-mini-door" aria-hidden="true">
                <div className="mini-door-leaf" />
              </div>

              {/* "See every happy family" Button */}
              <Link to="/happy-families" className="families-browse-btn">
                See every happy family
              </Link>
            </div>
          </div>
        </section>

        {/* =======================================================================
            6. QUESTIONS, ANSWERED (GOLD SPARKLES, DOCK WITH FLOATING ?, 3 FAQS)
            ======================================================================= */}
        <section data-journey-scene="faq" className="faq-chocolate-section">
          <div className="faq-sparkles-backdrop" aria-hidden="true">
            <span className="sparkle-star s1">✦</span>
            <span className="sparkle-star s2">✦</span>
            <span className="sparkle-star s3">✦</span>
            <span className="sparkle-star s4">✦</span>
            <span className="sparkle-star s5">✦</span>
          </div>

          <div className="faq-layout container">
            {/* Left Column: Heading + Read All Questions Button + Floating ? Dock */}
            <div className="faq-heading-col">
              <h2 className="font-display faq-main-title">
                Questions,<br />answered
              </h2>
              <Link to="/faq" className="faq-pill-btn">
                Read all questions
              </Link>

              {/* Dog mascot station with floating question mark */}
              <div className="faq-mascot-dock">
                <span className="floating-question-bubble font-hand" aria-hidden="true">
                  ?
                </span>
              </div>
            </div>

            <div className="faq-items-col">
              <FAQList limit={3} />
            </div>
          </div>
        </section>

        {/* =======================================================================
            7. READY TO MEET YOUR NEW BEST FRIEND? (HOUSE FACADE + BASKET)
            ======================================================================= */}
        <section data-journey-scene="final" className="final-welcome-section">
          <div className="final-content container">
            <h2 className="font-display final-welcome-title">
              Ready to meet your<br />new best friend?
            </h2>
            <p className="final-welcome-desc">
              Bring home a healthy, happy teacup or designer puppy with expert guidance every step of the way. We help you find the right match and ensure a smooth, safe delivery across the UAE.
            </p>

            {/* House Front Porch Facade with Open Door & Puppy Inside */}
            <div className="house-facade-porch">
              <div className="house-wood-wall">
                {/* Arched Doorway */}
                <div className="house-door-arch">
                  <div className="house-door-leaf-swung">
                    <div className="house-door-peephole" />
                  </div>
                  <div className="house-door-interior">
                    <img
                      src="https://puppy.instabizweb.com/_next/image?url=%2Fmedia%2FZ0ToauDx7Eve%2F5fffe4d022%2Fb942a5_4b8cfb8204d24eadaf524332aba1dc15-mv2.webp&w=3840&q=75"
                      alt="Puppy waiting inside"
                      className="house-puppy-photo"
                    />
                  </div>
                  <div className="welcome-home-mat font-hand">welcome home</div>
                </div>

                {/* Porch Lamp & Plant */}
                <div className="porch-fixtures" aria-hidden="true">
                  <div className="porch-sconce-light" />
                  <div className="porch-plant-pot">
                    <span className="plant-leaf l1" />
                    <span className="plant-leaf l2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Final WhatsApp & Contact Action Buttons */}
            <div className="final-porch-actions">
              <a
                href="https://wa.me/919898124987?text=Hi%20TeddyPups%2C%20I'd%20like%20to%20know%20more%20about%20your%20puppies."
                className="final-wa-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                Enquire on WhatsApp
              </a>
              <Link to="/contact" className="final-visit-btn">
                Visit &amp; contact
              </Link>
            </div>

            {/* Cozy Wicker Basket Sitting Area on the Left */}
            <div className="final-basket-wrap">
              <BasketScene />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
