# Test Strategy — Web QA Automation Lab

## Objective

Demonstrate a practical QA automation workflow using Playwright against a small SaaS-style task manager with both browser and REST API coverage.

## Scope

### UI coverage
- Valid and invalid authentication
- Seeded task visibility after login
- Task creation
- Task completion
- Task filtering
- Task deletion
- Required-field validation

### API coverage
- Authentication contract
- Authorization failures
- Task listing
- Create, update, and delete flows
- Response status validation
- Response body and basic contract checks
- Validation errors

## Test layers

### Smoke
Fast checks for the highest-value paths:
- Valid login
- Seeded task list loads
- User can create a task
- API login works
- API task list is available

### Regression
Broader checks around negative paths, CRUD behavior, filtering, validation, and authorization.

## Design choices

- **Playwright + JavaScript:** aligns with an existing JavaScript background while demonstrating modern QA automation.
- **Page Object Model:** selectors and common UI actions are isolated from assertions.
- **Deterministic reset endpoint:** each test can return the demo app to known seed data.
- **APIRequestContext:** API checks use Playwright natively rather than introducing a second HTTP library.
- **Artifacts on failure:** trace, screenshot, and video are retained when tests fail.
- **HTML report:** execution evidence is available through Playwright's built-in reporter.

## Known defect handling

The demo application intentionally contains one documented defect: duplicate task titles are accepted even though the product requirement states that task titles in a workspace must be unique.

The executable reproduction is stored under `tests/known-bug/` and marked with `test.fixme()` so the main suite remains actionable while preserving the expected behavior as code.

## Exit criteria

A portfolio run is considered healthy when:
- All non-known-bug smoke tests pass.
- All non-known-bug regression tests pass.
- No unexpected test is skipped.
- The known defect remains documented until fixed and retested.
