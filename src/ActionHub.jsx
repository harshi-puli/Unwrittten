import { useEffect, useRef, useState } from 'react';

const actions = [
  { id: 'inline', icon: '✦', title: 'Ask Unwritten at the cursor', description: 'Decode selected text, reveal assumptions, check context, or create next steps.', selector: '.go-orb' },
  { id: 'essay', icon: 'G', title: 'Open Grammarly Essay Studio', description: 'Brainstorm, outline, draft, and receive live Grammarly feedback in the editor.', selector: '.essay-launcher' },
  { id: 'import', icon: '↗', title: 'Import a public application page', description: 'Extract reviewable requirements and proposed tasks from a public requirements page.', selector: '.url-import-launcher' },
  { id: 'manage', icon: '⚙', title: 'Manage applications', description: 'Review or delete browser-local application records.', selector: '.application-manager-launcher' },
];

export default function ActionHub() {
  const [open, setOpen] = useState(false);
  const hubRef = useRef(null);

  useEffect(() => {
    const close = event => {
      if (hubRef.current && !hubRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const launch = selector => {
    const target = document.querySelector(selector);
    if (target) target.click();
    setOpen(false);
  };

  return (
    <div className="action-hub" ref={hubRef}>
      {open && <section className="action-hub-menu" aria-label="Unwritten tools">
        <header><span>Unwritten tools</span><strong>Work with Go and Grammarly</strong></header>
        <button className="live-go" onClick={() => window.open('https://go.superhuman.com', '_blank', 'noopener,noreferrer')}><span>✦</span><div><strong>Open the live Unwritten Go agent</strong><small>Real decoding, planning, writing guidance, and review-gated Superhuman Docs updates.</small></div><b>↗</b></button>
        <button className="live-workspace" onClick={() => window.open('https://docs.superhuman.com/d/_dYWROezv3v9', '_blank', 'noopener,noreferrer')}><span>▦</span><div><strong>Open shared application workspace</strong><small>Superhuman Docs is the live agent-readable and review-gated source of truth.</small></div><b>↗</b></button>
        <div className="hub-divider">Website prototype tools</div>
        {actions.map(action => <button key={action.id} onClick={() => launch(action.selector)}><span>{action.icon}</span><div><strong>{action.title}</strong><small>{action.description}</small></div><b>→</b></button>)}
        <footer>The React dashboard is a separate prototype interface. It does not claim automatic synchronization with Superhuman Docs.</footer>
      </section>}
      <button className="action-hub-trigger" aria-expanded={open} onClick={() => setOpen(current => !current)}><span>✦</span><div><strong>Unwritten</strong><small>Go · Grammarly · Tools</small></div><b>{open ? '×' : '＋'}</b></button>
    </div>
  );
}
