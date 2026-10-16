import { useEffect, useMemo, useState } from 'react';

const TODAY = new Date('2026-10-16T12:00:00');

const starterApplications = [
  {
    id: 'alder',
    name: 'Alder College',
    type: 'College',
    deadline: '2026-11-15',
    requirements: [
      {
        id: 'alder-purpose',
        title: 'Statement of purpose',
        status: 'in-progress',
        due: '2026-10-20',
        explanation: 'A short essay about what you want to study, why it matters to you, and how Alder fits your goals.',
        hiddenExpectation: 'Admissions readers expect a specific personal example and evidence that you understand why this program fits you—not only a list of achievements.',
        tasks: ['Choose one experience that shaped your goals', 'Write a rough opening paragraph', 'Ask someone to review the first draft'],
      },
      {
        id: 'alder-recommendations',
        title: 'Two faculty recommendations',
        status: 'not-started',
        due: '2026-10-15',
        explanation: 'Two letters from teachers or professors who can describe your academic work and growth.',
        hiddenExpectation: 'Recommenders need time and useful context. Ask whether high-school teachers count as faculty and give each person your deadline, goals, and a short activity list.',
        tasks: ['Confirm who qualifies as faculty', 'Choose two teachers', 'Send personalized requests'],
      },
      {
        id: 'alder-form',
        title: 'Application form',
        status: 'complete',
        due: '2026-11-10',
        explanation: 'The main application containing your personal information, education, activities, and declarations.',
        hiddenExpectation: 'Review every section even if it appears optional. Optional context fields can explain responsibilities, disruptions, or circumstances that affected your record.',
        tasks: ['Final accuracy check'],
      },
    ],
  },
  {
    id: 'lakeview',
    name: 'Lakeview University',
    type: 'College',
    deadline: '2026-12-01',
    requirements: [
      {
        id: 'lakeview-transcript',
        title: 'Official transcript',
        status: 'not-started',
        due: '2026-10-21',
        explanation: 'A transcript sent by your school that lists your courses, grades, and academic record.',
        hiddenExpectation: 'An unofficial PDF uploaded by you may not count. Your counselor or registrar may need to send the transcript directly, and processing can take several days.',
        tasks: ['Ask your counselor how transcripts are requested', 'Confirm that Lakeview received it'],
      },
      {
        id: 'lakeview-essay',
        title: 'Personal essay',
        status: 'in-progress',
        due: '2026-11-05',
        explanation: 'An essay that helps the admissions team understand you beyond grades and test scores.',
        hiddenExpectation: 'A focused story usually works better than trying to summarize your entire life. Show reflection: what changed, what you learned, and why it matters now.',
        tasks: ['Choose a focused story', 'Finish the first draft', 'Revise for clarity and voice'],
      },
      {
        id: 'lakeview-activities',
        title: 'Activities list',
        status: 'complete',
        due: '2026-11-20',
        explanation: 'A concise record of work, family responsibilities, clubs, volunteering, and other commitments.',
        hiddenExpectation: 'Paid work, caregiving, community involvement, and responsibilities at home count. Impact and consistency matter more than impressive titles.',
        tasks: ['Final review'],
      },
    ],
  },
  {
    id: 'bright-futures',
    name: 'Bright Futures Scholarship',
    type: 'Scholarship',
    deadline: '2026-11-03',
    requirements: [
      {
        id: 'bright-budget',
        title: 'Financial information',
        status: 'in-progress',
        due: '2026-10-18',
        explanation: 'Household and financial details used to evaluate eligibility for need-based funding.',
        hiddenExpectation: 'Some figures may need supporting documents. Ask a trusted adult early, and do not guess when a form requests tax or income information.',
        tasks: ['List the documents you need', 'Ask for missing household information'],
      },
      {
        id: 'bright-community',
        title: 'Community impact response',
        status: 'not-started',
        due: '2026-10-24',
        explanation: 'A short response explaining how you contributed to a community and what you learned.',
        hiddenExpectation: 'Community does not have to mean a formal organization. Family, school, work, faith groups, teams, and neighborhoods can all count.',
        tasks: ['Choose one community', 'Describe your specific contribution', 'Connect the experience to your values'],
      },
    ],
  },
];

