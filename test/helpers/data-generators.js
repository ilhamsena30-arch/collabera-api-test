/** faker-based payload builders. Each accepts an `overrides` object to pin fields. */
import { faker } from '@faker-js/faker';

/** @param {Record<string, unknown>} [overrides] */
export function generateUserPayload(overrides = {}) {
  return {
    name: faker.person.fullName(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    ...overrides,
  };
}

/** @param {Record<string, unknown>} [overrides] */
export function generatePostPayload(overrides = {}) {
  return {
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraph(),
    userId: faker.number.int({ min: 1, max: 10 }),
    ...overrides,
  };
}

/** @param {Record<string, unknown>} [overrides] */
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

/** GoRest user payload: name, gender (male/female), email, status (active/inactive). */
/** @param {Record<string, unknown>} [overrides] */
export function generateGoRestUserPayload(overrides = {}) {
  return {
    name: faker.person.fullName(),
    gender: faker.helpers.arrayElement(['male', 'female']),
    email: faker.internet.email().toLowerCase(),
    status: faker.helpers.arrayElement(['active', 'inactive']),
    ...overrides,
  };
}
