/**
 * Seeds data/content.json with any top-level sections that exist in
 * DEFAULT_CONTENT but are missing from the stored document (older baselines).
 * Existing stored values always win.
 *
 * Run: npx tsx scripts/sync-defaults.ts
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { DEFAULT_CONTENT } from '../src/context/ContentContext';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = resolve(__dirname, '..', 'data', 'content.json');
const stored = JSON.parse(readFileSync(FILE, 'utf8'));

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}
function fill(base: Record<string, unknown>, override: Record<string, unknown>) {
  const out: Record<string, unknown> = { ...base };
  for (const k of Object.keys(override)) {
    const o = override[k];
    const b = base[k];
    if (o === undefined) continue;
    if (b === undefined) out[k] = o;
    else if (isPlainObject(b) && isPlainObject(o)) out[k] = fill(b, o);
  }
  return out;
}

const merged = fill(stored as Record<string, unknown>, DEFAULT_CONTENT as unknown as Record<string, unknown>);
// Never persist the legacy placeholder array back
delete merged.portfolio;

writeFileSync(FILE, JSON.stringify(merged, null, 2), 'utf8');
console.log('synced sections:', Object.keys(merged));
