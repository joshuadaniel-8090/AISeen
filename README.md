# AISeen

Track whether your brand appears in AI-generated answers from ChatGPT, Perplexity, and Google AI Overviews.

## Quick Start

```bash
cp .env.example .env.local
# Fill in all values in .env.local

npm install
# Run the DB migration against your Neon database:
psql $DATABASE_URL -f migrations/001_init.sql

npm run dev           # Next.js on :3000

cd fastapi-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

## Tech Stack

- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: FastAPI + Python 3.11
- **Database**: PostgreSQL via Neon (serverless)
- **Auth**: NextAuth v5 magic-link (Resend)
- **Payments**: Stripe Checkout + webhooks
- **AI engines**: OpenAI gpt-4.1-nano, Perplexity Sonar, DataForSEO (Google AIO)
- **Scheduling**: APScheduler (inside FastAPI, daily cron at 06:00 IST)

## Deployment (Oracle Cloud Ampere A1)

```bash
npm run build
pm2 start "npm run start" --name aiseen-web
pm2 start "uvicorn main:app --host 0.0.0.0 --port 8001" \
  --name aiseen-api --interpreter python3 --cwd fastapi-service
```

Configure Nginx to reverse-proxy `:443 → :3000` and `/api/py/* → :8001`.

## Pricing

| Plan | Price | Prompts | Engines | History |
|------|-------|---------|---------|---------|
| Free | $0 | 3 | ChatGPT | 7 days |
| Indie | $19/mo | 25 | All 3 | 7 days |
| Pro | $49/mo | 100 | All 3 | 30 days |
