# Unwritten

**Unlock the rules no one taught you.**

Unwritten is a React/Vite hackathon prototype that helps first-generation and other under-supported students understand unfamiliar academic requirements, reveal hidden expectations, create manageable plans, and write informed recommendation requests.

## Superhuman Go at the center

The installed Superhuman Go agent **Unwritten** is designed for contextual, cursor-level assistance across browser pages, documents, email, and the Unwritten dashboard.

Students can select text anywhere in the prototype and use the floating **Ask Unwritten** action to:

- Decode a requirement
- Reveal hidden expectations
- Surface missing context
- Flag claims requiring official verification
- Create next steps
- Receive contextual writing guidance

The React interface displays a clearly labeled prototype preview and creates a grounded prompt for the real Unwritten agent in Superhuman Go. It does not pretend to call a private agent API that is not available.

During the live hackathon demo, run the installed Unwritten agent in Superhuman Go on selected application text. This demonstrates Go bringing AI to the student's current cursor and browser context rather than forcing the student into a disconnected generic chatbot.

## Working features

- Shared application dashboard with two fictional colleges
- Global selected-text inline agent layer
- Hidden Curriculum Decoder workflow
- Reviewable task generation and task completion
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

## Demonstrating the inline experience

1. Open the application.
2. Select a requirement, deadline, task, or paragraph anywhere on the page.
3. Choose **Ask Unwritten** beside the selection.
4. Select an inline action such as **Reveal hidden expectations**.
5. Copy the grounded action and run it with the installed Unwritten agent in Superhuman Go.
6. Use Grammarly while editing the generated recommendation-request draft.

## Production note

A deployed version needs the Express import API hosted as a backend service. Set `VITE_IMPORT_API_URL` to that public backend URL and configure `WEB_ORIGIN` on the server to the deployed frontend origin.
