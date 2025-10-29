## Ticketing Platform Monorepo

Full‑stack event ticketing platform with dynamic pricing.

### Stack
- Monorepo: Turborepo + pnpm workspaces
- Frontend: Next.js 15 (App Router, RSC), Tailwind CSS
- Backend: NestJS
- ORM: Drizzle ORM (PostgreSQL)
- DB Client: postgres.js
- Language: TypeScript (strict)

### Apps & Packages
- `apps/web` – Next.js frontend
- `apps/api` – NestJS API
- `packages/database` – Drizzle schema, client, seeds, migrations
- `packages/ui` – Shared UI components
- `packages/eslint-config`, `packages/typescript-config` – Shared config

---

## Prerequisites
- Nest.js
- Next.js 15
- pnpm 9+
- Git
- PostgreSQL 14+ (local or remote)
---

## Quick Start
```bash
# 1)Clone repo
git clone https://github.com/tharsh95/ticketing-platform-monorepo-main.git && cd ticketing-platform-monorepo &&  pnpm install
```
```bash
# 2) Configure environment
# Create a root .env if needed (API reads from repo root)
echo "PORT=3001" > .env
```
```bash
# Also create packages/database/.env with your DB URL
mkdir -p packages/database
echo "DATABASE_URL=postgresql://user@localhost:5432/ticketing_platform" > packages/database/.env
```
```bash
# 3) Create database (example)
createdb ticketing_platform || true
```
```bash
# 4) Push schema & seed data (database package)
pnpm -C packages/database run db:push && pnpm -C packages/database run db:seed
```
```bash
# 5) Build everything
pnpm run build
```
```bash
# 6) Run all apps in dev
pnpm run dev
```

# Tests (API)
```bash
cd apps/api && npm run test
```

### After running tests the db is cleared so you need to run this command again
```bash
pnpm -C packages/database run db:seed
```

## Environment Variables
Required
- `DATABASE_URL` – Postgres connection string
- `PORT` (API, default 3001)

Dynamic Pricing (optional)
- `PRICE_WEIGHT_TIME`, `PRICE_WEIGHT_DEMAND`, `PRICE_WEIGHT_INVENTORY`
- `DEMAND_THRESHOLD`, `INVENTORY_THRESHOLD`
- `PRICE_FLOOR`, `PRICE_CEILING`

Frontend
- `NEXT_PUBLIC_API_URL` – defaults to `http://localhost:3001`


---

## Database (Drizzle)
Useful scripts (database package):
```bash
pnpm -C packages/database run db:generate   # generate
pnpm -C packages/database run db:push       # push
pnpm -C packages/database run db:migrate    # migrate
pnpm -C packages/database run db:studio     # studio
pnpm -C packages/database run db:seed       # tsx src/seed.ts
```

---

## API Overview
Events
- `GET /events` – list with current price
- `GET /events/:id` – single event with pricing breakdown
- `GET /events/seed` – seed sample events

Bookings
- `POST /booking` – create booking (uses dynamic price at booking time)
- `GET /booking/user/:email` – bookings by user email (includes current price)

Analytics
- `GET /analytics/events/:eventId` - Analytics for a event
- `GET /analytics/summary` - System Wide Analytics
---

## Frontend
- Events list and detail with pricing breakdown
- Booking modal using Server Actions
- My Bookings page with price paid vs current price
- Seed button on Events page when empty

---

## Scripts (root)
```bash
pnpm dev        # run all dev servers
pnpm build      # build all
pnpm lint       # lint all
```

---

## License
For assignment/evaluation purposes.


