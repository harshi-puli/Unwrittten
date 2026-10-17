import { useEffect, useMemo, useState } from 'react';

const actions = [
  ['decode', '✣', 'Decode requirement'],
  ['expectations', '◈', 'Reveal hidden expectations'],
  ['context', '＋', 'Surface missing context'],
  ['accuracy', '✓', 'Check accuracy'],
  ['plan', '→', 'Create next steps'],
  ['writing', '✎', 'Help me write this'],
];

function buildPreview(action, text) {
  const lower = text.toLowerCase();
  const mentionsDeadline = /deadline|due|november|december|january|february|march|april|may|june|july|august|september|october/.test(lower);
  const mentionsSubmission = /submit|upload|portal|email|send/.test(lower);
  const recommendations = /recommendation|recommender|reference/.test(lower);
  const essay = /essay|statement|prompt|writing sample/.test(lower);

  if (action === 'decode') {
    return {
      title: 'In everyday words',
      body: recommendations
        ? 'The institution wants one or more eligible people to submit letters describing your preparation and potential.'
        : essay
          ? 'The institution wants a written response that explains your experiences, goals, or fit with the opportunity.'
          : 'This text describes something the student must understand, prepare, or complete. The exact official instructions should remain attached to the task.',
      note: 'Expand in the Unwritten Go agent for WHAT IT SAYS, hidden expectations, why it matters, next steps, and a follow-up question.',
    };
  }

  if (action === 'expectations') {
    const expectations = recommendations
      ? ['Confirm who qualifies as a recommender.', 'Ask early and provide useful context.', 'Check whether the recommender must submit the letter directly.']
      : essay
        ? ['Answer the exact prompt.', 'Use a specific experience and reflection.', 'Verify the official word or character limit.']
        : ['Confirm the official deadline.', 'Check the required submission method.', 'Identify who can verify unclear details.'];
    return { title: 'Possible hidden expectations', items: expectations, note: 'These are general academic conventions, not institution-specific policy.' };
  }

  if (action === 'context') {
    const missing = [];
    if (!mentionsDeadline) missing.push('The deadline is not visible in the selected text.');
    if (!mentionsSubmission) missing.push('The submission method is not clear.');
    if (recommendations) missing.push('The number and eligibility of recommenders may need confirmation.');
    if (essay) missing.push('The prompt length and evaluation criteria may need confirmation.');
    if (!missing.length) missing.push('The selection includes basic timing and submission language; confirm that it is current and official.');
    return { title: 'Context to confirm', items: missing, note: 'Unwritten surfaces gaps instead of filling them with invented facts.' };
  }

  if (action === 'accuracy') {
    return { title: 'Accuracy check', body: 'No official source is attached to this selection inside the prototype. Treat dates, eligibility, required materials, and submission instructions as unverified until checked against the institution’s official page.', note: 'The real Unwritten Go agent can research official public sources when web access is available.' };
  }

  if (action === 'plan') {
    return { title: 'Suggested starting plan', items: ['Confirm the official instructions and deadline.', 'Identify the first dependency or person you need.', 'Complete one small preparation task before expanding the full plan.'], note: 'Open in Go to personalize dates and dependencies from the full page context.' };
  }

  return { title: 'Writing guidance', body: 'Before revising, confirm the audience, purpose, opportunity, deadline, and any personal detail only the student can provide. Unwritten should teach and prompt—not invent experiences or qualifications.', note: 'Use Grammarly in the writing surface for clarity, organization, grammar, and correctness.' };
}

export default function GoInlineExperience() {
  const [selection, setSelection] = useState('');
  const [bubble, setBubble] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [action, setAction] = useState('decode');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const captureSelection = () => {
      const active = document.activeElement;
      if (active && ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName)) return;
      const current = window.getSelection();
      const text = current?.toString().trim();
      if (!text || text.length < 4) {
        if (!panelOpen) setBubble(null);
        return;
      }
      const range = current.rangeCount ? current.getRangeAt(0) : null;
      const rect = range?.getBoundingClientRect();
      if (!rect) return;
      setSelection(text.slice(0, 3000));
      setBubble({
        left: Math.min(window.innerWidth - 190, Math.max(14, rect.left + rect.width / 2 - 75)),
        top: Math.max(12, rect.top - 48),
      });
    };

    document.addEventListener('mouseup', captureSelection);
    document.addEventListener('keyup', captureSelection);
    return () => {
      document.removeEventListener('mouseup', captureSelection);
      document.removeEventListener('keyup', captureSelection);
    };
  }, [panelOpen]);

  const preview = useMemo(() => buildPreview(action, selection), [action, selection]);
  const actionLabel = actions.find(item => item[0] === action)?.[2];
  const prompt = `Use the Unwritten Superhuman Go agent inline on this selected text. Action: ${actionLabel}. Use visible page context, distinguish official requirements from general conventions, flag missing or unverified facts, and keep the first response concise with an option to expand. Selected text: “${selection}”`;

  const copyPrompt = async () => {
    await navigator.clipboard?.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1700);
  };

  const openPanel = () => {
    if (!selection) setSelection('Submit two letters of recommendation.');
    setPanelOpen(true);
    setBubble(null);
  };

  return (
    <>
      {bubble && !panelOpen && <button className="go-selection-bubble" style={{ left: bubble.left, top: bubble.top }} onMouseDown={event => event.preventDefault()} onClick={openPanel}><span>✦</span> Ask Unwritten</button>}
      <button className="go-orb" aria-label="Open Unwritten inline agent" onClick={openPanel}><span>✦</span><small>Go</small></button>

      {panelOpen && <div className="go-inline-backdrop" onMouseDown={() => setPanelOpen(false)}>
        <aside className="go-inline-panel" onMouseDown={event => event.stopPropagation()}>
          <header><div><span className="go-brand">✦ Superhuman Go · Unwritten</span><h2>Help, right where you’re working.</h2></div><button onClick={() => setPanelOpen(false)}>×</button></header>

          <section className="go-selected-context"><small>Selected page context</small><p>{selection || 'Select text anywhere in the application to use it as context.'}</p></section>

          <div className="go-actions">{actions.map(([id, icon, label]) => <button key={id} className={action === id ? 'active' : ''} onClick={() => setAction(id)}><span>{icon}</span>{label}</button>)}</div>

          <section className="go-preview">
            <div><span>Prototype preview</span><small>The real agent runs in Superhuman Go</small></div>
            <h3>{preview.title}</h3>
            {preview.body && <p>{preview.body}</p>}
            {preview.items && <ul>{preview.items.map(item => <li key={item}>{item}</li>)}</ul>}
            <aside>{preview.note}</aside>
          </section>

          <section className="go-real-agent">
            <div><strong>Continue with the real Unwritten agent</strong><p>Copy this action into Superhuman Go, where the agent can use the current browser page and selected text as context.</p></div>
            <button onClick={copyPrompt}>{copied ? 'Copied ✓' : 'Copy action for Go'}</button>
            <button className="open-go" onClick={() => window.open('https://go.superhuman.com', '_blank', 'noopener,noreferrer')}>Open Superhuman Go ↗</button>
          </section>

          <footer><strong>Why this is central:</strong> Unwritten performs decoding, context checks, planning, and writing guidance at the point of work—not in a disconnected generic chatbot.</footer>
        </aside>
      </div>}
    </>
  );
}
