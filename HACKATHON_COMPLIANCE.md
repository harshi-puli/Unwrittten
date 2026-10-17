# Hackathon Compliance — Unwritten

## Project category

**Inclusion & Accessibility**

Unwritten reduces an information-access barrier: many academic processes assume that students already understand institutional terminology, timelines, communication norms, and application conventions. The project makes those hidden expectations visible and actionable, especially for first-generation applicants and other students without reliable access to institutional guidance.

## Central sponsor technology

The project uses a real installed Superhuman Go custom agent named **Unwritten** as a central part of the experience.

The Go agent performs the two core intelligence functions:

1. **Hidden Curriculum Decoder** — interprets academic requirements, distinguishes explicit rules from general conventions, identifies hidden expectations, and asks a useful follow-up question.
2. **Task Planner** — converts the decoded requirement and the student's answer into a manageable, prioritized action plan.

The agent also supports:

- Contextual recommendation-request and writing guidance
- Optional Momentum encouragement
- Opportunity Bridge resource guidance using verified official sources when web access is available

The React dashboard is the shared visual workspace. It tracks applications, requirements, approved tasks, deadlines, and progress. It does not falsely claim to call a private Superhuman Go API.

## Honest prototype integration

No supported private-agent API for direct React invocation was available in the build environment.

The prototype therefore uses an explicit, visible handoff:

1. A student selects or imports a requirement in the React dashboard.
2. The dashboard creates a grounded prompt containing the requirement.
3. The student selects **Open in Unwritten Go agent** and copies the prompt.
4. The installed Unwritten agent performs the real decoding and planning work in Superhuman Go.
5. The student reviews the output before accepting tasks into the dashboard.

This manual handoff must be demonstrated live. Do not describe the local deterministic demo response as if it came from Superhuman Go.

## Grammarly role

The Writing Studio is designed to be used while the Grammarly browser extension and Superhuman Go are enabled. Grammarly can provide writing feedback where the student is drafting, while the Unwritten agent supplies contextual academic guidance and identifies missing information.

Do not claim that the React application directly calls a private Grammarly API. Demonstrate Grammarly or Go operating in the browser during the live presentation.

## Compliance matrix

| Hackathon requirement | Unwritten implementation |
| --- | --- |
| Superhuman Go or Grammarly agents must be central | The installed Unwritten Go agent performs the core Decoder and Planner workflow. |
| Agents should solve a real problem | The agent exposes hidden academic expectations and converts unfamiliar requirements into next steps. |
| Other frameworks may be combined | React/Vite dashboard plus a local Express public-page importer. |
| Inclusion and accessibility inspiration | Plain language, manageable information, visible assumptions, keyboard-accessible controls, and student-controlled support. |
| Functional prototype | Dashboard, decoder flow, task acceptance, task status updates, Writing Studio, URL importer, Momentum toggle, and shared local state. |
| No fabricated policies | Institution data is marked fictional; imported data requires verification; the agent is instructed not to invent policies, deadlines, or eligibility. |

## Event-day setup checklist

Before presenting:

- [ ] Attend the event in person if vouchers or swag are required.
- [ ] Install the Grammarly Chrome extension.
- [ ] Redeem the event Grammarly voucher.
- [ ] Toggle on Superhuman Go in the extension.
- [ ] Confirm that the custom **Unwritten** agent appears in Superhuman Go.
- [ ] Test the starter prompt: `Submit two letters of recommendation.`
- [ ] Open the React application and Superhuman Go in accessible browser tabs.
- [ ] Confirm that `npm run dev` starts both the website and import backend.
- [ ] Confirm access to Devpost.
- [ ] Join the MTC Berkeley Slack and request access to the `mtc-x-grammarly` channel.
- [ ] Bring a laptop and charger.

## Competition-period rule

The event guidance says preparation is encouraged, but competition work should begin when the hacking period opens.

This repository cannot determine whether the team's work timing is eligible. The team must review the repository commit history and confirm the timing with an organizer. Do not misrepresent pre-event work as competition-period work. If necessary, ask an organizer in the `mtc-x-grammarly` Slack channel what preparation or starter code is permitted.

## Known limitations

- Login-protected application portals cannot be imported from a pasted link.
- Public-page extraction is heuristic and must be verified against official sources.
- Dashboard-to-Go transfer is a transparent manual handoff, not a hidden or invented API.
- Local storage is appropriate for the prototype but not a production student-record system.
- Automatic background reminders are represented as in-app support cards unless a supported notification system is added.
