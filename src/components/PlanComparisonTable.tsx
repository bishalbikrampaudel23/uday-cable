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

export function PlanComparisonTable({ packages }: { packages: Package[] }) {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] sm:p-8">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-600">Value comparison</p>
          <h2 className="text-2xl font-semibold text-slate-900">Cross-reference bandwidth, router profiles, and value</h2>
        </div>
        <p className="max-w-xl text-sm text-slate-600">Every plan balances speed, hardware support, and installation transparency so your household or office gets the right fit.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-900 text-sm font-semibold uppercase tracking-[0.25em] text-slate-100">
            <tr>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Speed</th>
              <th className="px-4 py-3">Router</th>
              <th className="px-4 py-3">Install</th>
              <th className="px-4 py-3">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white text-sm text-slate-700">
            {packages.map((pkg) => (
              <tr key={pkg.id} className="transition hover:bg-slate-50">
                <td className="px-4 py-4">
                  <div className="font-semibold text-slate-900">{pkg.name}</div>
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-500">{pkg.type.replace(/_/g, ' ')}</div>
                </td>
                <td className="px-4 py-4">{pkg.speed_mbps} Mbps</td>
                <td className="px-4 py-4">{pkg.router_rental > 0 ? 'Dual-band router' : 'Included router'}</td>
                <td className="px-4 py-4">Rs. {pkg.installation_charge.toLocaleString()}</td>
                <td className="px-4 py-4">Rs. {pkg.price_monthly.toLocaleString()} / month</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
