# Specification

## Summary
**Goal:** Add a dedicated Home control in the TopBar that reliably returns users to the Intake profile selection screen and resets any persisted intake selections.

**Planned changes:**
- Add a thumb-friendly Home icon/button to the TopBar on non-intake routes that is visually distinct from the Back arrow and the Front/Back display-mode toggle, with an English accessible label (e.g., aria-label="Go to home").
- Implement robust pointer/touch handling for the Home control to reduce missed taps on iPad/mobile Safari/Chrome.
- When Home is activated, clear the persisted intake state (remove/reset the sessionStorage intake key) before navigating to route "/" so Step 0 (Kids/Teens/Adults/Seniors) displays without redirecting back to "/dashboard".

**User-visible outcome:** From any non-intake page (including the Dashboard), users can tap a Home icon in the TopBar to return to the main Intake profile selection (Kids/Teens/Adults/Seniors) and start a new selection flow without being auto-sent back to the Dashboard.
