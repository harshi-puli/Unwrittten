import { useEffect, useMemo, useState } from 'react';

const TODAY = new Date('2026-10-16T12:00:00');

const demoApplications = [
  {
    id: 'redwood',
    institution: 'Redwood College',
    deadline: '2026-11-15',
    status: 'In progress',
    requirements: [
      {
        id: 'redwood-statement',
        instruction: 'Submit a personal statement describing your goals and preparation.',
        title: 'Personal statement',
        status: 'in-progress',
        explanation: 'Write an essay that helps Redwood understand your goals, experiences, and preparation.',
        hiddenExpectations: ['Use a specific experience instead of only listing achievements.', 'Explain what you learned and how it connects to your goals.', 'Show why Redwood is relevant without inventing program details.'],
        followUp: 'Do you already have a personal experience you may want to write about?',
        tasks: [
          { id: 'r-story', text: 'Choose one experience that shaped your goals', due: '2026-10-19', status: 'done', priority: 'high' },
          { id: 'r-outline', text: 'Create a simple essay outline', due: '2026-10-22', status: 'open', priority: 'high' },
          { id: 'r-draft', text: 'Write a first personal-statement draft', due: '2026-10-29', status: 'open', priority: 'medium' },
        ],
      },
      {
        id: 'redwood-recs',
        instruction: 'Submit two letters of recommendation.',
        title: 'Two recommendation letters',
        status: 'not-started',
        explanation: 'Ask two eligible people to submit letters supporting your application.',
        hiddenExpectations: ['Choose people who know your work rather than the most impressive title.', 'Ask early enough for them to write thoughtfully.', 'Provide your goals, deadline, and helpful context.', 'The college may require recommenders to submit letters directly.'],
        followUp: 'Have you already identified people you could ask?',
        tasks: [],
      },
      {
        id: 'redwood-transcript',
        instruction: 'Provide an official academic transcript.',
        title: 'Academic transcript',
        status: 'complete',
        explanation: 'Ask your school to send an official record of your courses and grades.',
        hiddenExpectations: ['A student-uploaded copy may not count as official.', 'Processing can take several school days.'],
        followUp: 'Has your school confirmed that it was sent?',
        tasks: [{ id: 'r-transcript', text: 'Confirm transcript receipt', due: '2026-10-25', status: 'done', priority: 'medium' }],
      },
    ],
  },
  {
    id: 'north-valley',
    institution: 'North Valley University',
    deadline: '2026-12-01',
    status: 'Getting started',
    requirements: [
      {
        id: 'north-supplement',
        instruction: 'Complete the supplemental essay.',
        title: 'Supplemental essay',
        status: 'not-started',
        explanation: 'Answer an additional question written specifically for North Valley applicants.',
        hiddenExpectations: ['Answer the exact question instead of reusing a general personal statement.', 'Connect your response to your experiences and goals.', 'Verify the official word limit before drafting.'],
        followUp: 'Do you have the exact essay prompt and word limit?',
        tasks: [],
      },
      {
        id: 'north-rec',
        instruction: 'Submit one recommendation letter.',
        title: 'One recommendation letter',
        status: 'in-progress',
        explanation: 'Ask one eligible person to submit a letter supporting your application.',
        hiddenExpectations: ['Confirm who qualifies before asking.', 'Share the deadline and what you are applying for.'],
        followUp: 'Has the recommender agreed to write the letter?',
        tasks: [{ id: 'n-ask', text: 'Ask Ms. Rivera for a recommendation', due: '2026-10-20', status: 'open', priority: 'high' }],
      },
      {
        id: 'north-aid',
        instruction: 'Complete all required financial aid materials.',
        title: 'Financial aid application',
        status: 'not-started',
        explanation: 'Review North Valley’s official financial-aid instructions and complete each required form.',
        hiddenExpectations: ['Admissions and financial-aid deadlines may be different.', 'Some documents require household financial information.', 'Never pay a third party merely to access the official FAFSA form.'],
        followUp: 'Have you reviewed North Valley’s official financial-aid page?',
        tasks: [],
      },
    ],
  },
];

const navItems = [
  ['dashboard', '◉', 'Dashboard'],
  ['applications', '⌂', 'My Applications'],
  ['decoder', '✣', 'Hidden Curriculum'],
  ['tasks', '✓', 'My Tasks'],
  ['writing', '✎', 'Writing Studio'],
  ['support', '♡', 'Student Support'],
];

