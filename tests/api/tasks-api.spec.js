const { test, expect } = require('@playwright/test');
const { validUser, taskTitles } = require('../../fixtures/test-data');

async function authHeaders(request) {
  const response = await request.post('/api/login', { data: validUser });
  const body = await response.json();
  return { Authorization: `Bearer ${body.token}` };
}

test.beforeEach(async ({ request }) => {
  await request.post('/api/test/reset');
});

test('@smoke API can list seeded tasks', async ({ request }) => {
  const headers = await authHeaders(request);
  const response = await request.get('/api/tasks', { headers });
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(Array.isArray(body.items)).toBeTruthy();
  expect(body.total).toBe(2);
  expect(body.items[0]).toEqual(expect.objectContaining({ id: expect.any(Number), title: expect.any(String), completed: expect.any(Boolean) }));
});

test('@regression API supports create, update, and delete', async ({ request }) => {
  const headers = await authHeaders(request);

  const create = await request.post('/api/tasks', {
    headers,
    data: { title: taskTitles.newTask }
  });
  expect(create.status()).toBe(201);
  const created = await create.json();
  expect(created).toMatchObject({ title: taskTitles.newTask, completed: false });

  const update = await request.patch(`/api/tasks/${created.id}`, {
    headers,
    data: { title: taskTitles.editedTask, completed: true }
  });
  expect(update.status()).toBe(200);
  await expect(update.json()).resolves.toMatchObject({ id: created.id, title: taskTitles.editedTask, completed: true });

  const remove = await request.delete(`/api/tasks/${created.id}`, { headers });
  expect(remove.status()).toBe(204);

  const list = await request.get('/api/tasks', { headers });
  const body = await list.json();
  expect(body.items.some(task => task.id === created.id)).toBeFalsy();
});

test('@regression API rejects blank task title', async ({ request }) => {
  const headers = await authHeaders(request);
  const response = await request.post('/api/tasks', { headers, data: { title: '   ' } });
  expect(response.status()).toBe(400);
  await expect(response.json()).resolves.toEqual({ error: 'Title is required' });
});