const formatDate = value => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T12:00:00`));
const daysUntil = value => Math.ceil((new Date(`${value}T12:00:00`) - TODAY) / 86400000);
const makeId = text => `${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}`;

function urgencyFor(requirement) {
  if (requirement.status === 'complete') return { label: 'Complete', className: 'complete' };
  const days = daysUntil(requirement.due);
  if (days < 0) return { label: `${Math.abs(days)}d overdue`, className: 'overdue' };
  if (days <= 3) return { label: days === 0 ? 'Due today' : `Due in ${days}d`, className: 'urgent' };
  if (days <= 10) return { label: `Due in ${days}d`, className: 'soon' };
  return { label: requirement.status === 'in-progress' ? 'In progress' : 'Not started', className: requirement.status };
}

function nextRequirement(application) {
  return [...application.requirements]
    .filter(item => item.status !== 'complete')
    .sort((a, b) => new Date(a.due) - new Date(b.due))[0];
}

function Sidebar({ filter, setFilter }) {
  const options = ['All', 'College', 'Scholarship', 'Internship'];
  return (
    <aside className="fp-sidebar">
      <div className="fp-brand"><span>♧</span><strong>Firstpath</strong></div>
      <div className="fp-chapter"><small>Your next chapter</small><p>Fall 2027 applications</p></div>
      <nav className="fp-nav">
        <button className="active">◉ <span>Overview</span></button>
        <button>✓ <span>My tasks</span></button>
        <button>✎ <span>My drafts</span></button>
      </nav>
      <div className="fp-filter">
        <small>Show opportunities</small>
        {options.map(option => <button key={option} className={filter === option ? 'selected' : ''} onClick={() => setFilter(option)}>{option}</button>)}
      </div>
      <div className="fp-encouragement"><span>◈</span><strong>You don’t have to know it all.</strong><p>Firstpath turns hidden expectations into visible, manageable steps.</p></div>
      <div className="fp-profile"><span>MC</span><div><strong>Maya Chen</strong><small>My workspace</small></div></div>
    </aside>
  );
}

function SummaryCard({ label, value, note, tone }) {
  return <article className={`summary-card ${tone || ''}`}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>;
}

function RequirementRow({ requirement, onToggle, onOpen }) {
  const urgency = urgencyFor(requirement);
  return (
    <div className={`requirement-item ${urgency.className}`}>
      <button className={`status-check ${requirement.status === 'complete' ? 'checked' : ''}`} onClick={onToggle} aria-label={`Toggle ${requirement.title}`}>{requirement.status === 'complete' ? '✓' : ''}</button>
      <button className="requirement-main" onClick={onOpen}>
        <span><strong>{requirement.title}</strong><small>Suggested deadline: {formatDate(requirement.due)}</small></span>
        <span className={`urgency-badge ${urgency.className}`}>{urgency.label}</span>
      </button>
    </div>
  );
}

function ApplicationCard({ application, onToggle, onExplain, onAddRequirement }) {
  const completed = application.requirements.filter(item => item.status === 'complete').length;
  const progress = application.requirements.length ? Math.round((completed / application.requirements.length) * 100) : 0;
  const next = nextRequirement(application);
  const deadlineDays = daysUntil(application.deadline);
  return (
    <article className="application-card">
      <header className="application-header">
        <div className="institution-mark">{application.name.split(' ').map(word => word[0]).slice(0, 2).join('')}</div>
        <div><span className="opportunity-type">{application.type}</span><h2>{application.name}</h2><p>Application deadline: <strong>{formatDate(application.deadline)}</strong> · {deadlineDays} days</p></div>
        <span className={`deadline-chip ${deadlineDays <= 21 ? 'urgent' : ''}`}>{deadlineDays <= 21 ? 'Time-sensitive' : 'Upcoming'}</span>
      </header>

      <div className="progress-heading"><span>{completed} of {application.requirements.length} requirements complete</span><strong>{progress}%</strong></div>
      <div className="progress-bar"><i style={{ width: `${progress}%` }} /></div>

      <div className="requirements-title"><h3>Requirements and status</h3><button onClick={onAddRequirement}>＋ Add requirement</button></div>
      <div className="requirements-stack">
        {application.requirements.map(requirement => <RequirementRow key={requirement.id} requirement={requirement} onToggle={() => onToggle(requirement.id)} onOpen={() => onExplain(requirement)} />)}
      </div>

      {next ? (
        <div className="next-recommendation">
          <div><small>Next recommended action</small><strong>{next.tasks[0] || `Continue ${next.title}`}</strong><span>Based on the earliest incomplete requirement: {next.title}</span></div>
          <button onClick={() => onExplain(next)}>View explanation & plan →</button>
        </div>
      ) : <div className="all-complete">✓ All listed requirements are complete.</div>}
    </article>
  );
}

function RequirementPanel({ application, requirement, onClose, onToggle }) {
  if (!application || !requirement) return null;
  const urgency = urgencyFor(requirement);
  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside className="requirement-drawer" onMouseDown={event => event.stopPropagation()}>
        <button className="drawer-close" onClick={onClose}>×</button>
        <span className="drawer-eyebrow">{application.name} · Requirement guide</span>
        <h2>{requirement.title}</h2>
        <span className={`urgency-badge ${urgency.className}`}>{urgency.label}</span>

        <section className="drawer-section explanation-section"><small>In everyday words</small><p>{requirement.explanation}</p></section>
        <section className="drawer-section hidden-section"><small>Hidden expectation identified by Firstpath</small><p>{requirement.hiddenExpectation}</p></section>
        <section className="drawer-section"><small>Suggested action plan</small><ol>{requirement.tasks.map(task => <li key={task}>{task}</li>)}</ol></section>
        <section className="drawer-deadline"><span>Suggested deadline</span><strong>{formatDate(requirement.due)}</strong></section>
        <button className="drawer-primary" onClick={onToggle}>{requirement.status === 'complete' ? 'Mark as incomplete' : 'Mark requirement complete'}</button>
        <p className="drawer-note">AI explanations are starting points, not official admissions guidance. Confirm requirements with the institution.</p>
      </aside>
    </div>
  );
}

function AddApplicationModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: '', type: 'College', deadline: '' });
  const submit = event => { event.preventDefault(); if (!form.name || !form.deadline) return; onSave(form); };
  return (
    <div className="modal-backdrop" onMouseDown={onClose}><form className="fp-modal" onMouseDown={event => event.stopPropagation()} onSubmit={submit}><button type="button" className="drawer-close" onClick={onClose}>×</button><span className="drawer-eyebrow">New opportunity</span><h2>Add an application</h2><label>Institution or opportunity name<input value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="Example: Horizon Internship" /></label><label>Opportunity type<select value={form.type} onChange={event => setForm({ ...form, type: event.target.value })}><option>College</option><option>Scholarship</option><option>Internship</option><option>Program</option></select></label><label>Application deadline<input type="date" value={form.deadline} onChange={event => setForm({ ...form, deadline: event.target.value })} /></label><button className="drawer-primary" type="submit">Add application</button></form></div>
  );
}

function AddRequirementModal({ application, onClose, onSave }) {
  const [form, setForm] = useState({ title: '', due: '', explanation: '', hiddenExpectation: '' });
  const submit = event => { event.preventDefault(); if (!form.title || !form.due) return; onSave(form); };
  return (
    <div className="modal-backdrop" onMouseDown={onClose}><form className="fp-modal wide" onMouseDown={event => event.stopPropagation()} onSubmit={submit}><button type="button" className="drawer-close" onClick={onClose}>×</button><span className="drawer-eyebrow">{application.name}</span><h2>Add a requirement</h2><label>Requirement name<input value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} placeholder="Example: Supplemental essay" /></label><label>Suggested deadline<input type="date" value={form.due} onChange={event => setForm({ ...form, due: event.target.value })} /></label><label>Plain-language explanation<textarea value={form.explanation} onChange={event => setForm({ ...form, explanation: event.target.value })} placeholder="What is the institution asking for?" /></label><label>Hidden expectation<textarea value={form.hiddenExpectation} onChange={event => setForm({ ...form, hiddenExpectation: event.target.value })} placeholder="What might a first-generation student not be told explicitly?" /></label><button className="drawer-primary" type="submit">Add requirement</button></form></div>
  );
}

export default function DashboardV2() {
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('firstpath-applications-v2');
    return saved ? JSON.parse(saved) : starterApplications;
  });
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [addingApplication, setAddingApplication] = useState(false);
  const [addingRequirementTo, setAddingRequirementTo] = useState(null);

  useEffect(() => localStorage.setItem('firstpath-applications-v2', JSON.stringify(applications)), [applications]);

  const visibleApplications = filter === 'All' ? applications : applications.filter(item => item.type === filter);
  const allRequirements = applications.flatMap(item => item.requirements);
  const completedCount = allRequirements.filter(item => item.status === 'complete').length;
  const urgentCount = allRequirements.filter(item => ['overdue', 'urgent'].includes(urgencyFor(item).className)).length;
  const nextActions = useMemo(() => applications.map(application => ({ application, requirement: nextRequirement(application) })).filter(item => item.requirement).sort((a, b) => new Date(a.requirement.due) - new Date(b.requirement.due)).slice(0, 4), [applications]);

  const toggleRequirement = (applicationId, requirementId) => setApplications(items => items.map(application => application.id !== applicationId ? application : { ...application, requirements: application.requirements.map(requirement => requirement.id !== requirementId ? requirement : { ...requirement, status: requirement.status === 'complete' ? 'not-started' : 'complete' }) }));

  const addApplication = form => {
    setApplications(items => [...items, { id: makeId(form.name), name: form.name, type: form.type, deadline: form.deadline, requirements: [] }]);
    setAddingApplication(false);
  };

  const addRequirement = form => {
    setApplications(items => items.map(application => application.id !== addingRequirementTo.id ? application : { ...application, requirements: [...application.requirements, { id: makeId(form.title), title: form.title, due: form.due, status: 'not-started', explanation: form.explanation || 'This requirement has not been translated into everyday language yet.', hiddenExpectation: form.hiddenExpectation || 'Ask what reviewers expect, who can help, and whether there are unstated formatting or submission rules.', tasks: [`Clarify the instructions for ${form.title}`, `Start ${form.title}`, `Review and submit ${form.title}`] }] }));
    setAddingRequirementTo(null);
  };

  const selectedApplication = selected ? applications.find(item => item.id === selected.applicationId) : null;
  const selectedRequirement = selectedApplication?.requirements.find(item => item.id === selected.requirementId);

  return (
    <div className="fp-app">
      <Sidebar filter={filter} setFilter={setFilter} />
      <main className="fp-main">
        <header className="fp-topbar"><span>Application overview</span><div>Friday, October 16, 2026 <span>♧</span></div></header>
        <div className="fp-content">
          <section className="dashboard-hero"><div><span>One place for every opportunity</span><h1>Know where you stand—and what to do next.</h1><p>Track applications, translate hidden expectations, and turn every requirement into a manageable plan.</p></div><button onClick={() => setAddingApplication(true)}>Add application ＋</button></section>

          <section className="summary-grid">
            <SummaryCard label="Active applications" value={applications.length} note={`${applications.filter(item => item.type === 'College').length} colleges and ${applications.filter(item => item.type !== 'College').length} other opportunities`} />
            <SummaryCard label="Requirements complete" value={`${completedCount}/${allRequirements.length}`} note="Progress updates when tasks are completed" tone="success" />
            <SummaryCard label="Needs attention" value={urgentCount} note="Overdue or due within three days" tone={urgentCount ? 'attention' : ''} />
          </section>

          {nextActions.length > 0 && <section className="priority-strip"><div><span>✣</span><div><small>Highest-priority next step</small><strong>{nextActions[0].requirement.tasks[0]}</strong><p>{nextActions[0].application.name} · {nextActions[0].requirement.title} · suggested by {formatDate(nextActions[0].requirement.due)}</p></div></div><button onClick={() => setSelected({ applicationId: nextActions[0].application.id, requirementId: nextActions[0].requirement.id })}>Open action plan →</button></section>}

          <div className="applications-heading"><div><h2>Applications and opportunities</h2><p>{visibleApplications.length} shown · Select any requirement for its explanation and action plan.</p></div><button onClick={() => { localStorage.removeItem('firstpath-applications-v2'); setApplications(starterApplications); }}>Reset demo data</button></div>

          <section className="applications-list">
            {visibleApplications.map(application => <ApplicationCard key={application.id} application={application} onToggle={requirementId => toggleRequirement(application.id, requirementId)} onExplain={requirement => setSelected({ applicationId: application.id, requirementId: requirement.id })} onAddRequirement={() => setAddingRequirementTo(application)} />)}
            {visibleApplications.length === 0 && <div className="empty-state"><h2>No {filter.toLowerCase()} applications yet.</h2><p>Add an opportunity or choose another filter.</p></div>}
          </section>
          <footer>Illustrative student workspace · Verify deadlines and official requirements with each institution.</footer>
        </div>
      </main>

      {selected && <RequirementPanel application={selectedApplication} requirement={selectedRequirement} onClose={() => setSelected(null)} onToggle={() => toggleRequirement(selected.applicationId, selected.requirementId)} />}
      {addingApplication && <AddApplicationModal onClose={() => setAddingApplication(false)} onSave={addApplication} />}
      {addingRequirementTo && <AddRequirementModal application={addingRequirementTo} onClose={() => setAddingRequirementTo(null)} onSave={addRequirement} />}
    </div>
  );
}
