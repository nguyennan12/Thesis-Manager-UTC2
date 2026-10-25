# Deploy UTC2-DAMS to Vercel and Render

This setup is for a temporary demonstration environment. It uses Vercel Hobby for the Next.js frontend, a free Render Docker web service for the NestJS API, and Render Key Value for Redis. The Blueprint expects a PostgreSQL `DATABASE_URL` and frontend `APP_URL` to be provided as secrets during setup.

## Vercel frontend

Create a Vercel project from this repository with:

- Root Directory: `apps/frontend`
- Framework preset: Next.js
- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm --filter frontend build`
- Environment variable `NEXT_PUBLIC_API_URL`: `https://<Render API hostname>/api/v1`

In **Settings → Deployment Protection**, enable Vercel Authentication for **All Deployments**, including production. This keeps the demo private while staying on the free plan.

Enable access to files outside the root directory so the pnpm workspace and shared packages are available. After the first deployment, copy the Vercel production origin (without a trailing slash) into the Render API's `APP_URL` value and redeploy the API.

## Render backend

Create a Render Blueprint from the repository root using `render.yaml`. It creates a free Redis-compatible Key Value service and a free Docker web service in Singapore. The service runs Prisma migrations before starting the compiled API and seeds demo records once after the first successful deployment.

Set `DATABASE_URL` to a PostgreSQL connection string for a database you control. For a no-cost demo that can keep data past 30 days, Neon Free currently includes 1 GB per project and 100 compute-hours per month. Use the pooled connection string if the provider supplies one.

Set `APP_URL` to the Vercel production origin. Render also generates independent JWT secrets for the API.
Render generates private passwords for seeded accounts and newly provisioned accounts. Keep them out of source control and deployment logs.

## Limitations

- Render Free web services sleep after 15 minutes without traffic and can take about a minute to wake.
- Free Render Key Value is in-memory and loses data on restart. This deployment uses it for cache/session state only.
- File uploads are disabled in production until durable private object storage is configured. Do not use this deployment for real student records or important submissions.
- Vercel Hobby is intended for personal, non-commercial use. Render Free and Neon Free are for demos/prototyping, without production availability guarantees.
