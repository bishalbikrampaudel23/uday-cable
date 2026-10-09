import { useState } from 'react';

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

export function PricingMatrix({ packages, loading }: { packages: Package[]; loading: boolean }) {
  const [activeTab, setActiveTab] = useState<'internet' | 'combo'>('internet');

  const visiblePackages = packages.filter((pkg) => activeTab === 'combo' ? pkg.type === 'tv_combo' || pkg.type === 'corporate' : pkg.type === 'internet_solo');

  if (loading) {
    return (
      <section id="plans" className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] sm:p-8">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-slate-200" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((index) => (
            <div key={index} className="rounded-[24px] border border-slate-200 bg-slate-50 p-6">
              <div className="h-6 w-24 animate-pulse rounded bg-slate-200" />
              <div className="mt-4 h-8 w-20 animate-pulse rounded bg-slate-200" />
              <div className="mt-6 space-y-3">
                <div className="h-4 animate-pulse rounded bg-slate-200" />
                <div className="h-4 animate-pulse rounded bg-slate-200" />
                <div className="h-4 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="plans" className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] sm:p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-600">Plans and bundles</p>
          <h2 className="text-2xl font-semibold text-slate-900">Choose the right plan for homes, work, and entertainment</h2>
        </div>
        <div className="flex rounded-full border border-slate-200 bg-slate-50 p-1">
          <button type="button" onClick={() => setActiveTab('internet')} className={`rounded-full px-4 py-2 text-sm font-semibold ${activeTab === 'internet' ? 'bg-blue-700 text-white' : 'text-slate-700'}`}>Internet Plans</button>
          <button type="button" onClick={() => setActiveTab('combo')} className={`rounded-full px-4 py-2 text-sm font-semibold ${activeTab === 'combo' ? 'bg-red-600 text-white' : 'text-slate-700'}`}>Internet + iTV Combos</button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {visiblePackages.map((pkg) => (
          <article key={pkg.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-6 transition hover:border-blue-700">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-700">{pkg.type.replace(/_/g, ' ')}</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">{pkg.name}</h3>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-4xl font-semibold text-slate-900">{pkg.speed_mbps}</span>
              <span className="pb-1 text-sm text-slate-500">Mbps</span>
            </div>
            <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
              <div className="text-3xl font-semibold text-slate-900">Rs. {pkg.price_monthly.toLocaleString()}*</div>
              <div className="mt-2 text-sm text-slate-500">Monthly plan price</div>
              <div className="mt-2 text-sm text-slate-600">Router Rental: Rs. {pkg.router_rental.toLocaleString()}</div>
              <div className="text-sm text-slate-600">Drop Wire Charges: Rs. {pkg.installation_charge.toLocaleString()}</div>
            </div>
            <ul className="mt-6 space-y-2 text-sm text-slate-600">
              {pkg.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-red-600" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button type="button" className="mt-6 w-full rounded-full bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800">Choose Plan</button>
          </article>
        ))}
      </div>
    </section>
  );
}
