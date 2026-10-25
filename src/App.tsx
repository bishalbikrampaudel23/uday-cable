import { useEffect, useMemo, useState } from 'react';
import logoImage from '../Gemini_Generated_Image_v48jq6v48jq6v48j.png';
import { CoverageChecker } from './components/CoverageChecker';
import { PlanComparisonTable } from './components/PlanComparisonTable';
import { PricingMatrix } from './components/PricingMatrix';
import { SupportTicketForm } from './components/SupportTicketForm';

type Package = {
  id: string;
  name: string;
  speed_mbps: number;
  price_monthly: number;
  installation_charge: number;
  router_rental: number;
  type: string;
  features: string[];
};

type SectionKey = 'overview' | 'plans' | 'coverage' | 'support';

function App() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<SectionKey>('overview');

  useEffect(() => {
    fetch('/api/packages')
      .then((response) => response.json())
      .then((data) => setPackages(data))
      .finally(() => setLoading(false));
  }, []);

  const featured = useMemo(() => packages.slice(0, 4), [packages]);
  const navItems: Array<{ key: SectionKey; label: string; short: string }> = [
    { key: 'overview', label: 'Overview', short: 'Home' },
    { key: 'plans', label: 'Plans', short: 'Packages' },
    { key: 'coverage', label: 'Coverage', short: 'Area check' },
    { key: 'support', label: 'Support', short: 'Contact' }
  ];

  return (
    <div className="app-shell min-h-screen bg-slate-100 text-slate-800">
      <header className="site-header border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 text-sm text-slate-600 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Udaya Cable logo" className="h-11 w-11 rounded-full border border-slate-200 object-cover shadow-sm" />
            <div>
              <div className="font-semibold text-slate-900">Udaya Cable</div>
              <div className="text-xs text-slate-500">Official partner for Syangja connectivity</div>
            </div>
          </div>
          <a href="https://udayacable.com.np" target="_blank" rel="noreferrer" className="portal-link rounded-full px-4 py-2 font-semibold text-white transition">Client Portal</a>
        </div>
      </header>

      <main className="page-main mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="hero-panel">
          <div className="hero-layout">
            <div className="hero-copy">
              <p className="hero-eyebrow"><span className="hero-status-dot" /> Syangja, Nepal <span className="eyebrow-divider">/</span> Fiber internet</p>
              <h1>More of what matters, connected.</h1>
              <p className="hero-description">Fast, dependable internet with a local team ready to help your home or business.</p>
              <div className="hero-actions">
                <button type="button" onClick={() => setActiveSection('plans')} className="hero-primary">Explore plans <span aria-hidden="true">→</span></button>
                <button type="button" onClick={() => setActiveSection('coverage')} className="hero-secondary">Check coverage</button>
              </div>
            </div>
            <div className="network-visual" role="img" aria-label="Fiber connection linking home, television, and work">
              <span className="network-link network-link-home"><span className="signal-packet" /></span>
              <span className="network-link network-link-tv"><span className="signal-packet" /></span>
              <span className="network-link network-link-work"><span className="signal-packet" /></span>
              <span className="network-hub"><strong>FIBER</strong><span>UDAYA</span></span>
              <span className="network-endpoint endpoint-home"><strong>H</strong><span>HOME</span></span>
              <span className="network-endpoint endpoint-tv"><strong>TV</strong><span>STREAM</span></span>
              <span className="network-endpoint endpoint-work"><strong>W</strong><span>WORK</span></span>
            </div>
          </div>
          <nav className="section-nav" aria-label="Main sections">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveSection(item.key)}
                aria-pressed={activeSection === item.key}
                className={`section-nav-link ${activeSection === item.key ? 'is-active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </section>

        <section className="content-panel rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div key={activeSection} className="content-enter">
          {activeSection === 'overview' && (
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ['01', 'A quick, clear start', 'Our local team guides you through installation and gets your connection ready.'],
                ['02', 'Help from real people', 'Get practical support from a team that knows your area and your needs.'],
                ['03', 'Plans without surprises', 'Compare straightforward options for home, work, and entertainment.']
              ].map(([number, title, text], index) => (
                <article key={title} className="feature-item" style={{ animationDelay: `${index * 90}ms` }}>
                  <span className="feature-number">{number}</span>
                  <h2>{title}</h2>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          )}

          {activeSection === 'plans' && (
            <div className="space-y-6">
              <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">Plans</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">Choose the right package for your home, office, or family setup.</h3>
              </div>
              <PricingMatrix packages={featured} loading={loading} />
              <PlanComparisonTable packages={featured} />
            </div>
          )}

          {activeSection === 'coverage' && <CoverageChecker />}

          {activeSection === 'support' && (
            <div className="space-y-6">
              <section className="rounded-[20px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">Support</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">Contact Udaya Cable for installation or service assistance.</h3>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-700">
                  <a href="tel:+9779856024391" className="rounded-full border border-slate-300 bg-white px-4 py-2 transition hover:border-blue-700 hover:text-blue-700">Phone: +977 9856024391</a>
                  <a href="mailto:Hemanta21.hp@gmail.com" className="rounded-full border border-slate-300 bg-white px-4 py-2 transition hover:border-blue-700 hover:text-blue-700">Email: Hemanta21.hp@gmail.com</a>
                  <a href="https://maps.app.goo.gl/V7SCR65invxH3JSe6" target="_blank" rel="noreferrer" className="rounded-full border border-slate-300 bg-white px-4 py-2 transition hover:border-blue-700 hover:text-blue-700">Location map</a>
                </div>
              </section>
              <SupportTicketForm />
            </div>
          )}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white/90">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-600 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="font-semibold text-slate-900">Udaya Cable Network Pvt. Ltd.</p>
            <p>Reliable internet, TV service, and local support in Syangja.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button type="button" onClick={() => setActiveSection('plans')} className="transition hover:text-blue-700">Plans</button>
            <button type="button" onClick={() => setActiveSection('support')} className="transition hover:text-blue-700">Support</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
