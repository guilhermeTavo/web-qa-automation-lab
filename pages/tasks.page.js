class TasksPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'QA Tasks' });
    this.taskInput = page.getByLabel('Task title');
    this.createButton = page.getByRole('button', { name: 'Create task' });
    this.taskList = page.locator('#task-list');
    this.error = page.locator('#task-error');
  }

  taskByTitle(title) {
    return this.page.locator('.task', { hasText: title });
  }

  async createTask(title) {
    await this.taskInput.fill(title);
    await this.createButton.click();
  }

  async deleteTask(title) {
    await this.taskByTitle(title).getByRole('button', { name: 'Delete' }).click();
  }

  async toggleTask(title) {
    await this.taskByTitle(title).locator('.toggle').check();
  }

  async filter(name) {
    await this.page.getByRole('button', { name, exact: true }).click();
  }
}

module.exports = { TasksPage };
