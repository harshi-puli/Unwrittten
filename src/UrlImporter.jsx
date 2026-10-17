import { useState } from 'react';

const API_URL = import.meta.env.VITE_IMPORT_API_URL || 'http://localhost:8787';
const makeId = prefix => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const addDays = (date, days) => new Date(date.getTime() + days * 86400000).toISOString().slice(0, 10);

export default function UrlImporter() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [institution, setInstitution] = useState('');
  const [deadline, setDeadline] = useState('');

  const analyze = async event => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await fetch(`${API_URL}/api/import-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The page could not be imported.');
      setResult(data);
      setInstitution(data.title.replace(/\s*[|–—-].*$/, '').slice(0, 80));
      setDeadline(data.deadline || '');
    } catch (caught) {
      setError(caught.message.includes('fetch') ? 'The import service is not running. Start the app with “npm run dev” so both the website and import server launch.' : caught.message);
    } finally {
      setLoading(false);
    }
  };

  const addToDashboard = () => {
    if (!institution.trim() || !deadline) {
      setError('Confirm the institution name and official application deadline before saving.');
      return;
    }

    const deadlineDate = new Date(`${deadline}T12:00:00`);
    const applicationId = makeId('imported-application');
    const requirements = result.requirements.map((requirement, index) => ({
      id: makeId('requirement'),
      instruction: requirement.originalInstruction || requirement.title,
      title: requirement.title,
      status: 'not-started',
      explanation: requirement.explanation,
      hiddenExpectations: requirement.hiddenExpectations,
      followUp: 'Have you reviewed this requirement on the official application page?',
      tasks: requirement.tasks.map((text, taskIndex) => ({
        id: makeId('task'),
        text,
        due: addDays(new Date(), Math.max(1, Math.min(requirement.suggestedDueOffset + taskIndex * 2, Math.ceil((deadlineDate - new Date()) / 86400000) - 2))),
        status: 'open',
        priority: index === 0 && taskIndex < 2 ? 'high' : 'medium',
      })),
      sourceUrl: result.sourceUrl,
    }));

    const saved = JSON.parse(localStorage.getItem('unwritten-hackathon-v1') || '[]');
    const current = Array.isArray(saved) ? saved : [];
    current.push({ id: applicationId, institution: institution.trim(), deadline, status: 'Needs review', requirements, sourceUrl: result.sourceUrl });
    localStorage.setItem('unwritten-hackathon-v1', JSON.stringify(current));
    window.location.reload();
  };

  const close = () => { setOpen(false); setResult(null); setError(''); };

  return (
    <>
      <button className="url-import-launcher" onClick={() => setOpen(true)}>Import application link ↗</button>
      {open && <div className="url-modal-backdrop" onMouseDown={close}>
        <section className="url-import-modal" onMouseDown={event => event.stopPropagation()}>
          <button className="url-close" onClick={close}>×</button>
          <span className="url-eyebrow">Public-page importer</span>
          <h2>Turn an application page into a starting plan.</h2>
          <p>Paste a public admissions, scholarship, or opportunity page. Unwritten will extract likely requirements and proposed tasks for your review.</p>

          {!result && <form onSubmit={analyze}>
            <label>Public application page URL<input type="url" value={url} onChange={event => setUrl(event.target.value)} placeholder="https://admission.ucla.edu/..." required /></label>
            <button className="url-primary" disabled={loading}>{loading ? 'Reading the public page…' : 'Extract requirements'}</button>
          </form>}

          {error && <div className="url-error">{error}</div>}

          {result && <div className="url-results">
            <div className="url-warning"><strong>Review required</strong><span>{result.note}</span></div>
            <label>Institution or opportunity name<input value={institution} onChange={event => setInstitution(event.target.value)} /></label>
            <label>Official application deadline<input type="date" value={deadline} onChange={event => setDeadline(event.target.value)} /><small>{result.deadline ? 'A possible date was detected. Confirm it on the official page.' : 'No reliable deadline was detected. Enter the official date before saving.'}</small></label>
            <div className="extracted-heading"><h3>Extracted requirements and proposed to-do list</h3><span>{result.requirements.length} found</span></div>
            <div className="extracted-list">{result.requirements.map(requirement => <article key={requirement.id}><strong>{requirement.title}</strong><p>{requirement.explanation}</p><span>Possible hidden expectations</span><ul>{requirement.hiddenExpectations.map(item => <li key={item}>{item}</li>)}</ul><span>Proposed tasks</span><ol>{requirement.tasks.map(task => <li key={task}>{task}</li>)}</ol></article>)}</div>
            <div className="url-actions"><button onClick={() => { setResult(null); setError(''); }}>Try another link</button><button className="url-primary" onClick={addToDashboard}>Add reviewed plan to dashboard</button></div>
          </div>}

          <div className="url-limits"><strong>Supported:</strong> public HTML pages. <strong>Not supported:</strong> login-protected application portals, private pages, or pages that block server access. Imported details are suggestions until you verify them.</div>
        </section>
      </div>}
    </>
  );
}
