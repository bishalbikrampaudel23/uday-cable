import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/db.ts', () => ({ query: vi.fn() }));

import { app } from '../src/index.ts';
import { query } from '../src/db.ts';

let server;
let baseUrl;

beforeAll(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

afterAll(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

beforeEach(() => {
  vi.mocked(query).mockReset();
  vi.mocked(query).mockResolvedValue({ rows: [], rowCount: 1 });
});

describe('public API', () => {
  it('returns a healthy status', async () => {
    const response = await fetch(`${baseUrl}/api/health`);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: 'ok' });
  });

  it('returns the published package list', async () => {
    const response = await fetch(`${baseUrl}/api/packages`);
    const packages = await response.json();

    expect(response.status).toBe(200);
    expect(packages).toHaveLength(3);
    expect(response.headers.get('cache-control')).toContain('max-age=300');
  });

  it('rejects invalid leads without writing to the database', async () => {
    const response = await fetch(`${baseUrl}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: 'A', phone: 'not-a-phone' })
    });

    expect(response.status).toBe(400);
    expect(query).not.toHaveBeenCalled();
  });

  it('validates, sanitizes, and persists a valid lead', async () => {
    const response = await fetch(`${baseUrl}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: '<b>Jane Doe</b>',
        phone: '+977 9856024391',
        coverageAreaId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        selectedPackageId: '11111111-1111-4111-8111-111111111111'
      })
    });

    expect(response.status).toBe(201);
    expect(query).toHaveBeenCalledOnce();
    expect(query.mock.calls[0][1][1]).toBe('Jane Doe');
    expect(query.mock.calls[0][1][2]).toBe('+977 9856024391');
  });

  it('returns a tracking token after saving a valid support ticket', async () => {
    const response = await fetch(`${baseUrl}/api/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Jane Doe',
        accountId: 'ACCT-123',
        phone: '+977 9856024391',
        issueType: 'Connectivity',
        description: 'Internet service is unavailable.'
      })
    });
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.trackingToken).toMatch(/^[a-f0-9]{32}$/);
    expect(query).toHaveBeenCalledOnce();
  });

  it('returns a generic error when lead persistence fails', async () => {
    vi.mocked(query).mockRejectedValueOnce(new Error('database details must not leak'));

    const response = await fetch(`${baseUrl}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Jane Doe',
        phone: '+977 9856024391',
        coverageAreaId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        selectedPackageId: '11111111-1111-4111-8111-111111111111'
      })
    });

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Unable to process request.' });
  });
});
