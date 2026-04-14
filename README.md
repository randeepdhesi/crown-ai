# Crown AI — Crown Building Supplies Internal Assistant

A branded AI-powered product assistant for Crown Building Supplies' sales team.

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Add your Anthropic API key
```bash
cp .env.local.example .env.local
```
Edit `.env.local` and add your key:
```
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push to a GitHub repo
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Add environment variable: `ANTHROPIC_API_KEY`
4. Deploy — done

### Custom Domain
In Vercel dashboard → Settings → Domains → Add `crownbuilding.ai` (or your domain)

## What's Included

- **Branded chat interface** with Crown's colors and logo
- **Product knowledge base** covering:
  - Full NewTechWood siding catalog with pricing (Norwegian Fluted, Belgian Fluted, Flat Siding, trims, accessories)
  - CGC/National Gypsum drywall products
  - ROCKWOOL, Johns Manville, Owens Corning insulation
  - All 6 Crown locations with contact details and hours
  - Company info and shipping policies
- **Streaming responses** via Claude API
- **Mobile responsive** design
- **Suggested questions** for first-time users

## Expanding the Knowledge Base

Edit `lib/system-prompt.ts` to add more product data, PDF catalog info, or company policies.

## Tech Stack
- Next.js 14 (App Router)
- Tailwind CSS
- Anthropic Claude API (claude-sonnet-4-20250514)
- TypeScript
