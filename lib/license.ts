const ACTIVE = "phiratio.license.v1";
const LEDGER = "phiratio.ledger.v1";

export type StoredLicense = {
  email: string;
  key: string;
  source: "placeholder";
  createdAt: string;
};

const listeners = new Set<() => void>();
let snapshotRaw: string | null = null;
let snapshot: StoredLicense | null = null;
let snapshotReady = false;

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function refreshSnapshot() {
  const raw = window.localStorage.getItem(ACTIVE);
  snapshotRaw = raw;
  snapshotReady = true;
  if (!raw) {
    snapshot = null;
    return;
  }
  try {
    snapshot = JSON.parse(raw) as StoredLicense;
  } catch {
    snapshot = null;
  }
}

export function readLicense(): StoredLicense | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(ACTIVE);
  if (!snapshotReady || raw !== snapshotRaw) refreshSnapshot();
  return snapshot;
}

export function subscribeLicense(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emitLicense() {
  snapshotReady = false;
  listeners.forEach((listener) => listener());
}

export function issuePlaceholderLicense(email: string): StoredLicense {
  const record: StoredLicense = {
    email: email.trim().toLowerCase(),
    key: `PHI-TEST-${crypto.randomUUID()}`,
    source: "placeholder",
    createdAt: new Date().toISOString(),
  };
  const ledger = readJson<StoredLicense[]>(LEDGER) ?? [];
  ledger.push(record);
  window.localStorage.setItem(LEDGER, JSON.stringify(ledger));
  window.localStorage.setItem(ACTIVE, JSON.stringify(record));
  emitLicense();
  return record;
}

export function activateLicense(record: StoredLicense) {
  window.localStorage.setItem(ACTIVE, JSON.stringify(record));
  emitLicense();
}

export function restorePlaceholderLicense(email: string, key: string): StoredLicense | null {
  const ledger = readJson<StoredLicense[]>(LEDGER) ?? [];
  const found = ledger.find(
    (item) => item.email === email.trim().toLowerCase() && item.key === key.trim(),
  );
  if (!found) return null;
  activateLicense(found);
  return found;
}

export const AGE_STORAGE_KEY = "phiratio.age18.v1";
