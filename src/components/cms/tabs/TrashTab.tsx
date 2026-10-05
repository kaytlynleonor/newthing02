import React, { useCallback, useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import {
  ORDER_TRASH_RETENTION_DAYS,
  daysUntilAutoDelete,
  isPastTrashRetention,
  isOrderTrashed,
} from '../../../lib/orderTrash';
import { Loader2, Package, RefreshCw, RotateCcw, Trash2 } from 'lucide-react';
import type { DocumentData } from 'firebase/firestore';

export const TrashTab: React.FC = () => {
  const [items, setItems] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  const purgeExpired = useCallback(async (trashed: DocumentData[]) => {
    const expired = trashed.filter((o) => o.trashedAt && isPastTrashRetention(o.trashedAt as string));
    for (const order of expired) {
      try {
        await deleteDoc(doc(db, 'orders', order._docId as string));
      } catch (e) {
        console.warn('Failed to auto-delete trashed order:', order._docId, e);
      }
    }
    if (expired.length > 0) {
      setMessage(`✓ Removed ${expired.length} order(s) after ${ORDER_TRASH_RETENTION_DAYS}-day retention.`);
    }
    return expired.map((o) => o._docId as string);
  }, []);

  const loadTrash = useCallback(async () => {
    setLoading(true);
    setMessage('');
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const all = snap.docs.map((d) => ({ _docId: d.id, ...d.data() })) as DocumentData[];
      const trashed = all.filter((o) => isOrderTrashed(o));
      const removedIds = await purgeExpired(trashed);
      const remaining = trashed.filter((o) => !removedIds.includes(o._docId as string));
      setItems(remaining);
    } catch (e) {
      console.error('Failed to load trash:', e);
      setMessage('✗ Could not load trash.');
    }
    setLoading(false);
  }, [purgeExpired]);

  useEffect(() => {
    loadTrash();
  }, [loadTrash]);

  const restoreOrder = async (order: DocumentData) => {
    setBusyId(order._docId as string);
    try {
      await updateDoc(doc(db, 'orders', order._docId as string), {
        trashedAt: null,
        updatedAt: serverTimestamp(),
      });
      setItems((prev) => prev.filter((o) => o._docId !== order._docId));
      setMessage(`✓ Order ${order.id} restored to Orders.`);
    } catch {
      setMessage('✗ Restore failed.');
    }
    setBusyId(null);
  };

  const deletePermanently = async (order: DocumentData) => {
    if (!window.confirm(`Permanently delete order ${order.id}? This cannot be undone.`)) return;
    setBusyId(order._docId as string);
    try {
      await deleteDoc(doc(db, 'orders', order._docId as string));
      setItems((prev) => prev.filter((o) => o._docId !== order._docId));
      setMessage(`✓ Order ${order.id} deleted permanently.`);
    } catch {
      setMessage('✗ Delete failed.');
    }
    setBusyId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-lg uppercase tracking-[0.2em]">
            Trash <span className="text-[#A99684] text-sm">({items.length})</span>
          </h2>
          <p className="mt-1 text-[11px] text-[#A99684] max-w-xl leading-relaxed">
            Deleted orders stay here for {ORDER_TRASH_RETENTION_DAYS} days, then are removed automatically. You can
            restore them or delete immediately.
          </p>
        </div>
        <button
          type="button"
          onClick={loadTrash}
          className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#11100E] hover:text-[#A99684]"
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {message && (
        <p
          className={`text-[11px] px-3 py-2 border ${
            message.startsWith('✓')
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {message}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={24} className="animate-spin text-[#A99684]" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-[#EEE8DF] bg-white">
          <Package size={36} className="mx-auto text-[#A99684] mb-3" strokeWidth={1} />
          <p className="text-sm text-[#A99684]">Trash is empty</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((order) => {
            const trashedAt = order.trashedAt as string;
            const daysLeft = daysUntilAutoDelete(trashedAt);
            return (
              <div
                key={order._docId as string}
                className="bg-white border border-[#EEE8DF] px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 justify-between"
              >
                <div className="min-w-0">
                  <p className="font-serif text-sm font-medium">{order.id}</p>
                  <p className="text-[10px] text-[#A99684] truncate">{order.customerEmail}</p>
                  <p className="text-[10px] text-[#A99684] mt-1">
                    Trashed {new Date(trashedAt).toLocaleDateString()} · Auto-delete in{' '}
                    <strong className="text-[#11100E]">{daysLeft}</strong> day{daysLeft === 1 ? '' : 's'}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-semibold mr-2">{fmt(order.totalAmount as number)}</span>
                  <button
                    type="button"
                    disabled={busyId === order._docId}
                    onClick={() => restoreOrder(order)}
                    className="flex items-center gap-1 border border-[#11100E] px-2.5 py-1.5 text-[9px] uppercase tracking-wider hover:bg-[#11100E] hover:text-white disabled:opacity-50"
                  >
                    <RotateCcw size={12} /> Restore
                  </button>
                  <button
                    type="button"
                    disabled={busyId === order._docId}
                    onClick={() => deletePermanently(order)}
                    className="flex items-center gap-1 border border-red-300 bg-red-50 px-2.5 py-1.5 text-[9px] uppercase tracking-wider text-red-800 hover:bg-red-100 disabled:opacity-50"
                  >
                    <Trash2 size={12} /> Delete now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrashTab;
