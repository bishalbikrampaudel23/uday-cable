# Udaya Cable Network Pvt. Ltd.

A production-ready secure web application scaffold for an ISP operating in Syangja, Nepal.

## Run locally

1. Install dependencies: npm install
2. Create a PostgreSQL database and set DATABASE_URL.
3. Apply the schema: psql "$DATABASE_URL" -f server/sql/schema.sql
4. Seed the initial data: npx tsx server/src/seed.ts
5. Start the app: npm run dev

## Security highlights

- Helmet security headers
- Strict CORS policy
- Rate limiting on public endpoints
- Parameterized PostgreSQL queries
- Sanitized lead and ticket input
- HttpOnly, SameSite=Strict cookie ready backend design
- Production PostgreSQL TLS verifies server certificates; set `PG_SSL_CA` when using a private CA.
