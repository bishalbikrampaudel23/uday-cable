import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CoverageChecker } from './CoverageChecker';
import { PlanComparisonTable } from './PlanComparisonTable';
import { PricingMatrix } from './PricingMatrix';
import { SupportTicketForm } from './SupportTicketForm';

const packages = [
  {
    id: 'home-100',
    name: 'Home 100',
    speed_mbps: 100,
    price_monthly: 1044,
    installation_charge: 500,
    router_rental: 500,
    type: 'internet_solo',
    features: ['Dual-band router']
  },
  {
    id: 'combo-200',
    name: 'Combo 200',
    speed_mbps: 200,
    price_monthly: 1800,
    installation_charge: 700,
    router_rental: 700,
    type: 'tv_combo',
    features: ['iTV ready']
  }
];

describe('public page components', () => {
  it('shows a loading placeholder while package data is pending', () => {
    const markup = renderToStaticMarkup(<PricingMatrix packages={[]} loading />);

    expect(markup).toContain('animate-pulse');
    expect(markup).not.toContain('Home 100');
  });

  it('renders the default internet package category', () => {
    const markup = renderToStaticMarkup(<PricingMatrix packages={packages} loading={false} />);

    expect(markup).toContain('Home 100');
    expect(markup).not.toContain('Combo 200');
  });

  it('renders plan details in the comparison table', () => {
    const markup = renderToStaticMarkup(<PlanComparisonTable packages={packages} />);

    expect(markup).toContain('Home 100');
    expect(markup).toContain('Combo 200');
    expect(markup).toContain('Rs. 1,044 / month');
  });

  it('renders available coverage choices before collecting lead details', () => {
    const markup = renderToStaticMarkup(<CoverageChecker />);

    expect(markup).toContain('Phedikhola');
    expect(markup).toContain('Aarukharka');
    expect(markup).not.toContain('Request Installation');
  });

  it('renders the support form with its required user-facing fields', () => {
    const markup = renderToStaticMarkup(<SupportTicketForm />);

    expect(markup).toContain('Customer name');
    expect(markup).toContain('Phone number');
    expect(markup).toContain('Issue type');
    expect(markup).toContain('Description');
  });
});
