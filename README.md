# Unwritten

**Unlock the rules no one taught you.**

Unwritten is a React/Vite hackathon prototype that helps first-generation and other under-supported students understand unfamiliar academic requirements, reveal hidden expectations, create manageable plans, and write informed recommendation requests.

## Working features

- Shared application dashboard with two fictional colleges
- Hidden Curriculum Decoder demo workflow
- Reviewable task generation and task completion
- Requirement progress synchronized with tasks
- Recommendation-request Writing Studio
- Optional Momentum and Opportunity Bridge support
- Manual, honest handoff to the installed Superhuman Go **Unwritten** agent
- Public application-page URL importer

## Public URL importer

The importer uses a local Express backend to fetch public HTML pages, identify likely requirements, and create a reviewable to-do list. It blocks private/local network addresses and does not support login-protected application portals.

Imported information is never treated as verified automatically. Students must confirm the institution name, official deadline, requirements, and policies before adding the plan to the dashboard.

## Run locally

```bash
npm install
npm run dev
```

This launches:

- React/Vite website: `http://localhost:5173`
- Public-page import API: `http://localhost:8787`

## Production note

A deployed version needs the Express import API hosted as a backend service. Set `VITE_IMPORT_API_URL` to that public backend URL and configure `WEB_ORIGIN` on the server to the deployed frontend origin.

The prototype does not claim direct browser access to a private Superhuman Go agent API. It uses a transparent copy-to-Go handoff instead.
