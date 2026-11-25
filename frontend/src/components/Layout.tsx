import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PawPrint, X, Phone, MessageCircle } from 'lucide-react';
import { wa } from '../lib/api';

const links = [
  ['Home', '/'],
  ['Puppies', '/puppies'],
  ['Happy families', '/happy-families'],
  ['How it works', '/how-it-works'],
  ['FAQ', '/faq'],
  ['Visit & contact', '/contact'],
];

export function Logo() {
  return (
    <Link className="tp-header__brand" to="/" aria-label="TeddyPups home">
      <img
        src="https://puppy.instabizweb.com/_next/image?url=%2Fbrand%2Flogo.png&w=128&q=75"
        width="46"
        height="46"
        className="tp-header__logo"
        alt="TeddyPups logo"
      />
      <span className="font-display tp-header__name">TeddyPups</span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => setOpen(false), [loc]);

  useEffect(() => {
    if (!open) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const escape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', escape);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener('keydown', escape);
    };
  }, [open]);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="tp-header" id="site-header">
        <div className="tp-header__bar">
          <Logo />
          <nav aria-label="Main navigation" className="tp-header__nav">
            <ul>
              {links.map(([text, path]) => (
                <li key={path}>
                  <NavLink
                    end={path === '/'}
                    to={path}
                    className={({ isActive }) => `tp-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <span>{text}</span>
                    <svg viewBox="0 0 64 64" className="tp-nav-link__paw" aria-hidden="true" fill="currentColor">
                      <path d="M32 30.5c-7.6 0-15.6 8.3-15.6 15.5 0 5.4 4.2 8.3 9.2 8.3 2.6 0 4.5-1.1 6.4-1.1s3.8 1.1 6.4 1.1c5 0 9.2-2.9 9.2-8.3 0-7.2-8-15.5-15.6-15.5zM19.28 26.71C21.07 30.08 20.42 33.92 17.84 35.29C15.25 36.67 11.71 35.05 9.92 31.69C8.13 28.32 8.78 24.48 11.36 23.11C13.95 21.73 17.49 23.35 19.28 26.71ZM29.62 15.64C30.32 19.62 28.46 23.26 25.47 23.79C22.48 24.32 19.48 21.53 18.78 17.56C18.08 13.58 19.94 9.94 22.93 9.41C25.92 8.88 28.92 11.67 29.62 15.64ZM45.22 17.56C44.52 21.53 41.52 24.32 38.53 23.79C35.54 23.26 33.68 19.62 34.38 15.64C35.08 11.67 38.08 8.88 41.07 9.41C44.06 9.94 45.92 13.58 45.22 17.56ZM54.08 31.69C52.29 35.05 48.75 36.67 46.16 35.29C43.58 33.92 42.93 30.08 44.72 26.71C46.51 23.35 50.05 21.73 52.64 23.11C55.22 24.48 55.87 28.32 54.08 31.69Z" />
                    </svg>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="tp-header__actions">
            <a
              href="https://wa.me/919898124987?text=Hi%20TeddyPups%2C%20I'd%20like%20to%20know%20more%20about%20your%20puppies."
              className="tp-whatsapp-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp us
            </a>
            <button
              className="tp-menu-toggle md-hidden"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X size={20} /> : <PawPrint size={18} />}
              <span>Menu</span>
            </button>
          </div>
        </div>

        {/* Scalloped hem beneath the header bar */}
        <svg aria-hidden="true" className="tp-header__hem" width="100%" height="14" preserveAspectRatio="none">
          <defs>
            <pattern id="tp-hem-pattern" width="44" height="14" patternUnits="userSpaceOnUse">
              <path d="M0 0H44V2A22 11 0 0 1 0 2Z" className="tp-header__hem-fill" />
              <path d="M0 2A22 11 0 0 0 44 2" className="tp-header__hem-line" />
            </pattern>
          </defs>
          <rect width="100%" height="14" fill="url(#tp-hem-pattern)" />
        </svg>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="menu-panel"
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            onClick={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.48, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="menu-inner">
              <span className="hand">where to, friend?</span>
              <nav aria-label="Menu">
                {links.map(([t, p], i) => (
                  <motion.div key={p} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.055 }}>
                    <NavLink to={p} onClick={() => setOpen(false)}>
                      {t}
                      <span>↗</span>
                    </NavLink>
                  </motion.div>
                ))}
              </nav>
              <a
                href={wa()}
                className="tp-whatsapp-btn"
                style={{ display: 'inline-flex', width: '100%', justifyContent: 'center' }}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp us
              </a>
              <p>+971 50 000 0000</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Footer() {
  return (
    <>
      <footer className="tp-footer-chocolate">
        <div className="footer-top">
          <div>
            <span className="hand">Home, at last.</span>
            <Logo />
            <p>Miniature companions in Dubai, with care for every journey home.</p>
          </div>
          <div>
            <h3>Explore</h3>
            {[...links.slice(1), ['Gone home', '/gone-home'], ['Delivery & collection', '/how-it-works#delivery']].map(([t, p]) => (
              <Link key={p} to={p}>{t}</Link>
            ))}
          </div>
          <div>
            <h3>Say hello</h3>
            <a href={wa()}>WhatsApp +971 50 000 0000</a>
            <a href="tel:+971500000000">+971 50 000 0000</a>
            <p>Downtown Dubai, United Arab Emirates</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 TeddyPups U.A.E.</span>
          <span className="hand">every puppy is family ♡</span>
        </div>
      </footer>
      <div className="mobile-contact">
        <a href={wa()}><MessageCircle size={18} /> WhatsApp us</a>
        <a href="tel:+971500000000"><Phone size={18} /> Call</a>
      </div>
    </>
  );
}
