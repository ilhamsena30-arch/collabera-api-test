/**
 * Fixture loader.
 *
 * Since JSON files cannot be `import`ed without import attributes in some
 * Node versions, this helper reads them from disk and returns parsed objects.
 *
 * Usage:
 *   import { loadFixture } from '../helpers/fixture-loader.js';
 *   const user = loadFixture('users/user-1.json');
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const FIXTURES_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../fixtures');

/**
 * Reads and parses a fixture JSON file (relative to test/fixtures).
 * @param {string} relativePath e.g. 'users/user-1.json'
 * @returns {Record<string, unknown>}
 */
export function loadFixture(relativePath) {
  const absolutePath = path.join(FIXTURES_ROOT, relativePath);
  const raw = readFileSync(absolutePath, 'utf8');
  return JSON.parse(raw);
}
