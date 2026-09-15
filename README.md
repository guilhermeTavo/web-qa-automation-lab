# Web QA Automation Lab

A hands-on QA automation portfolio project built with **Playwright + JavaScript**. The repository includes a small SaaS-style task manager, browser automation, REST API tests, reusable page objects, CI execution, failure artifacts, and a documented known defect.

## Why this project exists

My previous portfolio projects focus on manual QA, AI Quality, localization, and support triage. This lab adds practical automation evidence: I designed the target application, defined risk-based coverage, automated critical UI and API flows, and documented how failures should be handled.

## Validated execution

The suite was executed locally after stabilizing shared in-memory test state.

| Result | Count |
| --- | ---: |
| Passed | 10 |
| Failed | 0 |
| Skipped / known defect | 1 |
| Browser | Chromium |
| Total runtime | ~5.1s |

The skipped test is intentional: it documents a known duplicate-task defect with `test.fixme()` so the expected behavior remains executable without making the normal suite permanently red.

## What it demonstrates

- Playwright browser automation
- JavaScript test implementation
- Page Object Model
- Smoke and regression suites
- Authentication testing
- CRUD workflow coverage
- API testing with Playwright `APIRequestContext`
- HTTP status and response-body validation
- Basic response contract checks
- Negative-path validation
- Deterministic test data reset
- Screenshots, video, and traces on failure
- HTML execution reports
- GitHub Actions CI
- Known-defect documentation and executable reproduction

## Demo product

The repository contains a small task-management SaaS simulation called **Taskboard**. It is intentionally simple so the portfolio focuses on QA engineering rather than application complexity.

### Demo credentials

```text
Email: qa@example.com
Password: Playwright123!
```

## Automated coverage

### UI

| Area | Coverage |
| --- | --- |
| Authentication | Valid and invalid login |
| Task list | Seeded data visible after login |
| Create | New task appears in the UI |
| Complete | Task state updates correctly |
| Filters | Active and Completed filtering |
| Delete | Task is removed from the workspace |
| Validation | Blank task title is rejected |

### API

| Endpoint / behavior | Coverage |
| --- | --- |
| `POST /api/login` | Status, token, user contract |
| Protected endpoints | `401` without authentication |
| `GET /api/tasks` | List and basic schema checks |
| `POST /api/tasks` | Creation and validation |
| `PATCH /api/tasks/:id` | Title / completion updates |
| `DELETE /api/tasks/:id` | Successful deletion |

## Known defect

The demo application intentionally accepts duplicate task titles even though the product requirement states that titles must be unique within a workspace.

- Bug report: [`BUG-REPORTS.md`](BUG-REPORTS.md)
- Executable reproduction: [`tests/known-bug/duplicate-task.spec.js`](tests/known-bug/duplicate-task.spec.js)

The known-defect test uses `test.fixme()` so the expected behavior remains documented as code without turning the normal CI suite into permanent noise.

## Project structure

```text
web-qa-automation-lab/
├── .github/workflows/playwright.yml
├── app/
│   ├── data/seed.json
│   ├── public/
│   │   ├── app.js
│   │   ├── index.html
│   │   └── styles.css
│   └── server.js
├── fixtures/
│   └── test-data.js
├── pages/
│   ├── login.page.js
│   └── tasks.page.js
├── tests/
│   ├── api/
│   │   ├── auth-api.spec.js
│   │   └── tasks-api.spec.js
│   ├── known-bug/
│   │   └── duplicate-task.spec.js
│   └── ui/
│       ├── auth.spec.js
│       └── tasks.spec.js
├── BUG-REPORTS.md
├── TEST-STRATEGY.md
├── playwright.config.js
├── package.json
└── README.md
```

## Run locally

Requires Node.js 20+.

```bash
npm install
npx playwright install chromium
npm test
```

Playwright starts the demo application automatically through `webServer` configuration.

### Useful commands

```bash
npm run test:smoke
npm run test:regression
npm run test:ui
npm run test:api
npm run report
```

## Failure evidence

The Playwright configuration retains:

- screenshot on failure
- trace on failure
- video on failure
- HTML report

This makes a failed test useful for investigation instead of producing only a red status.

## Test strategy

See [`TEST-STRATEGY.md`](TEST-STRATEGY.md) for scope, test layers, design choices, known-defect handling, and exit criteria.

## CI

GitHub Actions installs dependencies, installs Chromium, executes the Playwright suite, and uploads the HTML report as an artifact on every push or pull request to `main`.

## Skills demonstrated

`Playwright` · `JavaScript` · `UI Automation` · `API Testing` · `Smoke Testing` · `Regression Testing` · `Page Object Model` · `REST` · `JSON` · `Bug Reporting` · `CI`

## Author

**Guilherme Tavares**  
QA Engineer · AI Quality · Software Testing
