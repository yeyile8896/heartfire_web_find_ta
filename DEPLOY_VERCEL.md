# Deploy Find TA on Vercel

This is the recommended deployment path for the Heartfire website setup.

## Runtime

- Vercel project connected to `yeyile8896/heartfire_web_find_ta`
- Node.js runtime
- Upstash Redis for persistent Find TA room data

## Required Environment Variables

Create an Upstash Redis database through Vercel Marketplace, then add these Vercel environment variables for Production, Preview, and Development:

```text
UPSTASH_REDIS_REST_URL=<upstash-rest-url>
UPSTASH_REDIS_REST_TOKEN=<upstash-rest-token>
```

Vercel Marketplace may generate prefixed variables instead. The app also supports:

```text
UPSTASH_REDIS_REST_KV_REST_API_URL=<upstash-rest-url>
UPSTASH_REDIS_REST_KV_REST_API_TOKEN=<upstash-rest-token>
```

Optional:

```text
FIND_TA_REDIS_KEY=heartfire:find-ta:rooms
```

If the Upstash variables are not present, local development falls back to `.local-data/find-ta-rooms.json`. On Vercel, the activity APIs require Upstash because the server filesystem is not persistent.

## Deploy

```bash
npm install
npm run build
```

Push to `main`, or trigger a Vercel deployment from the project dashboard.

## Activity URLs

- Host entry: `/find-ta/host`
- Camper join entry: `/find-ta/join/[room-code]`
- Lobby screen: `/find-ta/screen/[room-code]`
- Host room URL is generated after the host creates a room.

## Data Notes

Find TA room data is stored as a JSON payload in Redis under `FIND_TA_REDIS_KEY`. Write operations use a short Redis lock to reduce the chance of concurrent joins overwriting each other during check-in.
