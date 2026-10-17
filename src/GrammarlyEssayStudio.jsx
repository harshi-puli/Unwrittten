import { useMemo, useState } from 'react';

const defaultPrompt = 'Describe an experience that shaped your goals and explain how it prepared you for college.';

function analyzeDraft(draft, notes) {
  const checks = [
    { label: 'Specific experience', complete: draft.length > 180 && /when|during|after|before|moment|experience/i.test(draft), guidance: 'Anchor the essay in a concrete moment rather than only making general statements.' },
    { label: 'Reflection', complete: /learned|realized|understood|changed|grew|taught me/i.test(draft), guidance: 'Explain what the experience changed, taught you, or helped you understand.' },
    { label: 'Connection to goals', complete: /goal|future|study|college|career|next/i.test(draft), guidance: 'Connect the experience to what you hope to study, contribute, or pursue next.' },
    { label: 'Student-provided context', complete: Boolean(notes.experience && notes.learning), guidance: 'Add your own experience and reflection. Unwritten will not invent these details.' },
  ];
  return checks;
}

export default function GrammarlyEssayStudio() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [notes, setNotes] = useState({ experience: '', learning: '', goal: '' });
  const [outline, setOutline] = useState([]);
  const [draft, setDraft] = useState('');
  const [copied, setCopied] = useState(false);

  const wordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0;
  const checks = useMemo(() => analyzeDraft(draft, notes), [draft, notes]);

  const createOutline = () => {
    const safeExperience = notes.experience || '[Add a specific experience from your life]';
    const safeLearning = notes.learning || '[Explain what you learned or how you changed]';
    const safeGoal = notes.goal || '[Connect the experience to your academic or future goal]';
    setOutline([
      `Opening moment: ${safeExperience}`,
      `Context: Explain what was happening and why it mattered to you.`,
      `Reflection: ${safeLearning}`,
      `Looking forward: ${safeGoal}`,
      `Closing insight: Return to the opening and show what you now understand.`,
    ]);
    setStep(2);
  };

  const startDraft = () => {
    if (!draft) {
      setDraft(`${notes.experience || '[Start with a specific moment in your own words.]'}\n\n[Explain what happened and what your role was. Include only experiences that are true for you.]\n\n${notes.learning || '[Reflect on what you learned, understood, or changed.]'}\n\n${notes.goal || '[Connect this experience to your goals and why you are ready for the next step.]'}`);
    }
    setStep(3);
  };

  const copyDraft = async () => {
    await navigator.clipboard?.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const reset = () => {
    setStep(1);
    setPrompt(defaultPrompt);
    setNotes({ experience: '', learning: '', goal: '' });
    setOutline([]);
    setDraft('');
  };

  return (
    <>
      <button className="essay-launcher" onClick={() => setOpen(true)}><span>G</span> Essay Studio</button>
      {open && <div className="essay-backdrop" onMouseDown={() => setOpen(false)}>
        <section className="essay-modal" onMouseDown={event => event.stopPropagation()}>
          <header className="essay-header"><div><span className="essay-eyebrow">Unwritten × Grammarly</span><h2>Application Essay Studio</h2><p>Understand the prompt, develop your own ideas, and improve the writing without losing your voice.</p></div><button onClick={() => setOpen(false)}>×</button></header>

          <div className="essay-integration-note"><span>G</span><div><strong>Write directly in the editor with Grammarly enabled.</strong><p>The Grammarly Chrome extension can provide live clarity, correctness, and organization suggestions in the draft field. This site cannot detect or invoke a private Grammarly API.</p></div></div>

          <nav className="essay-steps">{['Understand & brainstorm', 'Build an outline', 'Draft & review'].map((label, index) => <button key={label} className={step === index + 1 ? 'active' : step > index + 1 ? 'done' : ''} onClick={() => setStep(index + 1)}><span>{step > index + 1 ? '✓' : index + 1}</span>{label}</button>)}</nav>

          {step === 1 && <div className="essay-two-column">
            <section className="essay-card"><label>Essay prompt<textarea value={prompt} onChange={event => setPrompt(event.target.value)} /></label><div className="prompt-breakdown"><span>What the prompt is asking</span><p>Choose one real experience, explain its effect on you, and connect that reflection to your goals or preparation.</p><span>Possible hidden expectations</span><ul><li>Use a focused story instead of summarizing your entire life.</li><li>Spend time reflecting, not only describing events.</li><li>Answer every part of the prompt in your own voice.</li></ul></div></section>
            <section className="essay-card brainstorm"><h3>Brainstorm from your own experience</h3><p>These details must come from the student. Unwritten will not fabricate them.</p><label>What specific experience might you discuss?<textarea value={notes.experience} onChange={event => setNotes({ ...notes, experience: event.target.value })} placeholder="A moment, challenge, project, responsibility, or interaction" /></label><label>What did you learn or how did you change?<textarea value={notes.learning} onChange={event => setNotes({ ...notes, learning: event.target.value })} /></label><label>How does it connect to your goals?<textarea value={notes.goal} onChange={event => setNotes({ ...notes, goal: event.target.value })} /></label><button className="essay-primary" onClick={createOutline}>Create outline from my notes →</button></section>
          </div>}

          {step === 2 && <div className="essay-two-column">
            <section className="essay-card"><div className="essay-card-title"><div><h3>Your outline</h3><p>Generated only from the information you supplied.</p></div><span>{outline.length || 5} sections</span></div><ol className="outline-list">{(outline.length ? outline : ['[Add an opening moment]', 'Explain the context', '[Add your reflection]', '[Connect to your goal]', 'Close with a final insight']).map((item, index) => <li key={`${item}-${index}`}><span>{index + 1}</span><textarea value={item} onChange={event => setOutline(current => current.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} /></li>)}</ol><button className="essay-primary" onClick={startDraft}>Start drafting →</button></section>
            <aside className="essay-card teaching-card"><span>Why this structure helps</span><h3>A strong essay balances story and reflection.</h3><p>The event gives the reader evidence. Your reflection explains why the event matters and what it reveals about you.</p><div><strong>Grammarly can help with:</strong><ul><li>Clarity and sentence flow</li><li>Grammar and punctuation</li><li>Organization and readability</li></ul></div><div><strong>Grammarly should not replace:</strong><ul><li>Your real experience</li><li>Your personal reasoning</li><li>Your authentic voice</li></ul></div></aside>
          </div>}

          {step === 3 && <div className="essay-editor-layout">
            <section className="essay-card editor-card"><div className="editor-toolbar"><div><h3>Your essay draft</h3><span>{wordCount} words · Editable</span></div><button onClick={copyDraft}>{copied ? 'Copied ✓' : 'Copy draft'}</button></div><textarea className="grammarly-editor" value={draft} onChange={event => setDraft(event.target.value)} placeholder="Write your essay here. Grammarly suggestions should appear when the browser extension is enabled." spellCheck="true" /><div className="editor-footer"><span>Look for Grammarly’s writing suggestions inside this field.</span><button onClick={() => window.open('https://go.superhuman.com', '_blank', 'noopener,noreferrer')}>Ask Unwritten in Go ↗</button></div></section>
            <aside className="essay-card review-card"><span>Contextual review</span><h3>What to strengthen</h3><div className="review-list">{checks.map(check => <div className={check.complete ? 'complete' : ''} key={check.label}><b>{check.complete ? '✓' : '○'}</b><span><strong>{check.label}</strong><small>{check.complete ? 'Present in the current draft.' : check.guidance}</small></span></div>)}</div><div className="review-warning"><strong>Accuracy reminder</strong><p>Verify institution names, program facts, word limits, and deadlines using official sources. Do not add a claim merely to make the essay sound stronger.</p></div></aside>
          </div>}

          <footer className="essay-footer"><button onClick={reset}>Reset studio</button><span>Unwritten teaches the process. Grammarly supports the writing. The student owns the story.</span></footer>
        </section>
      </div>}
    </>
  );
}
