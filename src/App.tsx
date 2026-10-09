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
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 text-sm text-slate-600 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Udaya Cable logo" className="h-11 w-11 rounded-full border border-slate-200 object-cover shadow-sm" />
            <div>
              <div className="font-semibold text-slate-900">Udaya Cable</div>
              <div className="text-xs text-slate-500">Official partner for Syangja connectivity</div>
            </div>
          </div>
          <a href="https://udayacable.com.np" target="_blank" rel="noreferrer" className="rounded-full bg-blue-700 px-4 py-2 font-semibold text-white transition hover:bg-blue-800">Client Portal</a>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-700">Syangja connectivity</div>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">Simple, compact access to internet, service coverage, and support.</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">Choose a section below to explore plans, check availability, or contact the local team.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveSection(item.key)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeSection === item.key ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          {activeSection === 'overview' && (
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ['Fast setup', 'Clear installation steps and local guidance for every new connection.'],
                ['Dependable service', 'Consistent support backed by a team that understands local needs.'],
                ['Transparent plans', 'Straightforward options for homes, offices, and everyday use.']
              ].map(([title, text]) => (
                <div key={title} className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                  <h3 className="font-semibold text-slate-900">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
                </div>
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
