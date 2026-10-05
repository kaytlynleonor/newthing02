import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { INITIAL_PRODUCTS } from '../data/products';
import type { MediaAsset, Product } from '../types/ecommerce';

export type MediaRow = MediaAsset & { _docId: string };

function filenameFromUrl(url: string): string {
  try {
    if (url.startsWith('/')) {
      return decodeURIComponent(url.split('/').pop() || 'catalog-image.jpg');
    }
    const u = new URL(url);
    return decodeURIComponent(u.pathname.split('/').pop() || 'catalog-image.jpg');
  } catch {
    return 'catalog-image.jpg';
  }
}

function mimeFromUrl(url: string): string {
  const lower = url.toLowerCase();
  if (lower.includes('.png')) return 'image/png';
  if (lower.includes('.webp')) return 'image/webp';
  if (lower.includes('.gif')) return 'image/gif';
  return 'image/jpeg';
}

/** Unique image URLs from the product catalog, with linked product IDs. */
export function collectCatalogMediaEntries(products: Product[] = INITIAL_PRODUCTS) {
  const byUrl = new Map<string, { url: string; name: string; linkedProductIds: string[] }>();

  for (const p of products) {
    for (const url of p.images || []) {
      const trimmed = url?.trim();
      if (!trimmed) continue;
      const existing = byUrl.get(trimmed);
      if (existing) {
        if (!existing.linkedProductIds.includes(p.id)) {
          existing.linkedProductIds.push(p.id);
        }
      } else {
        byUrl.set(trimmed, {
          url: trimmed,
          name: filenameFromUrl(trimmed),
          linkedProductIds: [p.id],
        });
      }
    }
    for (const v of p.variants || []) {
      const vUrl = v.image?.trim();
      if (!vUrl) continue;
      const existing = byUrl.get(vUrl);
      if (existing) {
        if (!existing.linkedProductIds.includes(p.id)) {
          existing.linkedProductIds.push(p.id);
        }
      } else {
        byUrl.set(vUrl, {
          url: vUrl,
          name: filenameFromUrl(vUrl),
          linkedProductIds: [p.id],
        });
      }
    }
  }

  return Array.from(byUrl.values());
}

function mapSnapDocs(docs: { id: string; data: () => DocumentDataLike }[]): MediaRow[] {
  return docs.map(d => {
    const data = d.data() as Omit<MediaAsset, 'id'>;
    return { _docId: d.id, id: d.id, ...data };
  });
}

type DocumentDataLike = Record<string, unknown>;

async function readMediaDocs(): Promise<MediaRow[]> {
  try {
    const snap = await getDocs(query(collection(db, 'media'), orderBy('createdAt', 'desc')));
    return mapSnapDocs(snap.docs);
  } catch {
    const snap = await getDocs(collection(db, 'media'));
    return mapSnapDocs(snap.docs);
  }
}

export async function seedCatalogMediaIfMissing(
  products: Product[] = INITIAL_PRODUCTS
): Promise<number> {
  const rows = await readMediaDocs();
  const existingUrls = new Set(rows.map(r => r.url));
  const toAdd = collectCatalogMediaEntries(products).filter(e => !existingUrls.has(e.url));

  for (const entry of toAdd) {
    await addDoc(collection(db, 'media'), {
      url: entry.url,
      name: entry.name,
      kind: 'image',
      mimeType: mimeFromUrl(entry.url),
      size: 0,
      linkedProductIds: entry.linkedProductIds,
      source: 'catalog',
      createdAt: serverTimestamp(),
    });
  }

  return toAdd.length;
}

/** Load media library and ensure catalog product images exist as library entries. */
export async function loadMediaLibrary(
  products: Product[] = INITIAL_PRODUCTS
): Promise<{ items: MediaRow[]; seededCount: number }> {
  try {
    const seededCount = await seedCatalogMediaIfMissing(products);
    const items = await readMediaDocs();
    return { items, seededCount };
  } catch {
    const fallback = collectCatalogMediaEntries(products).map((e, i) => ({
      _docId: `catalog-${i}`,
      id: `catalog-${i}`,
      url: e.url,
      name: e.name,
      kind: 'image' as const,
      mimeType: mimeFromUrl(e.url),
      size: 0,
      linkedProductIds: e.linkedProductIds,
    }));
    return { items: fallback, seededCount: 0 };
  }
}
