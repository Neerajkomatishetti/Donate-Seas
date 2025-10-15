# DonateOS v1

A full-stack donation management platform:

- Backend: Cloudflare Workers + Hono, Prisma (Accelerate) with PostgreSQL
- Frontend: Next.js 15 App Router, Tailwind CSS, Radix UI

## Monorepo Structure

```
Donate-Seas/
  backend/        # Cloudflare Worker API (Hono + Prisma)
  donate-os/      # Next.js frontend
```

## Features

- Email/password auth with JWT
- Create and list donations; admin approval flow
- User profile endpoint (`/api/v1/me`)
- Carousel of top donations

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL database (or a Prisma Accelerate connection)
- Cloudflare account with Wrangler CLI for backend

## Quick Start

### 1) Install dependencies

```bash
cd Donate-Seas/backend && npm install
cd ../donate-os && npm install
```

### 2) Environment & Config

Backend uses Cloudflare Worker `wrangler.jsonc` vars and Prisma `DATABASE_URL` in `prisma/schema.prisma`.

Required values:

- ACC_DATABASE_URL: Prisma Accelerate (or direct) connection string
- JWT_SECRET: secret for signing JWTs

Set them in `Donate-Seas/backend/wrangler.jsonc` under `vars`.

Frontend usually needs the backend base URL; set as needed via env or constants in your components/services (e.g., `axios` base URL).

### 3) Run in development

- Backend (Cloudflare Worker):

```bash
cd Donate-Seas/backend
npm run dev
```

This runs `wrangler dev` locally.

- Frontend (Next.js):

```bash
cd Donate-Seas/donate-os
npm run dev
```

App will be on `http://localhost:3000`.

### 4) Build/Deploy

- Backend:

```bash
cd Donate-Seas/backend
npm run deploy
# optional typegen for bindings
npm run cf-typegen
```

- Frontend:

```bash
cd Donate-Seas/donate-os
npm run build
npm start
```

Deploy the frontend to your host of choice (e.g., Vercel).

## Backend

- Framework: Hono
- Entry: `Donate-Seas/backend/src/index.ts`
- Routes mounted under `/api/v1/*`

### Auth

- JWT is returned on signup/signin and must be sent in `Authorization` header for protected routes.

### Endpoints

Base: `<worker-url>/api/v1`

- POST `/user/Signup`

  - body: `{ email, password, name }`
  - returns: `{ token, isAdmin }`

- POST `/user/Signin`

  - body: `{ email, password }`
  - returns: `{ token, isAdmin }`

- GET `/me/`

  - headers: `Authorization: <jwt>`
  - returns: `{ user: { id, name, userDonations } }`

- POST `/donate/`

  - headers: `Authorization: <jwt>`
  - body: `{ name?, amount, imgurl, Status, createdAt }`
  - returns: `{ message, id }`

- GET `/donate/mydonations`

  - headers: `Authorization: <jwt>`
  - returns: `{ donations: Donation[] }`

- GET `/donate/bulk`

  - returns: all donations

- PUT `/donate/Approve`

  - headers: `Authorization: <jwt>` (admin required)
  - body: `{ data: { id } }`
  - returns: `{ message }`

- GET `/carousal/`
  - returns: top 5 donations `{ topDonations }`

### Database (Prisma)

Models in `Donate-Seas/backend/prisma/schema.prisma`:

- `User`: id, email, name, password, isAdmin, userDonations
- `Donation`: id, name?, amount, imgurl, Status, createdAt, authorId
- `BankAccount`: id, accountHolder, accountNumber, bankName, ifscCode, createdAt

Client generated to `src/generated/prisma`.

## Frontend

- Next.js 15 (App Router)
- Dev: `npm run dev` (Turbopack)
- Build: `npm run build`

Key pages:

- `app/Donate/page.tsx` – create donations
- `app/DonationStatus/page.tsx` – status display
- `app/Admin/Donations/page.tsx` – admin approval
- `app/Admin/Account/page.tsx` – bank account settings
- `app/Auth/Signup` and `app/Auth/Signin` – auth

## Scripts

Backend (`Donate-Seas/backend/package.json`):

- `dev`: wrangler dev
- `deploy`: wrangler deploy --minify
- `cf-typegen`: wrangler types --env-interface CloudflareBindings

Frontend (`Donate-Seas/donate-os/package.json`):

- `dev`: next dev --turbopack
- `build`: next build --turbopack
- `start`: next start
- `lint`: eslint

## Security Notes

- Never commit real secrets in `wrangler.jsonc` (rotate if present).
- Use HTTPS for production and secure JWT handling.

## License

MIT
