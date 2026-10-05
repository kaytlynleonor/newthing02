import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
import type { Order } from '../types/ecommerce';
import { isOrderTrashed } from './orderTrash';

export type TrackedOrder = Order & {
  customerEmail?: string;
  _firestoreId?: string;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeReference(reference: string): string {
  return reference.replace(/\s+/g, '').trim().toUpperCase();
}

function emailsMatch(stored: string | undefined, entered: string): boolean {
  if (!stored) return false;
  return normalizeEmail(stored) === normalizeEmail(entered);
}

function referenceMatches(order: TrackedOrder, reference: string): boolean {
  const ref = normalizeReference(reference);
  if (!ref) return false;

  const id = normalizeReference(order.id || '');
  const track = normalizeReference(order.trackingNumber || '');

  if (id === ref || track === ref) return true;

  // Allow partial match when user enters a distinctive fragment (e.g. last digits)
  if (ref.length >= 4) {
    if (id.includes(ref) || track.includes(ref)) return true;
  }

  return false;
}

async function fetchFromFirestore(reference: string, email: string): Promise<TrackedOrder | null> {
  const emailNorm = normalizeEmail(email);
  const refNorm = normalizeReference(reference);

  const tryQuery = async (field: 'trackingNumber' | 'id', value: string) => {
    const q = query(collection(db, 'orders'), where(field, '==', value));
    const snap = await getDocs(q);
    for (const docSnap of snap.docs) {
      const data = docSnap.data() as TrackedOrder;
      if (!isOrderTrashed(data) && emailsMatch(data.customerEmail, emailNorm)) {
        return { ...data, _firestoreId: docSnap.id };
      }
    }
    return null;
  };

  const trimmed = reference.trim();
  const byTracking = await tryQuery('trackingNumber', trimmed);
  if (byTracking) return byTracking;

  const byId = await tryQuery('id', trimmed);
  if (byId) return byId;

  // Email + flexible reference (exact or partial) — one query, filter client-side
  const byEmail = query(collection(db, 'orders'), where('customerEmail', '==', emailNorm));
  const emailSnap = await getDocs(byEmail);
  let best: TrackedOrder | null = null;
  for (const docSnap of emailSnap.docs) {
    const data = { ...(docSnap.data() as TrackedOrder), _firestoreId: docSnap.id };
    if (!isOrderTrashed(data) && referenceMatches(data, reference)) {
      best = data;
      if (
        normalizeReference(data.id) === refNorm ||
        normalizeReference(data.trackingNumber) === refNorm
      ) {
        return data;
      }
    }
  }

  return best;
}

export async function lookupOrder(
  reference: string,
  email: string,
  localOrders: Order[] = []
): Promise<{ order: TrackedOrder | null; error?: string }> {
  const ref = reference.trim();
  const emailNorm = normalizeEmail(email);

  if (!ref) {
    return { order: null, error: 'Enter your order or tracking number.' };
  }
  if (!emailNorm || !emailNorm.includes('@')) {
    return { order: null, error: 'Enter the email address used at checkout.' };
  }

  const localMatch = localOrders.find(
    (o) => !isOrderTrashed(o as TrackedOrder) && referenceMatches(o as TrackedOrder, ref)
  );
  if (localMatch) {
    const local = localMatch as TrackedOrder;
    if (!local.customerEmail || emailsMatch(local.customerEmail, emailNorm)) {
      return { order: local };
    }
  }

  try {
    const remote = await fetchFromFirestore(ref, emailNorm);
    if (remote) return { order: remote };
    return {
      order: null,
      error: 'No order found. Check your order number, tracking ID, and email, then try again.',
    };
  } catch {
    return {
      order: null,
      error: 'Unable to look up your order right now. Please try again in a moment.',
    };
  }
}

export function buildTrackingUrl(reference: string): string {
  const params = new URLSearchParams(window.location.search);
  params.set('view', 'tracking');
  params.set('orderId', reference.trim());
  params.delete('email');
  const qs = params.toString();
  return `${window.location.pathname}${qs ? `?${qs}` : ''}`;
}

export function navigateToTracking(
  setActiveView: (view: string) => void,
  options?: { reference?: string; email?: string }
) {
  const params = new URLSearchParams(window.location.search);
  params.set('view', 'tracking');
  if (options?.reference?.trim()) {
    params.set('orderId', options.reference.trim());
  } else {
    params.delete('orderId');
  }
  window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  if (options?.email?.trim()) {
    sessionStorage.setItem('kl_track_email', options.email.trim());
  }
  setActiveView('tracking');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
