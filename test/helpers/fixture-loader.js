import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const FIXTURES_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../fixtures');

/** Reads and parses a fixture JSON file (relative to test/fixtures). */
export function loadFixture(relativePath) {
  const absolutePath = path.join(FIXTURES_ROOT, relativePath);
  const raw = readFileSync(absolutePath, 'utf8');
  return JSON.parse(raw);
}
