const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/login.page');
const { TasksPage } = require('../../pages/tasks.page');
const { validUser, invalidUser } = require('../../fixtures/test-data');

test.beforeEach(async ({ request }) => {
  await request.post('/api/test/reset');
});

test('@smoke valid user can sign in', async ({ page }) => {
  const login = new LoginPage(page);
  const tasks = new TasksPage(page);

  await login.goto();
  await login.login(validUser.email, validUser.password);

  await expect(tasks.heading).toBeVisible();
  await expect(page.getByText('Review regression results')).toBeVisible();
});

test('@regression invalid credentials show a clear error', async ({ page }) => {
  const login = new LoginPage(page);

  await login.goto();
  await login.login(invalidUser.email, invalidUser.password);

  await expect(login.error).toHaveText('Invalid credentials');
  await expect(page.getByRole('heading', { name: 'Taskboard' })).toBeVisible();
});
