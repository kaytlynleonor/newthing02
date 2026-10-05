import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Circle, Loader2, Package, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { lookupOrder, buildTrackingUrl, type TrackedOrder } from '../../lib/orderTracking';

const STATUS_STEPS: { key: TrackedOrder['status']; label: string }[] = [
  { key: 'Processing', label: 'Order confirmed' },
  { key: 'Shipped', label: 'Shipped' },
  { key: 'Delivered', label: 'Delivered' },
];

function statusIndex(status: TrackedOrder['status']): number {
  const idx = STATUS_STEPS.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : 0;
}

export const OrderTrackingPage: React.FC = () => {
  const { orders, formatPrice, setActiveView } = useStore();
  const { isAuthenticated } = useAuth();

  const [reference, setReference] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoTried, setAutoTried] = useState(false);

  const runLookup = useCallback(
    async (ref: string, mail: string) => {
      setLoading(true);
      setError(null);
      setOrder(null);
      const result = await lookupOrder(ref, mail, orders);
      setLoading(false);
      if (result.order) {
        setOrder(result.order);
        const url = buildTrackingUrl(ref);
        window.history.replaceState({}, '', url);
      } else {
        setError(result.error ?? 'Order not found.');
      }
    },
    [orders]
  );

  useEffect(() => {
    if (autoTried) return;
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');
    const prefillEmail = sessionStorage.getItem('kl_track_email') ?? '';
    if (orderId) {
      setReference(orderId);
      if (prefillEmail) setEmail(prefillEmail);
      setAutoTried(true);
      if (prefillEmail) {
        runLookup(orderId, prefillEmail);
      }
    } else {
      setAutoTried(true);
    }
  }, [autoTried, runLookup]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem('kl_track_email', email.trim());
    runLookup(reference, email);
  };

  const handleNewSearch = () => {
    setOrder(null);
    setError(null);
    const params = new URLSearchParams(window.location.search);
    params.set('view', 'tracking');
    params.delete('orderId');
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  };

  const inputCls =
    'w-full border border-[#D8C8B7] bg-white px-3 py-3 text-sm text-[#11100E] placeholder:text-[#A99684]/70 focus:outline-none focus:border-[#11100E]';
  const labelCls = 'block text-[10px] font-sans uppercase tracking-[0.2em] text-[#A99684] mb-1.5';

  const currentStep = order ? statusIndex(order.status) : 0;

  return (
    <main className="min-h-[70vh] bg-[#F5F1EB] px-4 py-10 sm:px-6 sm:py-14 pb-24">
      <div className="mx-auto max-w-lg">
        <button
          type="button"
          onClick={() => setActiveView('home')}
          className="mb-6 inline-flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.2em] text-[#A99684] hover:text-[#11100E]"
        >
          <ArrowLeft size={14} /> Back to store
        </button>

        <div className="text-center mb-8">
          <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#A99684]">Guest checkout</span>
          <h1 className="mt-2 font-serif text-3xl font-light uppercase tracking-[0.1em] text-[#11100E] sm:text-4xl">
            Track your order
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#4D4742]">
            No account needed. Enter the email you used at checkout and your order or tracking number from your
            confirmation email.
          </p>
        </div>

        {!order && (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#EEE8DF] p-5 sm:p-8 space-y-5 shadow-sm"
          >
            <div>
              <label className={labelCls} htmlFor="track-reference">
                Order or tracking number
              </label>
              <input
                id="track-reference"
                required
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Order ID or tracking # (full or last digits)"
                className={inputCls}
                autoComplete="off"
              />
            </div>
            <div>
              <label className={labelCls} htmlFor="track-email">
                Email address
              </label>
              <input
                id="track-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Same email as checkout"
                className={inputCls}
                autoComplete="email"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#11100E] text-[#F5F1EB] py-3.5 text-[11px] font-sans uppercase tracking-[0.25em] hover:bg-[#A99684] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Looking up order…
                </>
              ) : (
                'Track order'
              )}
            </button>

            {isAuthenticated && (
              <p className="text-center text-[11px] text-[#A99684]">
                Signed in?{' '}
                <button
                  type="button"
                  onClick={() => setActiveView('orders')}
                  className="text-[#11100E] underline underline-offset-2 hover:text-[#A99684]"
                >
                  View all orders in your account
                </button>
              </p>
            )}
          </form>
        )}

        {order && (
          <div className="space-y-6 animate-fade-up">
            <div className="bg-white border border-[#EEE8DF] p-5 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-[#EEE8DF] pb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#A99684]">Order</p>
                  <p className="font-serif text-xl text-[#11100E]">{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-[#A99684]">Tracking</p>
                  <p className="font-mono text-sm text-[#11100E]">{order.trackingNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Package size={18} className="text-[#A99684]" />
                <span className="text-sm font-semibold uppercase tracking-wide text-[#11100E]">{order.status}</span>
              </div>

              <ol className="relative pl-1 space-y-4 pt-2">
                {STATUS_STEPS.map((step, index) => {
                  const done = index <= currentStep;
                  const active = index === currentStep;
                  return (
                    <li key={step.key} className="flex gap-3 items-start">
                      {done ? (
                        <CheckCircle2
                          size={20}
                          className={`shrink-0 ${active ? 'text-[#11100E]' : 'text-emerald-700'}`}
                          strokeWidth={1.5}
                        />
                      ) : (
                        <Circle size={20} className="shrink-0 text-[#D8C8B7]" strokeWidth={1.5} />
                      )}
                      <div>
                        <p className={`text-sm font-medium ${done ? 'text-[#11100E]' : 'text-[#A99684]'}`}>
                          {step.label}
                        </p>
                        {active && step.key === 'Shipped' && (
                          <p className="text-xs text-[#4D4742] mt-0.5 flex items-center gap-1">
                            <Truck size={12} /> In transit with our delivery partner
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-[#4D4742] border-t border-[#EEE8DF]">
                <div>
                  <p className="text-[10px] uppercase text-[#A99684] mb-0.5">Placed</p>
                  <p>{order.date}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-[#A99684] mb-0.5">Total</p>
                  <p className="font-semibold text-[#11100E]">{formatPrice(order.totalAmount)}</p>
                </div>
              </div>

              {order.shippingAddress && (
                <div className="text-xs text-[#4D4742] pt-2 border-t border-[#EEE8DF]">
                  <p className="text-[10px] uppercase text-[#A99684] mb-1">Shipping to</p>
                  <p className="font-medium text-[#11100E]">{order.shippingAddress.fullName}</p>
                  <p>
                    {order.shippingAddress.addressLine}, {order.shippingAddress.city}{' '}
                    {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white border border-[#EEE8DF] p-5 sm:p-6">
              <h2 className="font-serif text-sm uppercase tracking-wider text-[#11100E] mb-4">Items</h2>
              <ul className="space-y-4">
                {order.items?.map((item, i) => (
                  <li key={i} className="flex gap-3 items-center">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-14 h-16 object-cover bg-[#EEE8DF] shrink-0"
                    />
                    <div className="min-w-0 flex-1 text-xs">
                      <p className="font-semibold uppercase text-[#11100E] truncate">{item.productName}</p>
                      <p className="text-[#A99684]">
                        {item.variantName} · Size {item.size} · Qty {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-semibold shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={handleNewSearch}
              className="w-full border border-[#11100E] text-[#11100E] py-3 text-[11px] uppercase tracking-[0.2em] hover:bg-[#11100E] hover:text-[#F5F1EB] transition-colors"
            >
              Track another order
            </button>
          </div>
        )}
      </div>
    </main>
  );
};
