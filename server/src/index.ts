import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { z } from 'zod';
import sanitizeHtml from 'sanitize-html';
import { query } from './db.js';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 5000);

app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(
  cors({
    origin: ['https://udayacable.com.np', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

const leadSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().regex(/^[0-9+\-()\s]{7,15}$/),
  coverageAreaId: z.string().uuid(),
  selectedPackageId: z.string().uuid(),
  clientIp: z.string().max(64).optional()
});

const ticketSchema = z.object({
  customerName: z.string().trim().min(2).max(120),
  accountId: z.string().trim().max(64),
  phone: z.string().trim().regex(/^[0-9+\-()\s]{7,15}$/),
  issueType: z.string().trim().min(2).max(64),
  description: z.string().trim().min(10).max(2000)
});

const stripHtml = (value: string) =>
  sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
    textFilter: (text: string) => text
  });

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.get('/api/packages', (_req, res) => {
  res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
  res.json([
    {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Fiber Home 100',
      speed_mbps: 100,
      price_monthly: 1044,
      installation_charge: 500,
      router_rental: 500,
      type: 'internet_solo',
      features: ['Dual-band router', 'Mesh support', 'Free onboarding']
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Corporate 300',
      speed_mbps: 300,
      price_monthly: 2500,
      installation_charge: 1000,
      router_rental: 1000,
      type: 'corporate',
      features: ['Static IP', 'Priority support', 'Business SLA']
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      name: 'TV Combo 200',
      speed_mbps: 200,
      price_monthly: 1800,
      installation_charge: 700,
      router_rental: 700,
      type: 'tv_combo',
      features: ['iTV ready', 'Wi-Fi mesh', 'Entertainment bundle']
    }
  ]);
});

app.post('/api/leads', async (req, res) => {
  try {
    const parsed = leadSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid lead information.' });
    }

    const { fullName, phone, coverageAreaId, selectedPackageId, clientIp } = parsed.data;
    await query(
      'INSERT INTO leads (id, full_name, phone, coverage_area_id, selected_package_id, status, ip_address, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      [
        crypto.randomUUID(),
        stripHtml(fullName),
        stripHtml(phone),
        coverageAreaId,
        selectedPackageId,
        'new',
        clientIp ? stripHtml(clientIp) : null,
        new Date()
      ]
    );

    return res.status(201).json({ message: 'Lead captured securely.' });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to process request.' });
  }
});

app.post('/api/tickets', async (req, res) => {
  try {
    const parsed = ticketSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid ticket data.' });
    }

    const { customerName, accountId, phone, issueType, description } = parsed.data;
    const trackingToken = crypto.randomUUID().replace(/-/g, '');

    await query(
      'INSERT INTO support_tickets (id, customer_name, account_id, phone, issue_type, description, status, tracking_token, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
      [
        crypto.randomUUID(),
        stripHtml(customerName),
        stripHtml(accountId),
        stripHtml(phone),
        stripHtml(issueType),
        stripHtml(description),
        'open',
        trackingToken,
        new Date()
      ]
    );

    return res.status(201).json({ message: 'Support ticket submitted.', trackingToken });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to submit ticket.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
