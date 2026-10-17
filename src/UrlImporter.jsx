import { useEffect, useState } from 'react';

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
  const [selectedRequirements, setSelectedRequirements] = useState([]);

  useEffect(() => {
    if (result) setSelectedRequirements(result.requirements.filter(item => item.confidence !== 'Low').map(item => item.id));
  }, [result]);

  const analyze = async event => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await fetch(`${API_URL}/api/import-url`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The page could not be imported.');
      setResult(data);
      setInstitution(data.institutionName || '');
      setDeadline(data.deadline || '');
    } catch (caught) {
      setError(caught.message.includes('fetch') ? 'The import service is not running. Start the app with “npm run dev” so both the website and import server launch.' : caught.message);
    } finally { setLoading(false); }
  };

  const toggleRequirement = id => setSelectedRequirements(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);

  const addToDashboard = () => {
    if (!institution.trim() || !deadline) return setError('Confirm the institution name and official application deadline before saving.');
    if (!selectedRequirements.length) return setError('Select at least one requirement that you verified on the official page.');
    const deadlineDate = new Date(`${deadline}T12:00:00`);
    const included = result.requirements.filter(item => selectedRequirements.includes(item.id));
    const requirements = included.map((requirement, index) => ({
      id: makeId('requirement'), instruction: requirement.originalInstruction || requirement.title, title: requirement.title, status: 'not-started', explanation: requirement.explanation, hiddenExpectations: requirement.hiddenExpectations, followUp: 'Have you verified this requirement on the official application page?', sourceUrl: result.sourceUrl,
      tasks: requirement.tasks.map((text, taskIndex) => ({ id: makeId('task'), text, due: addDays(new Date(), Math.max(1, Math.min(requirement.suggestedDueOffset + taskIndex * 2, Math.ceil((deadlineDate - new Date()) / 86400000) - 2))), status: 'open', priority: index === 0 && taskIndex < 2 ? 'high' : 'medium' })),
    }));
    const saved = JSON.parse(localStorage.getItem('unwritten-hackathon-v1') || '[]');
    const current = Array.isArray(saved) ? saved : [];
    current.push({ id: makeId('imported-application'), institution: institution.trim(), deadline, status: 'Needs review', requirements, sourceUrl: result.sourceUrl });
    localStorage.setItem('unwritten-hackathon-v1', JSON.stringify(current));
    window.location.reload();
  };

  const close = () => { setOpen(false); setResult(null); setError(''); };

  return <><button className="url-import-launcher" onClick={() => setOpen(true)}>Import application link ↗</button>{open && <div className="url-modal-backdrop" onMouseDown={close}><section className="url-import-modal" onMouseDown={event => event.stopPropagation()}><button className="url-close" onClick={close}>×</button><span className="url-eyebrow">Public-page importer</span><h2>Turn an application page into a starting plan.</h2><p>Paste the specific page that lists application requirements. Broad homepages often contain unrelated dates and materials.</p>

    {!result && <form onSubmit={analyze}><label>Public requirements page URL<input type="url" value={url} onChange={event => setUrl(event.target.value)} placeholder="https://admission.stanford.edu/apply/first-year/" required /><small>Best results come from a requirements or checklist page, not a general admissions homepage.</small></label><button className="url-primary" disabled={loading}>{loading ? 'Reading relevant page sections…' : 'Extract requirements'}</button></form>}
    {error && <div className="url-error">{error}</div>}

    {result && <div className="url-results"><div className="url-warning"><strong>Review required</strong><span>{result.note}</span></div><label>Institution or opportunity name<input value={institution} onChange={event => setInstitution(event.target.value)} /><small>Detected from the official domain or site identity—not the first page heading.</small></label><label>Official application deadline<input type="date" value={deadline} onChange={event => setDeadline(event.target.value)} /><small>{result.deadline ? 'One high-confidence application deadline was detected. Confirm it before saving.' : 'No single reliable deadline was selected automatically. Choose a candidate below or enter the official date.'}</small></label>

      {result.deadlineCandidates?.length > 0 && <section className="deadline-candidates"><h3>Possible deadline references</h3>{result.deadlineCandidates.map(candidate => <button key={`${candidate.date}-${candidate.excerpt}`} className={deadline === candidate.date ? 'selected' : ''} onClick={() => setDeadline(candidate.date)}><strong>{new Date(`${candidate.date}T12:00:00`).toLocaleDateString()}</strong><span>{candidate.excerpt}</span></button>)}</section>}

      <div className="extracted-heading"><h3>Review detected requirements</h3><span>{selectedRequirements.length}/{result.requirements.length} selected</span></div><div className="extracted-list">{result.requirements.map(requirement => <article className={selectedRequirements.includes(requirement.id) ? 'included' : 'excluded'} key={requirement.id}><label className="include-control"><input type="checkbox" checked={selectedRequirements.includes(requirement.id)} onChange={() => toggleRequirement(requirement.id)} /><span><strong>{requirement.title}</strong><small>{requirement.confidence} confidence</small></span></label><div className="source-excerpt"><strong>Why it was detected</strong><p>{requirement.sourceExcerpt}</p></div><p>{requirement.explanation}</p><span>Possible hidden expectations</span><ul>{requirement.hiddenExpectations.map(item => <li key={item}>{item}</li>)}</ul><span>Proposed tasks</span><ol>{requirement.tasks.map(task => <li key={task}>{task}</li>)}</ol></article>)}</div>
      <div className="url-actions"><button onClick={() => { setResult(null); setError(''); }}>Try another link</button><button className="url-primary" onClick={addToDashboard}>Add selected requirements</button></div></div>}

    <div className="url-limits"><strong>Supported:</strong> public HTML requirements pages. <strong>Not supported:</strong> login-protected portals or private pages. Unwritten now shows its source excerpt and leaves ambiguous dates unselected.</div></section></div>}</>;
}
