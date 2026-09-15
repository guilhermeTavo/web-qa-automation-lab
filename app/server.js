const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const seed = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'seed.json'), 'utf8'));

let tasks = JSON.parse(JSON.stringify(seed.tasks));
let nextId = Math.max(...tasks.map(t => t.id)) + 1;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function requireAuth(req, res, next) {
  const token = req.headers.authorization;
  if (token !== 'Bearer demo-token') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = seed.users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ token: 'demo-token', user: { name: user.name, email: user.email } });
});

app.get('/api/tasks', requireAuth, (req, res) => {
  res.json({ items: tasks, total: tasks.length });
});

app.post('/api/tasks', requireAuth, (req, res) => {
  const title = String(req.body?.title || '').trim();
  if (!title) return res.status(400).json({ error: 'Title is required' });
  const task = { id: nextId++, title, completed: false };
  tasks.push(task);
  res.status(201).json(task);
});

app.patch('/api/tasks/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(item => item.id === id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  if (typeof req.body.title === 'string') {
    const title = req.body.title.trim();
    if (!title) return res.status(400).json({ error: 'Title is required' });
    task.title = title;
  }
  if (typeof req.body.completed === 'boolean') task.completed = req.body.completed;
  res.json(task);
});

app.delete('/api/tasks/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const before = tasks.length;
  tasks = tasks.filter(item => item.id !== id);
  if (tasks.length === before) return res.status(404).json({ error: 'Task not found' });
  res.status(204).end();
});

app.post('/api/test/reset', (req, res) => {
  tasks = JSON.parse(JSON.stringify(seed.tasks));
  nextId = Math.max(...tasks.map(t => t.id)) + 1;
  res.status(204).end();
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`QA demo app running at http://127.0.0.1:${PORT}`);
});
