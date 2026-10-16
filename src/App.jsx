import { useMemo, useState } from 'react';

const colleges = [
  { initials: 'AC', name: 'Alder College', due: 'Nov 15', done: 2, total: 8, status: 'Needs a plan' },
  { initials: 'LU', name: 'Lakeview University', due: 'Dec 1', done: 3, total: 7, status: 'In progress' },
  { initials: 'NC', name: 'Northfield College', due: 'Jan 5', done: 1, total: 6, status: 'Getting started' },
];

const starterTasks = [
  { id: 1, title: 'Understand Alder’s writing & recommendations', detail: 'Alder College · New requirement · About 10 min', due: 'Today', featured: true, done: false },
  { id: 2, title: 'Ask your counselor for your transcript', detail: 'Lakeview University · Approved by you · 10 min', due: 'Today', done: false },
  { id: 3, title: 'Add your volunteer experience', detail: 'Northfield College · Approved by you · 15 min', due: 'Today', done: false },
];

const planItems = [
  ['Confirm the essay & letter instructions', 'Ask Alder the three questions we found · 10 min', 'Oct 20'],
  ['Choose two teachers to ask', 'Think of teachers who know your work and growth · 10 min', 'Oct 21'],
  ['Draft your recommendation requests', 'Make a personal note for each teacher · 15 min', 'Oct 22'],
  ['Review and send your requests', 'Include the confirmed deadline · 10 min', 'Oct 23'],
  ['Brainstorm your statement of purpose', 'List your interests, one story, and your goals · 20 min', 'Oct 26'],
  ['Write a first essay draft', 'Use your notes. It does not need to be perfect · 45 min', 'Oct 30'],
  ['Revise, submit & check your letters', 'Confirm receipt with Alder · 30 min', 'Nov 12'],
];

function Icon({ children }) {
  return <span className="icon" aria-hidden="true">{children}</span>;
}

function Sidebar({ view, setView }) {
  const links = [
    ['day', '☀', 'My day'],
    ['colleges', '⌂', 'My colleges'],
    ['tasks', '✓', 'My tasks'],
    ['drafts', '✎', 'My drafts'],
  ];

  return (
    <aside className="sidebar">
      <button className="brand" onClick={() => setView('day')}>
        <span className="brand-mark">♧</span>
        <span>Firstpath</span>
      </button>

      <div className="chapter">
        <span>Your next chapter</span>
        <strong>Fall 2027 applications</strong>
      </div>

      <nav>
        {links.map(([id, icon, label]) => (
          <button key={id} className={`nav-link ${view === id ? 'active' : ''}`} onClick={() => setView(id)}>
            <Icon>{icon}</Icon>{label}
          </button>
        ))}
      </nav>

      <div className="encouragement">
        <span className="compass">◈</span>
        <strong>You don’t have to know it all.</strong>
        <p>We’ll break it down, one small step at a time.</p>
        <button onClick={() => setView('requirement')}>Explore college terms ↗</button>
      </div>

      <div className="sidebar-bottom">
        <button className="help">? <span>Help & resources</span></button>
        <div className="profile"><span>MC</span><div><strong>Maya Chen</strong><small>My workspace</small></div></div>
      </div>
    </aside>
  );
}

function Topbar({ title }) {
  return (
    <header className="topbar">
      <span>{title}</span>
      <div>Monday, October 19, 2026 <span className="bell">♧</span></div>
    </header>
  );
}

function Layout({ view, setView, title, children }) {
  return (
    <div className="app-shell">
      <Sidebar view={view} setView={setView} />
      <div className="workspace">
        <Topbar title={title} />
        <main className="content">{children}</main>
      </div>
    </div>
  );
}

function TaskRow({ task, toggleTask }) {
  return (
    <div className={`task-row ${task.featured ? 'featured' : ''} ${task.done ? 'completed' : ''}`}>
      <button className="checkbox" aria-label={`Mark ${task.title} complete`} onClick={() => toggleTask(task.id)}>{task.done ? '✓' : ''}</button>
      <div className="task-copy">
        <strong>{task.title}</strong>
        <span>{task.detail}</span>
        {task.featured && <button className="text-link">Break this down with me →</button>}
      </div>
      <span className="task-due">{task.due}</span>
    </div>
  );
}

