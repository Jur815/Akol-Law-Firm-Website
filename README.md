# Akol For Legal Services Website

Production website for Akol For Legal Services.

## Local Development

```bash
npm install
npm run dev
```

## Required Vercel Environment Variables

Create these variables in the Vercel project settings before deploying:

```bash
RESEND_API_KEY=
CONTACT_RECIPIENT_EMAIL=info2026akollegalservices@gmail.com
CONTACT_FROM_EMAIL=
```

`CONTACT_FROM_EMAIL` must be a sender address on a domain verified in Resend. `CONTACT_RECIPIENT_EMAIL` is the inbox that receives website contact form submissions; if it is not configured, the API defaults to `info2026akollegalservices@gmail.com`.

## Contact Form

The contact form posts to `/api/contact`, a Vercel serverless function. The API validates all submitted fields, checks a honeypot field, applies basic rate limiting, and sends mail through Resend without exposing the API key to frontend code.

## Production Checks

```bash
npm run lint
npm test
npm run build
```
