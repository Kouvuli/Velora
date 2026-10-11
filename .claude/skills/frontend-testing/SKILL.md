---
name: frontend-testing
description: Plans and writes browser-level frontend tests - end-to-end user journeys with Playwright or Cypress, component tests through the user's view, visual regression, accessibility checks in tests, network mocking, and stable selectors - and fixes flaky UI tests. Use when adding e2e or UI tests, setting up Playwright or Cypress, testing a user flow in the browser, or when frontend tests are flaky or only snapshot the page.
license: MIT
---

# Frontend testing

## Purpose
Confidence that real user journeys work in a browser, from tests that fail for real bugs and not for timing or markup changes.

## When to use
- E2E tests for flows (sign-up, checkout), Playwright/Cypress setup, visual regression, flaky UI tests, deciding what to test at which level in the frontend.

## When NOT to use
- Unit and integration test practice in general, and backend tests: `testing`.
- React component conventions with React Testing Library: `react` (this skill decides the frontend test strategy and covers browser tests).

## Procedure
1. **Pick the level**: logic in unit tests; a component's behaviour in component tests; only critical journeys end-to-end (few, high value). Do not e2e-test what a unit test can prove.
2. **Test behaviour through the user's view**: locate by role, label and text (`getByRole('button', { name: 'Add' })`), not CSS classes or DOM structure; assert visible outcomes (text, URL, enabled state), not implementation details. For a dynamic app, look before you script: load the page, wait until it has settled, inspect the rendered DOM or a screenshot, and take selectors from what actually rendered rather than guessing from source.
3. **Cover the unhappy paths**: validation errors, server errors, empty states, slow responses. Mock the network at the boundary (Playwright `route`, MSW) for deterministic data; keep at least one smoke test against the real backend if the project has an environment for it.
4. **No arbitrary waits**: rely on auto-waiting assertions (`expect(locator).toBeVisible()`), never `sleep`. Isolate tests (fresh state per test), make them order-independent.
5. **Visual regression** only for stable, intentional visuals, with masked dynamic content; a screenshot is not a substitute for behaviour assertions.
6. **Accessibility in tests**: add an automated a11y check (e.g. axe) on key pages when the project uses one.
7. **Run them** with the project's command and report the real result. Start every server the journey needs (frontend and backend) and wait until each answers before the run; capture browser console errors during it, they are findings too. If the browser tools are not installed, say so and how to run them.

## Output
Test files, what each test proves, how to run them, and the actual run result or why it could not run.

## Failure modes
- Screenshot-only tests that pass while buttons are broken.
- Selectors tied to CSS classes or nth-child; `waitForTimeout`.
- Dozens of slow e2e tests duplicating unit tests.
- Reporting tests as passing when the browser runner was never executed.