function MyDay({ tasks, toggleTask, setView }) {
  return (
    <>
      <section className="hero-row">
        <div>
          <span className="eyebrow">Your path, at your pace</span>
          <h1>A little progress, every day.</h1>
          <p>Hi Maya. Let’s make your next step feel a little clearer.</p>
        </div>
        <button className="primary" onClick={() => setView('requirement')}>Add a requirement <b>＋</b></button>
      </section>

      <div className="dashboard-grid">
        <section className="card task-card">
          <div className="card-heading"><h2>Your next small steps</h2><span className="pill">3 for today</span></div>
          <p>Start here. Everything else can wait.</p>
          {tasks.map(task => <TaskRow key={task.id} task={task} toggleTask={toggleTask} />)}
          <button className="text-link large" onClick={() => setView('tasks')}>View all my tasks →</button>
        </section>

        <aside className="right-stack">
          <section className="card coming-up">
            <h2>Coming up</h2>
            <Deadline month="NOV" day="15" school="Alder College" note="Application due · 27 days" />
            <Deadline month="DEC" day="01" school="Lakeview University" note="Application due · 43 days" />
            <button className="text-link large">See all deadlines →</button>
          </section>
          <section className="card guide-card">
            <h2>✣ Your Firstpath guide</h2>
            <p>A confusing instruction? Paste it in. We’ll work out what it means and what you can do next.</p>
            <small>AI suggests. You decide what belongs in your plan.</small>
          </section>
        </aside>
      </div>

      <section className="progress-banner"><span>✓</span><div><strong>You’ve already taken 6 steps forward.</strong><p>Your college list is set, and your applications are underway.</p></div></section>

      <section className="college-section">
        <div className="section-heading"><h2>Your colleges</h2><span>3 applications · Fall 2027</span></div>
        <div className="college-grid">{colleges.map(c => <CollegeCard key={c.name} college={c} setView={setView} />)}</div>
      </section>
    </>
  );
}

function Deadline({ month, day, school, note }) {
  return <div className="deadline"><div className="date-box"><small>{month}</small><strong>{day}</strong></div><div><strong>{school}</strong><span>{note}</span></div></div>;
}

function CollegeCard({ college, setView }) {
  const pct = Math.round((college.done / college.total) * 100);
  return (
    <button className="college-card" onClick={() => setView('requirement')}>
      <div className="college-title"><span>{college.initials}</span><div><strong>{college.name}</strong><small>Application due {college.due}</small></div></div>
      <p>{college.done} of {college.total} tasks complete</p>
      <div className="progress-track"><i style={{ width: `${pct}%` }} /></div>
      <div className="college-footer"><span className="status-pill">{college.status}</span><b>↗</b></div>
    </button>
  );
}

function Colleges({ setView }) {
  return (
    <>
      <section className="simple-hero"><span className="eyebrow">Your college list</span><h1>Every application, one clear path.</h1><p>Track deadlines, requirements, and next steps without keeping everything in your head.</p></section>
      <div className="college-grid expanded">{colleges.map(c => <CollegeCard key={c.name} college={c} setView={setView} />)}</div>
    </>
  );
}

function Tasks({ tasks, toggleTask }) {
  return (
    <>
      <section className="simple-hero"><span className="eyebrow">My tasks</span><h1>Small steps you can actually finish.</h1><p>Check off what is done and focus on what matters next.</p></section>
      <section className="card task-card full-card">{tasks.map(task => <TaskRow key={task.id} task={task} toggleTask={toggleTask} />)}{planItems.slice(0, 4).map((item, i) => <TaskRow key={i + 20} task={{ id: i + 20, title: item[0], detail: item[1], due: item[2], done: false }} toggleTask={() => {}} />)}</section>
    </>
  );
}

