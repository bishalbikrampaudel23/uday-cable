import { useState, type ChangeEvent, type FormEvent } from 'react';

export function SupportTicketForm() {
  const [form, setForm] = useState({ customerName: '', accountId: '', phone: '', issueType: '', description: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const validate = () => {
    if (!form.customerName.trim() || form.customerName.trim().length < 2) return 'Please enter a valid customer name.';
    if (!/^[0-9+\-()\s]{7,15}$/.test(form.phone)) return 'Please enter a valid phone number.';
    if (!form.issueType) return 'Select an issue type.';
    if (form.description.trim().length < 10) return 'Describe the issue with at least 10 characters.';
    return '';
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setStatus('error');
      setMessage(validationError);
      return;
    }

    setStatus('loading');
    setMessage('');
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? 'Submission failed');
      setStatus('success');
      setMessage(`Ticket submitted successfully. Tracking token: ${payload.trackingToken}`);
      setForm({ customerName: '', accountId: '', phone: '', issueType: '', description: '' });
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unable to submit request.');
    }
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/20">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-500">Support portal</p>
        <h2 className="text-2xl font-semibold">Submit a support request safely</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-slate-300">
          Customer name
          <input name="customerName" value={form.customerName} onChange={handleChange} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-brand-500" />
        </label>
        <label className="text-sm text-slate-300">
          Account ID
          <input name="accountId" value={form.accountId} onChange={handleChange} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-brand-500" />
        </label>
        <label className="text-sm text-slate-300">
          Phone number
          <input name="phone" value={form.phone} onChange={handleChange} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-brand-500" />
        </label>
        <label className="text-sm text-slate-300">
          Issue type
          <select name="issueType" value={form.issueType} onChange={handleChange} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-brand-500">
            <option value="">Select</option>
            <option value="Connectivity">Connectivity</option>
            <option value="Billing">Billing</option>
            <option value="Installation">Installation</option>
            <option value="Router">Router</option>
          </select>
        </label>
        <label className="text-sm text-slate-300 md:col-span-2">
          Description
          <textarea name="description" value={form.description} onChange={handleChange} rows={5} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-brand-500" />
        </label>

        <div className="md:col-span-2 flex flex-wrap items-center gap-3">
          <button type="submit" disabled={status === 'loading'} className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70">
            {status === 'loading' ? 'Submitting…' : 'Submit Ticket'}
          </button>
          {status === 'loading' ? <div className="h-4 w-24 animate-pulse rounded bg-slate-800" /> : null}
        </div>

        {message ? <p className={`md:col-span-2 text-sm ${status === 'error' ? 'text-rose-400' : 'text-emerald-400'}`}>{message}</p> : null}
      </form>
    </section>
  );
}
