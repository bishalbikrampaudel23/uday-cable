CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE admin_role AS ENUM ('superadmin', 'support');
CREATE TYPE package_type AS ENUM ('home', 'business', 'combo');
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
  installation_charge NUMERIC(10,2) NOT NULL DEFAULT 0,
  router_rental NUMERIC(10,2) NOT NULL DEFAULT 0,
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
