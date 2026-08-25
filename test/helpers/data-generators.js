/**
 * Dynamic payload generators built on @faker-js/faker.
 *
 * Each generator returns a full request body and accepts an `overrides`
 * object to pin specific fields (deterministic tests when needed).
 *
 * Usage:
 *   import { generateUserPayload, generatePostPayload } from './data-generators.js';
 *   const body = generateUserPayload({ name: 'Fixed Name' });
 */
import { faker } from '@faker-js/faker';

/**
 * Builds a user creation payload, optionally merging overrides.
 * Matches the JSONPlaceholder /users contract.
 * @param {Record<string, unknown>} [overrides]
 * @returns {{name: string, username: string, email: string, [k: string]: unknown}}
 */
export function generateUserPayload(overrides = {}) {
  return {
    name: faker.person.fullName(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    ...overrides,
  };
}

/**
 * Builds a post creation payload (JSONPlaceholder /posts).
 * @param {Record<string, unknown>} [overrides]
 * @returns {{title: string, body: string, userId: number, [k: string]: unknown}}
 */
export function generatePostPayload(overrides = {}) {
  return {
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraph(),
    userId: faker.number.int({ min: 1, max: 10 }),
    ...overrides,
  };
}

/**
 * Builds an arbitrary generic object with realistic sample data.
 * Useful for demonstrating non-CRUD endpoints.
 * @param {Record<string, unknown>} [overrides]
 */
export function generateGenericPayload(overrides = {}) {
  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    description: faker.lorem.sentence(),
    active: faker.datatype.boolean(),
    createdAt: faker.date.recent().toISOString(),
    ...overrides,
  };
}

/**
 * Builds a GoRest user creation payload.
 *
 * GoRest `POST /public/v2/users` requires: name, gender, email, status.
 *   - gender: "male" | "female"
 *   - status: "active" | "inactive"
 *
 * @param {Record<string, unknown>} [overrides]
 * @returns {{name: string, gender: string, email: string, status: string}}
 */
export function generateGoRestUserPayload(overrides = {}) {
  return {
    name: faker.person.fullName(),
    gender: faker.helpers.arrayElement(['male', 'female']),
    email: faker.internet.email().toLowerCase(),
    status: faker.helpers.arrayElement(['active', 'inactive']),
    ...overrides,
  };
}
