const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/login.page');
const { TasksPage } = require('../../pages/tasks.page');
const { validUser, taskTitles } = require('../../fixtures/test-data');

async function signIn(page) {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(validUser.email, validUser.password);
}

test.beforeEach(async ({ request, page }) => {
  await request.post('/api/test/reset');
  await signIn(page);
});

test('@smoke user can create a task', async ({ page }) => {
  const tasks = new TasksPage(page);
  await tasks.createTask(taskTitles.newTask);
  await expect(tasks.taskByTitle(taskTitles.newTask)).toBeVisible();
});

test('@regression user can complete and filter a task', async ({ page }) => {
  const tasks = new TasksPage(page);
  await tasks.createTask(taskTitles.newTask);
  await tasks.toggleTask(taskTitles.newTask);
  await tasks.filter('Completed');
  await expect(tasks.taskByTitle(taskTitles.newTask)).toBeVisible();
  await tasks.filter('Active');
  await expect(tasks.taskByTitle(taskTitles.newTask)).toHaveCount(0);
});

test('@regression user can delete a task', async ({ page }) => {
  const tasks = new TasksPage(page);
  await tasks.createTask(taskTitles.newTask);
  await tasks.deleteTask(taskTitles.newTask);
  await expect(tasks.taskByTitle(taskTitles.newTask)).toHaveCount(0);
});

test('@regression empty task title is rejected', async ({ page }) => {
  const tasks = new TasksPage(page);
  await tasks.createTask('   ');
  await expect(tasks.error).toHaveText('Title is required');
});
