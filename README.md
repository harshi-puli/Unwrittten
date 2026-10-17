# Unwritten

**Unlock the rules no one taught you.**

Unwritten is a React/Vite hackathon prototype that helps first-generation and other under-supported students understand unfamiliar academic requirements, reveal hidden expectations, create manageable plans, and write informed application materials.

## Superhuman Go at the center

The installed Superhuman Go agent **Unwritten** is designed for contextual, cursor-level assistance across browser pages, documents, email, and the Unwritten dashboard.

Students can select text anywhere in the prototype and use the floating **Ask Unwritten** action to decode requirements, reveal hidden expectations, surface missing context, flag claims requiring official verification, create next steps, or request writing guidance.

The React interface displays a clearly labeled prototype preview and creates a grounded prompt for the real Unwritten agent in Superhuman Go. It does not pretend to call a private agent API that is not available.

## Grammarly Essay Studio

The Essay Studio provides a structured workflow for:

- Breaking down an essay prompt
- Identifying likely hidden expectations
- Brainstorming only from student-provided experiences
- Building an editable outline
- Drafting in a Grammarly-compatible text editor
- Reviewing story, reflection, goals, and missing context

With the Grammarly Chrome extension enabled, Grammarly can provide live writing suggestions inside the essay editor. The prototype does not claim to invoke a private Grammarly API.

Unwritten teaches the process and academic context. Grammarly supports clarity, organization, grammar, punctuation, and readability. The student owns the experiences and final writing.

## Other working features

- Shared application dashboard with two fictional colleges
- Global selected-text inline agent layer
- Hidden Curriculum Decoder workflow
- Reviewable task generation and completion
- Requirement progress synchronized with tasks
- Recommendation-request Writing Studio
- Optional Momentum and Opportunity Bridge support
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

## Demonstrating Grammarly

1. Install and enable the Grammarly Chrome extension.
2. Open **Essay Studio** in Unwritten.
3. Enter only real student experiences in the brainstorm fields.
4. Build the outline and open the draft editor.
5. Show Grammarly suggestions appearing directly where the student writes.
6. Use the Unwritten Go agent to explain the prompt or identify missing academic context.

## Production note

A deployed version needs the Express import API hosted as a backend service. Set `VITE_IMPORT_API_URL` to that backend URL and configure `WEB_ORIGIN` on the server to the deployed frontend origin.