function Drafts() {
  const [copied, setCopied] = useState(false);
  const draft = `Hi Ms. Rivera,\n\nI’m applying to Alder College for fall 2027 and wanted to ask if you would feel comfortable writing a recommendation for me.\n\nI enjoyed your class, especially [a project or moment you remember]. It helped me [what you learned or how you grew], and I’d be grateful if you could speak to that experience.\n\nMy application is due November 15. I’ll share the recommendation deadline and submission details as soon as I confirm them.\n\nThank you,\nMaya Chen`;
  const copy = async () => { await navigator.clipboard?.writeText(draft); setCopied(true); setTimeout(() => setCopied(false), 1800); };

  return (
    <>
      <section className="simple-hero"><span className="eyebrow">Alder College · Recommendation request</span><h1>Your words. A little help getting started.</h1><p>Review the draft, add a memory from class, and make it sound like you.</p></section>
      <div className="draft-grid">
        <section className="card draft-card"><div className="card-heading"><h2>Ask Ms. Rivera for a recommendation</h2><span className="pill">AI draft · Unsaved</span></div><span className="personalize">✎ 2 details to personalize before you use this</span><div className="email-meta"><span>To</span><strong>Ms. Rivera · Your English teacher</strong><span>Subject</span><strong>Would you write a college recommendation for me?</strong></div><textarea className="draft-text" defaultValue={draft} /><div className="draft-actions"><span>Editable draft · Not connected to email</span><button className="secondary">Save draft</button><button className="primary small" onClick={copy}>{copied ? 'Copied!' : 'Copy draft'}</button></div></section>
        <aside className="right-stack"><section className="card guide-card"><h2>✣ Make it feel like you</h2><p>A specific memory helps your teacher recall what makes you, you.</p><div className="prompt-box"><strong>Try thinking about…</strong><p>Was there a piece of writing you were proud of, or feedback that helped you improve?</p></div></section><section className="card"><h2>Before you use this</h2><ul className="check-list"><li>Replace both highlighted details.</li><li>Check the name and your own voice.</li><li>Confirm how and when letters are due.</li></ul></section></aside>
      </div>
    </>
  );
}

function Stepper({ step, setStep }) {
  return <div className="stepper">{['Understand', 'Make a plan', 'Take a step'].map((label, i) => <button key={label} className={step === i + 1 ? 'current' : step > i + 1 ? 'done' : ''} onClick={() => setStep(i + 1)}><span>{step > i + 1 ? '✓' : i + 1}</span>{label}</button>)}</div>;
}

function RequirementFlow({ setView }) {
  const [step, setStep] = useState(1);
  const [requirement, setRequirement] = useState('Submit a statement of purpose and obtain two faculty recommendations.');
  const [accepted, setAccepted] = useState(false);

  return (
    <>
      <Stepper step={step} setStep={setStep} />
      {step === 1 && <Understand requirement={requirement} setRequirement={setRequirement} setStep={setStep} />}
      {step === 2 && <Plan accepted={accepted} setAccepted={setAccepted} setStep={setStep} />}
      {step === 3 && <TakeStep setView={setView} accepted={accepted} />}
    </>
  );
}

function Understand({ requirement, setRequirement, setStep }) {
  return (
    <>
      <section className="simple-hero"><span className="eyebrow">Alder College · New requirement</span><h1>Let’s make sense of the instructions.</h1><p>Bring the college’s words here. Your guide will help you find a starting point.</p></section>
      <div className="understand-grid">
        <section className="card input-card"><div className="card-heading"><h2>What did the college say?</h2><span className="pill">Original text</span></div><label>College</label><select><option>Alder College</option><option>Lakeview University</option><option>Northfield College</option></select><label>Paste the requirement</label><textarea value={requirement} onChange={e => setRequirement(e.target.value)} /><small>Source: Alder application page · Added by you</small><div className="verified">✓ Explained by your guide · Still editable</div></section>
        <section className="card explanation"><div className="card-heading"><h2>✣ In everyday words</h2><span>AI explanation</span></div><p className="lead">Alder is asking for a short piece about your goals and two letters from people who have taught you.</p><hr /><h3>“Statement of purpose”</h3><p>A short essay about what you want to study, why it matters to you, and how this college fits your goals.</p><h3>“Faculty recommendations”</h3><p>Letters from teachers or professors about you as a learner. Ask Alder whether your high school teachers count as faculty.</p><small>An explanation, not official admissions guidance. Check details with the college.</small></section>
        <section className="card source-card"><h2>Keep the source close</h2><p>This short instruction doesn’t include every detail. Confirm the length, who can recommend you, and how to submit.</p><strong>▣ Application deadline: November 15</strong></section>
        <section className="card prepare-card"><div className="card-heading"><h2>Two things to prepare</h2><span>AI extracted</span></div><div><b>▤</b><p><strong>1 statement of purpose</strong><span>Explore your goals, then write and revise an essay.</span></p></div><div><b>♙</b><p><strong>2 faculty recommendations</strong><span>Choose two teachers, ask them, and share helpful context.</span></p></div></section>
      </div>
      <section className="question-banner"><div><h2>Good questions to ask Alder</h2><p>How long should the essay be? Do high school teachers qualify? How are letters submitted?</p></div><button className="primary" onClick={() => setStep(2)}>Suggest a small-step plan →</button></section>
    </>
  );
}

