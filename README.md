# Unwritten

> **Unlock the rules no one taught you.**

Unwritten is an accessible academic companion for first-generation applicants and other students who may not have reliable access to institutional knowledge. It reveals the hidden expectations behind unfamiliar college requirements and turns them into understandable, manageable next steps.

This project is an **Inclusion & Accessibility** entry for a Grammarly and Superhuman Go hackathon.

## Central Superhuman Go experience

A real installed custom Superhuman Go agent named **Unwritten** performs the project's core intelligence:

- Hidden Curriculum Decoder
- Personalized Task Planner
- Contextual Writing Support
- Optional Momentum encouragement
- Opportunity Bridge resource guidance

The React dashboard tracks shared application state and provides a visible handoff to the installed agent. Because no supported private-agent browser API was available, the prototype does not pretend that React invokes the agent directly. The live demo must show the student copying the grounded requirement prompt into the Unwritten agent in Superhuman Go.

See [HACKATHON_COMPLIANCE.md](./HACKATHON_COMPLIANCE.md) for the full compliance matrix, limitations, event-day setup, and competition-period warning.

See [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) for the two-minute live demonstration.

## Working prototype features

- Shared dashboard with two clearly fictional college applications
- Application requirements, deadlines, tasks, progress, and next actions
- Hidden Curriculum Decoder demo
- Real Unwritten Go agent handoff
- Follow-up personalization question
- Reviewable task generation
- Accepted tasks added to shared dashboard state
- Task completion updates requirement progress
- Recommendation-request Writing Studio
- Grammarly-compatible browser writing workflow
- Optional Momentum check-ins
- Opportunity Bridge resource guidance
- Public application-page URL importer
- Local-storage persistence

## Public URL importer

The importer uses a local Express backend to fetch **public HTML pages**, identify likely requirements, and create a reviewable to-do list. It blocks private/local network addresses and does not support login-protected application portals.

Imported information is never treated as automatically verified. Students must confirm the institution name, official deadline, requirements, eligibility, and policies before adding a plan.

## Run locally

```bash
npm install
npm run dev
```

This launches:

- React/Vite website: `http://localhost:5173`
- Public-page import API: `http://localhost:8787`

## Event-day requirements

Before demonstrating the sponsor integration:

1. Install the Grammarly Chrome extension.
2. Redeem the event voucher.
3. Enable Superhuman Go in the extension.
4. Confirm that the installed **Unwritten** agent is available.
5. Run the real agent during the Decoder portion of the demo.

## Production and eligibility notes

A deployed version needs the Express import API hosted as a backend service. Set `VITE_IMPORT_API_URL` to the backend URL and configure `WEB_ORIGIN` to the deployed frontend origin.

Event guidance says preparation is encouraged but competition work should begin when the hacking period opens. The team must confirm that its repository history and use of starter work are permitted by the organizers. Do not misrepresent pre-event work.
