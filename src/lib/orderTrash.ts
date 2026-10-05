/** Orders in trash are permanently removed after this many days. */
export const ORDER_TRASH_RETENTION_DAYS = 30;

export function isOrderTrashed(order: unknown): boolean {
  const trashedAt = (order as { trashedAt?: string | null })?.trashedAt;
  return Boolean(trashedAt);
}

export function daysInTrash(trashedAt: string): number {
  const ms = Date.now() - new Date(trashedAt).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

export function daysUntilAutoDelete(trashedAt: string): number {
  return Math.max(0, ORDER_TRASH_RETENTION_DAYS - daysInTrash(trashedAt));
}

export function isPastTrashRetention(trashedAt: string): boolean {
  return daysInTrash(trashedAt) >= ORDER_TRASH_RETENTION_DAYS;
}
