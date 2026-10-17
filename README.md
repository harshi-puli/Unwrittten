# CampusKey

> **Unlock the college rules no one taught you.**

CampusKey is an Inclusion & Accessibility prototype that helps first-generation and other under-supported students understand unfamiliar college requirements, reveal hidden expectations, create manageable plans, and write informed application materials.

## Live Superhuman Go integration

The installed Superhuman Go agent **CampusKey** is the live intelligence layer. It can use selected text and current browser context to:

- Decode college and opportunity requirements
- Reveal hidden expectations
- Identify missing or unverified context
- Generate prioritized action plans
- Support recommendation requests and application writing
- Write approved application and task updates into the connected Superhuman Docs workspace

All Superhuman Docs writes are review-gated. The student sees and approves proposed changes before they are saved.

The React dashboard is a separate prototype interface and does not claim automatic synchronization with Superhuman Docs. A consolidated **CampusKey** action hub clearly separates the real Go agent and shared Docs workspace from local website tools.

## Grammarly integration

Essay Studio provides prompt breakdown, student-led brainstorming, editable outlines, and a Grammarly-compatible editor. With the Grammarly Chrome extension enabled, Grammarly provides live feedback where the student writes.

The prototype does not claim to invoke an unavailable private Grammarly API. The extension is demonstrated directly in the writing field.

## Website prototype features

- Two fictional college applications
- Dashboard, requirements, tasks, progress, and deadlines
- Hidden Curriculum Decoder demo flow
- Public application-page importer with review controls
- Application creation and deletion
- Contextual selected-text actions
- Recommendation-request Writing Studio
- Grammarly Essay Studio
- Optional Momentum and Opportunity Bridge support
- Browser-local persistence and recovery safeguards

## Shared live workspace

The real CampusKey agent uses the connected Superhuman Docs workspace for review-gated application and task updates:

https://docs.superhuman.com/d/_dYWROezv3v9

The website’s **CampusKey** action hub links directly to both the live agent and this workspace.

## Run locally

```bash
npm install
npm run dev
```

This launches:

- React/Vite website: `http://localhost:5173`
- Public-page import API: `http://localhost:8787`

## Public URL importer

The importer supports public HTML requirements pages. It blocks private networks and does not access login-protected portals. Extracted deadlines and requirements remain reviewable and must be confirmed against official sources.