const formatDate = value => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T12:00:00`));
const daysUntil = value => Math.ceil((new Date(`${value}T12:00:00`) - TODAY) / 86400000);
const makeId = prefix => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

function progressFor(application) {
  const total = application.requirements.length;
  const complete = application.requirements.filter(item => item.status === 'complete').length;
  return total ? Math.round((complete / total) * 100) : 0;
}

function dueTone(date, status) {
  if (status === 'done' || status === 'complete') return 'complete';
  const days = daysUntil(date);
  if (days < 0) return 'overdue';
  if (days <= 3) return 'urgent';
  if (days <= 10) return 'soon';
  return 'normal';
}

function Sidebar({ section, setSection }) {
  return (
    <aside className="uw-sidebar">
      <button className="uw-logo" onClick={() => setSection('dashboard')}><span>U</span><div><strong>Unwritten</strong><small>Unlock the rules no one taught you.</small></div></button>
      <nav>{navItems.map(([id, icon, label]) => <button key={id} className={section === id ? 'active' : ''} onClick={() => setSection(id)}><span>{icon}</span>{label}</button>)}</nav>
      <div className="uw-sponsored"><small>Hackathon prototype</small><strong>Powered by a Superhuman Go agent</strong><p>Grammarly supports contextual writing feedback in the Writing Studio.</p></div>
      <div className="uw-user"><span>MC</span><div><strong>Maya Chen</strong><small>Demo student</small></div></div>
    </aside>
  );
}

function AgentHandoff({ requirement, onClose }) {
  const [copied, setCopied] = useState(false);
  if (!requirement) return null;
  const prompt = `Use the Unwritten agent to decode this requirement. Distinguish official requirements from general conventions and return WHAT IT SAYS, WHAT YOU MIGHT NOT KNOW, WHY IT MATTERS, WHAT YOU NEED TO DO, and QUESTIONS TO CONSIDER. Requirement: “${requirement.instruction}”`;
  const copy = async () => { await navigator.clipboard?.writeText(prompt); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  return (
    <aside className="uw-agent-panel">
      <button className="close" onClick={onClose}>×</button>
      <span className="agent-label">Superhuman Go integration</span>
      <h2>Continue with the Unwritten agent</h2>
      <p>The browser prototype cannot invoke a private Go agent directly. Copy this grounded prompt into the installed <strong>Unwritten</strong> Go agent.</p>
      <div className="agent-prompt">{prompt}</div>
      <button className="primary" onClick={copy}>{copied ? 'Prompt copied ✓' : 'Copy prompt for Go'}</button>
      <small>This is an honest manual handoff for the hackathon prototype—not a simulated API integration.</small>
    </aside>
  );
}

function AppCard({ application, openRequirement, toggleTask, setSection }) {
  const progress = progressFor(application);
  const tasks = application.requirements.flatMap(requirement => requirement.tasks.map(task => ({ ...task, requirementId: requirement.id })));
  const nextTask = [...tasks].filter(task => task.status !== 'done').sort((a, b) => new Date(a.due) - new Date(b.due))[0];
  return (
    <article className="uw-app-card">
      <header><div className="institution-icon">{application.institution.split(' ').map(word => word[0]).slice(0, 2).join('')}</div><div><h3>{application.institution}</h3><p>Fictional demo institution · Due {formatDate(application.deadline)}</p></div><span className={`deadline ${daysUntil(application.deadline) <= 30 ? 'soon' : ''}`}>{daysUntil(application.deadline)} days</span></header>
      <div className="progress-meta"><span>{application.status}</span><strong>{progress}% complete</strong></div><div className="progress"><i style={{ width: `${progress}%` }} /></div>
      <div className="requirements"><div className="requirements-head"><strong>Required materials</strong><span>{application.requirements.filter(item => item.status === 'complete').length}/{application.requirements.length} complete</span></div>{application.requirements.map(requirement => <button key={requirement.id} className={`requirement ${requirement.status}`} onClick={() => openRequirement(application.id, requirement.id)}><span className="check">{requirement.status === 'complete' ? '✓' : ''}</span><span><strong>{requirement.title}</strong><small>{requirement.hiddenExpectations.length} hidden expectations identified</small></span><b>{requirement.status.replace('-', ' ')}</b></button>)}</div>
      <div className="next-action"><small>Next recommended action</small><strong>{nextTask?.text || 'Review the next incomplete requirement'}</strong><span>{nextTask ? `Suggested by ${formatDate(nextTask.due)}` : 'Open a requirement to generate a plan'}</span><button onClick={() => nextTask ? setSection('tasks') : openRequirement(application.id, application.requirements.find(item => item.status !== 'complete')?.id)}>Open next step →</button></div>
    </article>
  );
}

function Dashboard({ applications, setSection, openRequirement, toggleTask, recentInsight }) {
  const allTasks = applications.flatMap(application => application.requirements.flatMap(requirement => requirement.tasks.map(task => ({ ...task, application: application.institution, requirement: requirement.title }))));
  const priorities = allTasks.filter(task => task.status !== 'done').sort((a, b) => new Date(a.due) - new Date(b.due)).slice(0, 3);
  const completedRequirements = applications.flatMap(app => app.requirements).filter(req => req.status === 'complete').length;
  const totalRequirements = applications.flatMap(app => app.requirements).length;
  return (
    <>
      <section className="uw-hero"><div><span>Your path, made visible</span><h1>Good afternoon, Maya.</h1><p>Here’s where your applications stand and the few steps that matter most today.</p></div><button className="primary" onClick={() => setSection('decoder')}>Decode a requirement ＋</button></section>
      <section className="stat-grid"><article><small>Applications</small><strong>{applications.length}</strong><span>Fictional demonstration records</span></article><article><small>Requirements complete</small><strong>{completedRequirements}/{totalRequirements}</strong><span>Updates with completed work</span></article><article className="attention"><small>Due within 7 days</small><strong>{allTasks.filter(task => task.status !== 'done' && daysUntil(task.due) <= 7).length}</strong><span>Time-sensitive tasks</span></article></section>
      <div className="dashboard-layout"><section className="panel today-panel"><div className="panel-title"><div><h2>Today’s priorities</h2><p>Start with one manageable step.</p></div><button onClick={() => setSection('tasks')}>View all tasks →</button></div>{priorities.map(task => <label className={`priority ${dueTone(task.due, task.status)}`} key={task.id}><input type="checkbox" checked={task.status === 'done'} onChange={() => toggleTask(task.id)} /><span><strong>{task.text}</strong><small>{task.application} · {task.requirement}</small></span><time>{formatDate(task.due)}</time></label>)}</section><aside className="side-stack"><section className="panel insight"><span>✣ Agent insight</span><h3>{recentInsight?.title || 'A recommendation request has unwritten steps.'}</h3><p>{recentInsight?.text || 'Students are often expected to ask early, provide context, and confirm how a letter must be submitted.'}</p><button onClick={() => setSection('decoder')}>Open Hidden Curriculum →</button></section><section className="panel deadlines"><h3>Upcoming deadlines</h3>{applications.map(app => <div key={app.id}><time>{formatDate(app.deadline)}</time><span>{app.institution}<small>{daysUntil(app.deadline)} days remaining</small></span></div>)}</section></aside></div>
      <div className="section-title"><div><h2>Application progress</h2><p>Select a requirement to reveal its hidden expectations.</p></div><button onClick={() => setSection('applications')}>Manage applications →</button></div><div className="app-grid">{applications.map(app => <AppCard key={app.id} application={app} openRequirement={openRequirement} toggleTask={toggleTask} setSection={setSection} />)}</div>
    </>
  );
}

function Applications({ applications, addApplication, openRequirement, setSection }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ institution: '', deadline: '' });
  const submit = event => { event.preventDefault(); if (!form.institution || !form.deadline) return; addApplication(form); setForm({ institution: '', deadline: '' }); setShowForm(false); };
  return <><section className="uw-page-head"><div><span>My Applications</span><h1>Every opportunity, one clear path.</h1><p>Track official requirements, visible progress, and the assumptions institutions may not explain.</p></div><button className="primary" onClick={() => setShowForm(!showForm)}>Add application ＋</button></section>{showForm && <form className="inline-form" onSubmit={submit}><label>Institution name<input value={form.institution} onChange={e => setForm({ ...form, institution: e.target.value })} placeholder="Example: Horizon College" /></label><label>Application deadline<input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} /></label><button className="primary">Save application</button></form>}<div className="app-grid single">{applications.map(app => <AppCard key={app.id} application={app} openRequirement={openRequirement} setSection={setSection} />)}</div></>;
}

function Decoder({ applications, selected, setSelected, answer, setAnswer, acceptPlan, openWriting, openAgent }) {
  const application = applications.find(app => app.id === selected.applicationId) || applications[0];
  const requirement = application?.requirements.find(req => req.id === selected.requirementId) || application?.requirements[0];
  const proposedTasks = answer === 'yes' ? ['Confirm each recommender is eligible', 'Prepare your goals, activities, and deadline', 'Send personalized requests', 'Track each submission'] : ['List teachers or mentors who know your work', 'Check who the institution allows as a recommender', 'Choose two people to ask', 'Prepare context for each person', 'Send personalized requests'];
  return <><section className="uw-page-head"><div><span>Core AI feature</span><h1>Hidden Curriculum Decoder</h1><p>Understand what a requirement says, what it assumes, why it matters, and what to do next.</p></div><button className="go-button" onClick={() => openAgent(requirement)}>Open in Unwritten Go agent ↗</button></section><div className="decoder-grid"><section className="panel decoder-input"><label>Application<select value={application.id} onChange={e => { const app = applications.find(item => item.id === e.target.value); setSelected({ applicationId: app.id, requirementId: app.requirements[0]?.id }); }} >{applications.map(app => <option key={app.id} value={app.id}>{app.institution}</option>)}</select></label><label>Existing requirement<select value={requirement.id} onChange={e => setSelected({ applicationId: application.id, requirementId: e.target.value })}>{application.requirements.map(req => <option key={req.id} value={req.id}>{req.title}</option>)}</select></label><label>Original instruction<textarea value={requirement.instruction} readOnly /></label><p className="source-note">This is fictional demo data. Institution-specific details must be verified from official sources.</p></section><section className="panel decoder-output"><div className="decoder-heading"><span>✣ Unwritten analysis</span><small>Structured for the Task Planner</small></div><ResultSection title="A. What it says"><p>{requirement.explanation}</p></ResultSection><ResultSection title="B. What you might not know"><ul>{requirement.hiddenExpectations.map(item => <li key={item}>{item}</li>)}</ul></ResultSection><ResultSection title="C. Why it matters"><p>Understanding these conventions early gives you time to make informed choices, ask useful questions, and avoid preventable last-minute problems.</p></ResultSection><ResultSection title="D. What you need to do"><ol>{proposedTasks.map(item => <li key={item}>{item}</li>)}</ol></ResultSection><ResultSection title="E. Question to consider"><p>{requirement.followUp}</p><div className="answer-buttons"><button className={answer === 'yes' ? 'selected' : ''} onClick={() => setAnswer('yes')}>Yes</button><button className={answer === 'no' ? 'selected' : ''} onClick={() => setAnswer('no')}>Not yet</button></div></ResultSection></section></div><section className="plan-review"><div><span>Review before saving</span><h2>Personalized action plan</h2><p>{proposedTasks.length} suggested tasks. The nearest official deadline is {formatDate(application.deadline)}.</p></div><div><button onClick={() => openWriting(application, requirement)}>Preview Writing Studio</button><button className="primary" onClick={() => acceptPlan(application, requirement, proposedTasks)}>Accept plan & add tasks</button></div></section></>;
}

function ResultSection({ title, children }) { return <section className="result-section"><h3>{title}</h3>{children}</section>; }

function Tasks({ applications, toggleTask }) {
  const tasks = applications.flatMap(app => app.requirements.flatMap(req => req.tasks.map(task => ({ ...task, application: app.institution, requirement: req.title })))).sort((a, b) => new Date(a.due) - new Date(b.due));
  return <><section className="uw-page-head"><div><span>Personalized Task Planner</span><h1>Focus on the next logical step.</h1><p>Tasks are connected to applications and requirements, so progress stays synchronized.</p></div></section><div className="tasks-layout"><section className="panel"><div className="panel-title"><div><h2>Today and upcoming</h2><p>Urgent work appears first.</p></div></div>{tasks.map(task => <label className={`task-line ${dueTone(task.due, task.status)}`} key={task.id}><input type="checkbox" checked={task.status === 'done'} onChange={() => toggleTask(task.id)} /><span><strong>{task.text}</strong><small>{task.application} · {task.requirement}</small></span><time>{formatDate(task.due)}</time><b>{task.priority}</b></label>)}</section><aside className="panel dependency"><span>✣ Dependency insight</span><h3>Recommendation requests come before submission tracking.</h3><p>You cannot meaningfully monitor a letter until someone has agreed to write it. First identify and ask the recommender.</p></aside></div></>;
}

function WritingStudio({ context, setContext }) {
  const [form, setForm] = useState({ recipient: 'Ms. Rivera', relationship: 'My English teacher', opportunity: context?.application || 'Redwood College', deadline: 'November 15, 2026', memory: '' });
  const [draft, setDraft] = useState('');
  const generate = () => setDraft(`Subject: Recommendation request for ${form.opportunity}\n\nHi ${form.recipient},\n\nI’m applying to ${form.opportunity} and wanted to ask whether you would feel comfortable writing a recommendation letter for me. The application deadline is ${form.deadline}.\n\nI appreciated learning from you as ${form.relationship.toLowerCase()}.${form.memory ? ` One experience that stood out to me was ${form.memory}.` : ' [Add a specific project, conversation, or moment that shows how you grew.]'}\n\nIf you are able to write the letter, I can share more information about the opportunity, my goals, and the submission instructions. I understand if your schedule does not allow it.\n\nThank you for considering my request,\nMaya Chen`);
  return <><section className="uw-page-head"><div><span>Writing Studio · Grammarly-supported workflow</span><h1>Learn the expectation. Then write in your own voice.</h1><p>Unwritten supplies context and missing-information prompts; Grammarly can support clarity, organization, and correctness where the student writes.</p></div></section><div className="writing-grid"><section className="panel writing-form"><h2>Recommendation request</h2><p>The form asks for information a thoughtful request usually includes. It does not invent personal details.</p>{Object.entries({ recipient: 'Who is the recipient?', relationship: 'How do you know them?', opportunity: 'What are you applying for?', deadline: 'What is the deadline?', memory: 'What relevant memory should be included?' }).map(([key, label]) => <label key={key}>{label}<input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={key === 'memory' ? 'A project, feedback, or class moment' : ''} /></label>)}<button className="primary" onClick={generate}>Generate editable draft</button></section><section className="panel draft-panel"><div className="draft-title"><h2>Your editable draft</h2><span>Nothing is sent from here</span></div>{draft ? <textarea value={draft} onChange={e => setDraft(e.target.value)} /> : <div className="draft-empty"><span>✎</span><p>Complete the context form to generate a draft with clear placeholders instead of fabricated details.</p></div>}<div className="writing-tip"><strong>Unwritten expectation:</strong> Include what you are applying for and the deadline so the recipient can evaluate the request.</div></section></div></>;
}

function Support({ applications }) {
  const [momentum, setMomentum] = useState(false);
  const [frequency, setFrequency] = useState('Deadline-focused reminders only');
  const dueSoon = applications.flatMap(app => app.requirements.flatMap(req => req.tasks)).filter(task => task.status !== 'done' && daysUntil(task.due) <= 7).length;
  return <><section className="uw-page-head"><div><span>Student Support</span><h1>Support without added pressure.</h1><p>Optional encouragement and verified-resource guidance stay under the student’s control.</p></div></section><div className="support-grid"><section className="panel momentum"><div className="toggle-row"><div><span>Optional agent</span><h2>Momentum</h2><p>Workload-aware encouragement, reminders, and progress celebrations.</p></div><button className={momentum ? 'toggle on' : 'toggle'} onClick={() => setMomentum(!momentum)}><i /></button></div>{momentum ? <><label>Check-in preference<select value={frequency} onChange={e => setFrequency(e.target.value)}><option>Daily check-ins</option><option>Weekly check-ins</option><option>Deadline-focused reminders only</option></select></label><div className="support-message"><span>♡ Supportive check-in</span><p>You have {dueSoon} application tasks due within seven days. Let’s focus on one manageable step: confirm your recommendation-letter plan.</p><strong>“Progress doesn’t have to be perfect to matter.”</strong></div></> : <div className="disabled-message">Supportive check-ins are disabled by default. Turn them on only if they would be useful.</div>}</section><section className="panel bridge"><span>Optional agent</span><h2>Opportunity Bridge</h2><p>Find categories of legitimate support without inventing programs or eligibility.</p><div className="resource"><strong>Application costs</strong><p>Ask the institution or your school counselor whether official fee-waiver options exist and how eligibility is verified.</p></div><div className="resource"><strong>Financial aid terminology</strong><p>Use the official Federal Student Aid website for FAFSA information and confirm institution-specific requirements directly.</p><a href="https://studentaid.gov/" target="_blank" rel="noreferrer">Visit Federal Student Aid ↗</a></div><div className="resource"><strong>People who may help</strong><p>School counselors, admissions offices, writing centers, transfer advisers, and official financial-aid offices.</p></div></section></div></>;
}

export default function UnwrittenHackathon() {
  const [applications, setApplications] = useState(() => { const saved = localStorage.getItem('unwritten-hackathon-v1'); return saved ? JSON.parse(saved) : demoApplications; });
  const [section, setSection] = useState('dashboard');
  const [selected, setSelected] = useState({ applicationId: 'redwood', requirementId: 'redwood-recs' });
  const [answer, setAnswer] = useState('no');
  const [agentRequirement, setAgentRequirement] = useState(null);
  const [writingContext, setWritingContext] = useState(null);
  const [recentInsight, setRecentInsight] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => localStorage.setItem('unwritten-hackathon-v1', JSON.stringify(applications)), [applications]);

  const openRequirement = (applicationId, requirementId) => { setSelected({ applicationId, requirementId }); setAnswer('no'); setSection('decoder'); };
  const toggleTask = taskId => setApplications(apps => apps.map(app => ({ ...app, requirements: app.requirements.map(req => { const tasks = req.tasks.map(task => task.id === taskId ? { ...task, status: task.status === 'done' ? 'open' : 'done' } : task); const hasTasks = tasks.length > 0; const status = hasTasks && tasks.every(task => task.status === 'done') ? 'complete' : req.status === 'complete' && !tasks.every(task => task.status === 'done') ? 'in-progress' : req.status; return { ...req, tasks, status }; }) })));
  const addApplication = form => setApplications(apps => [...apps, { id: makeId('application'), institution: form.institution, deadline: form.deadline, status: 'Getting started', requirements: [] }]);
  const acceptPlan = (application, requirement, proposedTasks) => { const start = Math.max(1, daysUntil(application.deadline) - 24); setApplications(apps => apps.map(app => app.id !== application.id ? app : { ...app, requirements: app.requirements.map(req => req.id !== requirement.id ? req : { ...req, status: 'in-progress', tasks: proposedTasks.map((text, index) => ({ id: makeId('task'), text, due: new Date(TODAY.getTime() + (Math.min(start + index * 3, daysUntil(application.deadline) - 2) * 86400000)).toISOString().slice(0, 10), status: 'open', priority: index < 2 ? 'high' : 'medium' })) }) })); setRecentInsight({ title: `${proposedTasks.length} tasks added for ${requirement.title}.`, text: 'The dashboard and task list now share this approved plan. Complete tasks to update requirement progress.' }); setToast('Plan accepted. Tasks added to the dashboard.'); setSection('tasks'); setTimeout(() => setToast(''), 2800); };
  const openWriting = (application, requirement) => { setWritingContext({ application: application.institution, requirement: requirement.title }); setSection('writing'); };

  const content = useMemo(() => {
    if (section === 'dashboard') return <Dashboard applications={applications} setSection={setSection} openRequirement={openRequirement} toggleTask={toggleTask} recentInsight={recentInsight} />;
    if (section === 'applications') return <Applications applications={applications} addApplication={addApplication} openRequirement={openRequirement} setSection={setSection} />;
    if (section === 'decoder') return <Decoder applications={applications} selected={selected} setSelected={setSelected} answer={answer} setAnswer={setAnswer} acceptPlan={acceptPlan} openWriting={openWriting} openAgent={setAgentRequirement} />;
    if (section === 'tasks') return <Tasks applications={applications} toggleTask={toggleTask} />;
    if (section === 'writing') return <WritingStudio context={writingContext} setContext={setWritingContext} />;
    return <Support applications={applications} />;
  }, [section, applications, selected, answer, recentInsight, writingContext]);

  return <div className="uw-app"><Sidebar section={section} setSection={setSection} /><main className="uw-main"><header className="uw-topbar"><span>{navItems.find(item => item[0] === section)?.[2]}</span><div><button onClick={() => { localStorage.removeItem('unwritten-hackathon-v1'); setApplications(demoApplications); }}>Reset demo</button><span>Friday, October 16, 2026</span></div></header><div className="uw-content">{content}<footer>Fictional demonstration records · Official requirements and deadlines must be verified with each institution.</footer></div></main>{agentRequirement && <AgentHandoff requirement={agentRequirement} onClose={() => setAgentRequirement(null)} />}{toast && <div className="toast">✓ {toast}</div>}</div>;
}
