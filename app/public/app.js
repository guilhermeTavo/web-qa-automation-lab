let token = null;
let tasks = [];
let filter = 'all';

const loginView = document.querySelector('#login-view');
const appView = document.querySelector('#app-view');
const loginForm = document.querySelector('#login-form');
const taskForm = document.querySelector('#task-form');
const taskList = document.querySelector('#task-list');
const emptyState = document.querySelector('#empty-state');
const taskError = document.querySelector('#task-error');

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  if (response.status === 204) return null;
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || 'Request failed');
  return body;
}

function renderTasks() {
  const visible = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  taskList.innerHTML = '';
  visible.forEach(task => {
    const li = document.createElement('li');
    li.className = `task ${task.completed ? 'done' : ''}`;
    li.dataset.taskId = task.id;
    li.innerHTML = `
      <label>
        <input class="toggle" type="checkbox" ${task.completed ? 'checked' : ''} />
        <span class="title">${escapeHtml(task.title)}</span>
      </label>
      <div class="task-actions">
        <button class="edit secondary" type="button">Edit</button>
        <button class="delete danger" type="button">Delete</button>
      </div>`;
    taskList.appendChild(li);
  });

  emptyState.classList.toggle('hidden', visible.length !== 0);
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
}

async function loadTasks() {
  const data = await api('/api/tasks');
  tasks = data.items;
  renderTasks();
}

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  document.querySelector('#login-error').textContent = '';
  try {
    const data = await api('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value
      })
    });
    token = data.token;
    loginView.classList.add('hidden');
    appView.classList.remove('hidden');
    await loadTasks();
  } catch (error) {
    document.querySelector('#login-error').textContent = error.message;
  }
});

taskForm.addEventListener('submit', async event => {
  event.preventDefault();
  taskError.textContent = '';
  const input = document.querySelector('#task-title');
  try {
    const task = await api('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: input.value })
    });
    tasks.push(task);
    input.value = '';
    renderTasks();
  } catch (error) {
    taskError.textContent = error.message;
  }
});

taskList.addEventListener('click', async event => {
  const item = event.target.closest('.task');
  if (!item) return;
  const id = Number(item.dataset.taskId);

  if (event.target.matches('.delete')) {
    await api(`/api/tasks/${id}`, { method: 'DELETE' });
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
  }

  if (event.target.matches('.edit')) {
    const current = tasks.find(task => task.id === id);
    const title = window.prompt('Edit task title', current.title);
    if (title === null) return;
    try {
      const updated = await api(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title })
      });
      tasks = tasks.map(task => task.id === id ? updated : task);
      renderTasks();
    } catch (error) {
      taskError.textContent = error.message;
    }
  }
});

taskList.addEventListener('change', async event => {
  if (!event.target.matches('.toggle')) return;
  const item = event.target.closest('.task');
  const id = Number(item.dataset.taskId);
  const updated = await api(`/api/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ completed: event.target.checked })
  });
  tasks = tasks.map(task => task.id === id ? updated : task);
  renderTasks();
});

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    filter = button.dataset.filter;
    document.querySelectorAll('.filter').forEach(btn => btn.classList.toggle('active', btn === button));
    renderTasks();
  });
});

document.querySelector('#logout').addEventListener('click', () => {
  token = null;
  tasks = [];
  appView.classList.add('hidden');
  loginView.classList.remove('hidden');
});
