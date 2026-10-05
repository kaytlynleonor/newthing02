import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { DocumentData } from 'firebase/firestore';

type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type OrderEditPayload = {
  customerEmail: string;
  trackingNumber: string;
  status: OrderStatus;
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    addressLine: string;
    city: string;
    postalCode: string;
    country: string;
  };
};

interface OrderEditModalProps {
  order: DocumentData | null;
  saving: boolean;
  onClose: () => void;
  onSave: (docId: string, payload: OrderEditPayload) => Promise<void>;
}

export const OrderEditModal: React.FC<OrderEditModalProps> = ({ order, saving, onClose, onSave }) => {
  const [form, setForm] = useState<OrderEditPayload | null>(null);

  useEffect(() => {
    if (!order) {
      setForm(null);
      return;
    }
    const addr = order.shippingAddress || {};
    setForm({
      customerEmail: order.customerEmail || '',
      trackingNumber: order.trackingNumber || '',
      status: (order.status as OrderStatus) || 'Processing',
      paymentMethod: order.paymentMethod || '',
      shippingAddress: {
        fullName: addr.fullName || '',
        addressLine: addr.addressLine || '',
        city: addr.city || '',
        postalCode: addr.postalCode || '',
        country: addr.country || '',
      },
    });
  }, [order]);

  if (!order || !form) return null;

  const inp =
    'w-full bg-white border border-[#EEE8DF] p-2.5 text-xs text-[#11100E] focus:outline-none focus:border-[#11100E]';
  const lbl = 'block text-[9px] uppercase tracking-[0.2em] text-[#A99684] mb-1';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#11100E]/60 p-4 backdrop-blur-sm">
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-[#EEE8DF] bg-[#F5F1EB] shadow-2xl"
        role="dialog"
        aria-labelledby="order-edit-title"
      >
        <div className="flex items-center justify-between border-b border-[#EEE8DF] px-5 py-4">
          <h2 id="order-edit-title" className="font-serif text-lg uppercase tracking-[0.15em]">
            Edit order {order.id}
          </h2>
          <button type="button" onClick={onClose} className="p-1 text-[#A99684] hover:text-[#11100E]" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form
          className="space-y-4 p-5 text-xs font-sans"
          onSubmit={async (e) => {
            e.preventDefault();
            await onSave(order._docId as string, form);
          }}
        >
          <div>
            <label className={lbl}>Customer email</label>
            <input
              type="email"
              required
              className={inp}
              value={form.customerEmail}
              onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Tracking number</label>
              <input
                className={inp}
                value={form.trackingNumber}
                onChange={(e) => setForm({ ...form, trackingNumber: e.target.value })}
              />
            </div>
            <div>
              <label className={lbl}>Status</label>
              <select
                className={inp}
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as OrderStatus })}
              >
                {(['Processing', 'Shipped', 'Delivered', 'Cancelled'] as OrderStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={lbl}>Payment method</label>
            <input
              className={inp}
              value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
            />
          </div>
          <div className="space-y-2 border-t border-[#EEE8DF] pt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#11100E]">Shipping address</p>
            {(
              [
                ['fullName', 'Full name'],
                ['addressLine', 'Address'],
                ['city', 'City'],
                ['postalCode', 'Postal code'],
                ['country', 'Country'],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <label className={lbl}>{label}</label>
                <input
                  className={inp}
                  value={form.shippingAddress[key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      shippingAddress: { ...form.shippingAddress, [key]: e.target.value },
                    })
                  }
                />
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#11100E] py-2.5 text-[10px] uppercase tracking-wider text-[#11100E]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 bg-[#11100E] py-2.5 text-[10px] uppercase tracking-wider text-[#F5F1EB] disabled:opacity-60"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
