# CarVision Website

A modern marketing and public inventory website for the Car Management System, built with **Next.js** and **Tailwind CSS**.

## Pages

- **Home** — Hero, featured cars, feature highlights, CTA
- **Inventory** (`/cars`) — Browse cars from the Laravel API with search & pagination
- **Car Detail** (`/cars/[id]`) — Full vehicle specs and photo gallery
- **Features** — Platform capabilities and tech stack
- **About** — Mission and values
- **Contact** — Contact form and info

## Getting Started

```bash
cd website
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_CMS_API_URL` | Headless CMS API base URL | `http://127.0.0.1:8000/api` |
| `NEXT_PUBLIC_CMS_SITE_KEY` | Organization site key (`X-Headless-Site-Key`) | _(required for CMS content)_ |
| `NEXT_PUBLIC_API_URL` | Cars / inventory API base URL | `https://backend.dreamagentcarvision.com/api` |
| `NEXT_PUBLIC_APP_URL` | Dealer app URL (login) | `https://dreamagentcarvision.com` |

Marketing pages (home copy, about, contact, career, nav, site settings) load from the headless CMS. **Car inventory stays on the cars API** and is not stored in the CMS.

### CMS admin (Dream Agent Car Vision org)

After seeding `CarVisionOrganizationSeeder` in `headless-engine`:

- Admin: `admin@dreamagentcarvision.local` / `password`
- Platform super admin: `superadmin@headless.local` / `password`

```bash
cd ../headless-engine
php artisan db:seed --class=CarVisionOrganizationSeeder
```

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS 3
- TypeScript
- Lucide React icons
- Headless CMS (`headless-engine`) for marketing content

## Project Structure

```
website/
├── src/
│   ├── app/           # Pages (App Router)
│   ├── components/    # Reusable UI components
│   ├── config/        # Fallback site configuration
│   └── lib/           # Cars API client, CMS client, types
└── public/            # Static assets
```

## Requirements

- Node.js 18+
- Running `headless-engine` when using CMS content
