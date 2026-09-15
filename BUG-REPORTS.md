# Bug Reports

## BUG-001 — Duplicate task titles are accepted

**Severity:** Medium  
**Priority:** P2  
**Status:** Known / Open  
**Area:** Task creation / API validation

### Requirement

Task titles must be unique within the workspace so users can reliably distinguish and reference work items.

### Environment

- Local demo application
- REST endpoint: `POST /api/tasks`
- Playwright APIRequestContext

### Preconditions

- User is authenticated.
- Workspace already contains a task with the target title.

### Steps to reproduce

1. Authenticate with a valid user.
2. Create a task named `Duplicate title validation`.
3. Submit a second task with the same title.
4. Inspect the second API response and task list.

### Expected result

The second request is rejected with HTTP `409 Conflict` and a clear validation message.

### Actual result

The API accepts the duplicate and returns HTTP `201 Created`, resulting in two tasks with identical titles.

### Impact

Duplicate titles create ambiguity in task selection, communication, and future automation that relies on human-readable task names.

### Automated evidence

`tests/known-bug/duplicate-task.spec.js`

The test is deliberately marked `test.fixme()` until the product defect is resolved. This keeps the main regression suite actionable while preserving expected behavior as executable documentation.

### Retest criteria

- First unique title returns `201`.
- Duplicate title returns `409`.
- Response contains `{ "error": "Task title already exists" }`.
- Original task remains unchanged.
- A different unique title can still be created normally.
