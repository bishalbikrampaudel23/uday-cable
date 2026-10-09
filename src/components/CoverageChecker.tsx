import { useMemo, useState, type FormEvent } from 'react';

type CoverageArea = { id: string; local_body: string; ward_number: number; status: string };

type Package = { id: string; name: string; speed_mbps: number; price_monthly: number; type: string; features: string[] };

const areas: CoverageArea[] = [
  { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', local_body: 'Phedikhola', ward_number: 1, status: 'available' },
  { id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', local_body: 'Aarukharka', ward_number: 4, status: 'available' },
  { id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', local_body: 'Kuvinde', ward_number: 2, status: 'planned' }
];

const packages: Package[] = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Fiber Home 100', speed_mbps: 100, price_monthly: 1044, type: 'internet_solo', features: ['Dual-band router', 'Mesh ready'] },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Corporate 300', speed_mbps: 300, price_monthly: 2500, type: 'corporate', features: ['Static IP', 'Priority support'] },
  { id: '33333333-3333-3333-3333-333333333333', name: 'TV Combo 200', speed_mbps: 200, price_monthly: 1800, type: 'tv_combo', features: ['iTV ready', 'Wi-Fi mesh'] }
];

export function CoverageChecker() {
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPackageId, setSelectedPackageId] = useState(packages[0].id);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'submitting'>('idle');

  const availableArea = useMemo(() => areas.find((area) => area.id === selectedArea), [selectedArea]);

  const validate = () => {
    if (!fullName.trim() || fullName.trim().length < 2) return 'Full name is required.';
    if (!/^[0-9+\-()\s]{7,15}$/.test(phone)) return 'Enter a valid phone number.';
    if (!selectedArea) return 'Choose a coverage area.';
    return '';
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setStatus('submitting');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone, coverageAreaId: selectedArea, selectedPackageId, clientIp: 'client' })
      });
      if (!response.ok) throw new Error('Submission failed');
      setStatus('success');
      setFullName('');
      setPhone('');
      setSelectedArea('');
      setSelectedPackageId(packages[0].id);
    } catch {
      setError('We could not submit your request. Please retry in a moment.');
      setStatus('idle');
    }
  };

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] sm:p-8">
      <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-600">Check availability</p>
          <h2 className="text-2xl font-semibold text-slate-900">Locate your service zone in seconds</h2>
        </div>
        <p className="text-sm text-slate-600">Syangja coverage expands steadily. Check your local body and ward before booking.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {areas.map((area) => (
          <button
            key={area.id}
            type="button"
            onClick={() => setSelectedArea(area.id)}
            className={`rounded-2xl border p-4 text-left transition ${selectedArea === area.id ? 'border-blue-700 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'}`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900">{area.local_body}</span>
              <span className={`rounded-full px-2 py-1 text-xs ${area.status === 'available' ? 'bg-emerald-500/15 text-emerald-700' : 'bg-amber-500/15 text-amber-700'}`}>{area.status}</span>
            </div>
            <p className="mt-2 text-sm text-slate-600">Ward {area.ward_number}</p>
          </button>
        ))}
      </div>

      {availableArea && (
        <form onSubmit={handleSubmit} className="mt-6 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{availableArea.local_body} is ready</h3>
              <p className="text-sm text-slate-600">Ward {availableArea.ward_number}</p>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-emerald-700">Available now</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-700">
              Full name
              <input value={fullName} onChange={(event) => setFullName(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-700" placeholder="Enter your name" />
            </label>
            <label className="text-sm text-slate-700">
              Phone number
              <input value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-700" placeholder="9847xxxxxx" />
            </label>
            <label className="text-sm text-slate-700 md:col-span-2">
              Preferred package
              <select value={selectedPackageId} onChange={(event) => setSelectedPackageId(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-blue-700">
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>{pkg.name} - {pkg.speed_mbps} Mbps</option>
                ))}
              </select>
            </label>
          </div>

          {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
          {status === 'success' ? <p className="mt-4 text-sm text-emerald-700">Your request is now being reviewed.</p> : null}

          <button type="submit" disabled={status === 'submitting'} className="mt-5 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70">
            {status === 'submitting' ? 'Submitting…' : 'Request Installation'}
          </button>
        </form>
      )}
    </section>
  );
}
