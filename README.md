# TeddyPups — React + FastAPI reconstruction

Reference: https://puppy.instabizweb.com/ (public page structure inspected November 24, 2026). This is a clean-room, independently implemented approximation, not a verified pixel-perfect copy. Rendered CSS, exact fonts, original SVG and live animation curves were unavailable. The original dog is replaced by a custom, rigged SVG. The cursor and route motion are approximations, not recordings of the source. Puppy data is a dated reference snapshot, not real-time inventory. The initial 15 profile covers and eight family photos use observed reference-host image URLs (remote availability required); other adopted and profile media require import. Never publish the brand, images, customer photos or videos without authorization. Replace placeholder contact details before release.

## Start on macOS with Docker

```sh
cp .env.example .env
docker compose up --build -d
```

Open http://localhost:5173. API docs: http://localhost:8000/docs. Stop with `docker compose down` (database persists in pgdata). The password in .env.example is only for local development.

## Optional authorized image import

```sh
python3 scripts/sync_media.py --authorized
docker compose up --build -d
```

The script requires internet access and permission to reuse the assets. It attempts to fetch public image/video tags, downloads media locally, and updates the JSON manifests. Client-rendered, lazy-loaded, or inaccessible media may require manual export. It does not fetch reference JavaScript or submit any forms. Inspect the resulting media mapping before publishing. Add or edit media in `backend/app/data/*.json`; local URLs resolve from `frontend/public/`. Restart/rebuild the API after catalogue changes because manifests are cached. Without import, missing images show clearly labeled placeholders.

## Local development (no Docker)

Terminal 1:
```sh
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Terminal 2:
```sh
cd frontend
npm install
npm run dev
```

The Vite proxy routes `/api` to port 8000. SQLite stores enquiries locally; Compose uses PostgreSQL. Contact forms persist enquiries, but do not send email or WhatsApp messages automatically. Configure notification integration and admin workflows separately. The displayed phone is a placeholder, and the WhatsApp target is configurable using VITE_WHATSAPP_NUMBER. Update display/contact links in Layout and Contact before going live.

## Architecture

- `frontend/src/app`: application shell, lazy routes, animated navigation.
- `frontend/src/motion`: GSAP scroll trigger, Lenis smooth scrolling, rigged SVG dog, pointer follower, reduced-motion support.
- `frontend/src/features`: home, catalogue and profiles, family gallery, FAQ, how it works, contact.
- `frontend/src/components`: shared layout, buttons, imagery and loading states.
- `frontend/src/styles`: CSS design tokens, responsive grids and component styles.
- `backend/app/api`: versioned catalogue and enquiry endpoints.
- `backend/app/services`: catalogue repository layer (JSON seed data, can migrate to DB/CMS).
- `backend/app/core`: database session and configuration.

## Checks

```sh
cd backend
pip install pytest httpx
DATABASE_URL=sqlite:///./test-enquiries.db python -m pytest -q
```

Frontend: `npm run build`; with both services running, `npx playwright install chromium` then `npm run test:e2e`. These tests cover responsive width, navigation and FAQ interaction. For pixel matching, obtain source screenshots at 1440, 1024, 768, 390 and 360 pixels, capture equivalent pages with Playwright, and compare screenshot overlays. Capture live cursor behavior and route/scroll recordings to tune the dedicated animation modules. Actual visual parity and frontend build must be verified in a network-enabled environment.

## Production hardening

Use a managed PostgreSQL database and Alembic migrations before scaling across replicas (currently table creation is for development). Move catalogue records to a CMS or DB for editing and pagination; deliver authorized media through a CDN, add API rate limiting, anti-spam checks, authenticated admin access, privacy/retention policy, backups, TLS and notification delivery. Do not run the example contact endpoint publicly without these protections. The application separates presentation, motion, data access and domain services so those upgrades do not require rewriting page components.
