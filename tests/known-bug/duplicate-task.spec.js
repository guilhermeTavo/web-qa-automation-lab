const { test, expect } = require('@playwright/test');
const { validUser } = require('../../fixtures/test-data');

async function authHeaders(request) {
  const response = await request.post('/api/login', { data: validUser });
  const body = await response.json();
  return { Authorization: `Bearer ${body.token}` };
}

test.fixme('BUG-001 duplicate task titles should be rejected', async ({ request }) => {
  const headers = await authHeaders(request);
  const title = 'Duplicate title validation';

  const first = await request.post('/api/tasks', { headers, data: { title } });
  expect(first.status()).toBe(201);

  const second = await request.post('/api/tasks', { headers, data: { title } });
  expect(second.status()).toBe(409);
  await expect(second.json()).resolves.toEqual({ error: 'Task title already exists' });
});
