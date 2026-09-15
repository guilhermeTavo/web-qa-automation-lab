const { test, expect } = require('@playwright/test');
const { validUser } = require('../../fixtures/test-data');

test('@smoke API login returns token and user contract', async ({ request }) => {
  const response = await request.post('/api/login', { data: validUser });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body).toMatchObject({
    token: 'demo-token',
    user: { email: validUser.email, name: 'QA User' }
  });
  expect(typeof body.token).toBe('string');
});

test('@regression protected endpoint rejects missing token', async ({ request }) => {
  const response = await request.get('/api/tasks');
  expect(response.status()).toBe(401);
  await expect(response.json()).resolves.toEqual({ error: 'Unauthorized' });
});
