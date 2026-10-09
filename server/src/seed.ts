import { query } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  await query(`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;

    CREATE TYPE admin_role AS ENUM ('superadmin', 'support');
    CREATE TYPE package_type AS ENUM ('internet_solo', 'tv_combo', 'corporate');
    CREATE TYPE coverage_status AS ENUM ('available', 'planned', 'limited');
    CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'converted', 'closed');
    CREATE TYPE ticket_status AS ENUM ('open', 'pending', 'resolved', 'closed');

    CREATE TABLE IF NOT EXISTS admins (
      id UUID PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role admin_role NOT NULL,
      login_attempts INT NOT NULL DEFAULT 0,
      lock_until TIMESTAMP NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS packages (
      id UUID PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      speed_mbps INT NOT NULL,
      price_monthly NUMERIC(10,2) NOT NULL,
      type package_type NOT NULL,
      features JSONB NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT TRUE
    );

    CREATE TABLE IF NOT EXISTS coverage_areas (
      id UUID PRIMARY KEY,
      local_body VARCHAR(120) NOT NULL,
      ward_number INT NOT NULL,
      status coverage_status NOT NULL,
      CONSTRAINT coverage_areas_unique UNIQUE (local_body, ward_number)
    );

    CREATE TABLE IF NOT EXISTS leads (
      id UUID PRIMARY KEY,
      full_name VARCHAR(120) NOT NULL,
      phone VARCHAR(32) NOT NULL,
      coverage_area_id UUID NOT NULL REFERENCES coverage_areas(id) ON DELETE RESTRICT,
      selected_package_id UUID NOT NULL REFERENCES packages(id) ON DELETE RESTRICT,
      status lead_status NOT NULL DEFAULT 'new',
      ip_address VARCHAR(64) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS support_tickets (
      id UUID PRIMARY KEY,
      customer_name VARCHAR(120) NOT NULL,
      account_id VARCHAR(64) NULL,
      phone VARCHAR(32) NOT NULL,
      issue_type VARCHAR(64) NOT NULL,
      description TEXT NOT NULL,
      status ticket_status NOT NULL DEFAULT 'open',
      tracking_token VARCHAR(64) UNIQUE NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);
  `);

  const packages = [
    ['11111111-1111-1111-1111-111111111111','Fiber Home 100',100,1044,500,500,'internet_solo','["Dual-band router","Mesh support","Free onboarding"]',true],
    ['22222222-2222-2222-2222-222222222222','Corporate 300',300,2500,1000,1000,'corporate','["Static IP","Priority support","Business SLA"]',true],
    ['33333333-3333-3333-3333-333333333333','TV Combo 200',200,1800,700,700,'tv_combo','["iTV ready","Wi-Fi mesh","Entertainment bundle"]',true]
  ];

  for (const row of packages) {
    await query(
      `INSERT INTO packages (id, name, speed_mbps, price_monthly, installation_charge, router_rental, type, features, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (id) DO NOTHING`,
      row
    );
  }

  const coverageAreas = [
    ['aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Phedikhola', 1, 'available'],
    ['bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Aarukharka', 4, 'available'],
    ['cccccccc-cccc-cccc-cccc-cccccccccccc','Kuvinde', 2, 'planned']
  ];

  for (const row of coverageAreas) {
    await query(
      `INSERT INTO coverage_areas (id, local_body, ward_number, status)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (id) DO NOTHING`,
      row
    );
  }

  await query(`
    INSERT INTO admins (id, name, email, password_hash, role)
    VALUES ($1,$2,$3,$4,$5)
    ON CONFLICT (email) DO NOTHING
  `, [
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'System Administrator',
    'admin@udayacable.com.np',
    '$2a$12$7o1mKz7Q4u5Yc3Nw3I5LZe4dcTOypMBDPsu7g4LwQKFY4vQyYyK2y',
    'superadmin'
  ]);

  console.log('Seed completed');
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