function Plan({ accepted, setAccepted, setStep }) {
  return (
    <>
      <section className="simple-hero"><span className="eyebrow">Alder College · Statement & recommendations</span><h1>A big requirement. Seven small steps.</h1><p>Here’s a starting plan, not a set of rules. Change any task or date before adding it to your list.</p></section>
      <div className="plan-grid"><section className="card plan-card"><div className="card-heading"><div><h2>Your suggested task list</h2><p>7 tasks · About 2 hr 20 min, spread over a few weeks</p></div><span className="pill">AI suggestion</span></div><div className="plan-header"><span>Small step</span><span>Suggested date</span></div>{planItems.map(([title, detail, date]) => <div className="plan-row" key={title}><span className="drag">⁙</span><div><strong>{title}</strong><small>{detail}</small></div><time>{date}</time><span>✎</span></div>)}</section><aside className="right-stack"><section className="card guide-card"><h2>✣ Why these dates?</h2><p>Teachers need time to write. Asking this week leaves about three weeks before your application is due.</p><hr /><p>The essay steps leave room to revise. November 12 is a suggested finish date, not a college deadline.</p></section><section className="card"><span className="label">Planning around</span><h2 className="big-date">November 15</h2><p>Alder application deadline from your college list.</p><span className="warning-pill">Letter deadline: confirm</span></section></aside></div>
      <section className="accept-banner"><div><h2>Make this plan yours.</h2><p>Accepting turns these suggestions into your approved tasks.</p></div><button className="secondary">Edit plan</button><button className="primary" onClick={() => { setAccepted(true); setStep(3); }}>{accepted ? 'Plan accepted ✓' : 'Accept plan'}</button></section>
    </>
  );
}

function TakeStep({ setView, accepted }) {
  return (
    <>
      {accepted && <div className="success-banner">✓ <strong>Plan accepted · 7 tasks added to My tasks</strong></div>}
      <section className="simple-hero"><span className="eyebrow">Alder College · Recommendation request</span><h1>Your words. A little help getting started.</h1><p>Review the draft, add a memory from class, and make it sound like you. Nothing is sent from here.</p></section>
      <div className="draft-grid"><section className="card draft-card"><div className="card-heading"><h2>Ask Ms. Rivera for a recommendation</h2><span className="pill">AI draft · Unsaved</span></div><span className="personalize">✎ 2 details to personalize before you use this</span><div className="email-meta"><span>To</span><strong>Ms. Rivera · Your English teacher</strong><span>Subject</span><strong>Would you write a college recommendation for me?</strong></div><div className="letter"><p>Hi Ms. Rivera,</p><p>I’m applying to Alder College for fall 2027 and wanted to ask if you would feel comfortable writing a recommendation for me.</p><p>I enjoyed your class, especially <mark>[a project or moment you remember]</mark>. It helped me <mark>[what you learned or how you grew]</mark>.</p><p>My application is due November 15. I’ll share the confirmed submission details with you.</p><p>Thank you,<br />Maya Chen</p></div><div className="draft-actions"><span>Editable draft · Not connected to email</span><button className="secondary">Save draft</button><button className="primary small" onClick={() => setView('drafts')}>Open draft</button></div></section><aside className="right-stack"><section className="card guide-card"><h2>✣ Make it feel like you</h2><p>A specific memory helps your teacher recall what makes you, you.</p><div className="prompt-box"><strong>Try thinking about…</strong><p>Was there a piece of writing you were proud of, or feedback that helped you improve?</p></div></section><section className="card"><h2>Before you use this</h2><ul className="check-list"><li>Replace both highlighted details.</li><li>Check the name and your own voice.</li><li>Confirm how and when letters are due.</li></ul></section></aside></div>
    </>
  );
}

export default function App() {
  const [view, setView] = useState('day');
  const [tasks, setTasks] = useState(starterTasks);
  const toggleTask = id => setTasks(items => items.map(item => item.id === id ? { ...item, done: !item.done } : item));
  const title = useMemo(() => ({ day: 'My day', colleges: 'My colleges', tasks: 'My tasks', drafts: 'My drafts', requirement: 'My colleges  ›  Alder College' }[view]), [view]);

  return (
    <Layout view={view} setView={setView} title={title}>
      {view === 'day' && <MyDay tasks={tasks} toggleTask={toggleTask} setView={setView} />}
      {view === 'colleges' && <Colleges setView={setView} />}
      {view === 'tasks' && <Tasks tasks={tasks} toggleTask={toggleTask} />}
      {view === 'drafts' && <Drafts />}
      {view === 'requirement' && <RequirementFlow setView={setView} />}
      <footer>Illustrative student workspace · College names, requirements and dates are examples, not admissions policies.</footer>
    </Layout>
  );
}
