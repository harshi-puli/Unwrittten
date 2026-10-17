import { useState } from 'react';

const STORAGE_KEY = 'unwritten-hackathon-v1';

const formatDate = value => {
  if (!value) return 'No deadline saved';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${value}T12:00:00`));
};

export default function ApplicationManager() {
  const [open, setOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [confirming, setConfirming] = useState(null);

  const showManager = () => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    setApplications(Array.isArray(saved) ? saved : []);
    setConfirming(null);
    setOpen(true);
  };

  const deleteApplication = application => {
    const updated = applications.filter(item => item.id !== application.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setApplications(updated);
    setConfirming(null);
    window.setTimeout(() => window.location.reload(), 350);
  };

  return (
    <>
      <button className="application-manager-launcher" onClick={showManager}>Manage applications</button>
      {open && <div className="application-manager-backdrop" onMouseDown={() => setOpen(false)}>
        <section className="application-manager-modal" onMouseDown={event => event.stopPropagation()}>
          <button className="application-manager-close" onClick={() => setOpen(false)}>×</button>
          <span className="application-manager-eyebrow">Browser-local demo data</span>
          <h2>Manage applications</h2>
          <p>Deleting an application removes its requirements, tasks, and progress from this browser only. It does not change an official application portal.</p>

          <div className="managed-applications">
            {applications.map(application => (
              <article key={application.id}>
                <div className="managed-application-mark">{application.institution?.split(' ').map(word => word[0]).slice(0, 2).join('') || 'A'}</div>
                <div><strong>{application.institution || 'Untitled application'}</strong><span>Deadline: {formatDate(application.deadline)}</span><small>{application.requirements?.length || 0} requirements · {application.status || 'No status'}</small></div>
                {confirming === application.id ? <div className="delete-confirmation"><span>Delete this application?</span><button onClick={() => setConfirming(null)}>Cancel</button><button className="confirm-delete" onClick={() => deleteApplication(application)}>Delete</button></div> : <button className="delete-application" onClick={() => setConfirming(application.id)}>Delete</button>}
              </article>
            ))}
            {!applications.length && <div className="no-applications"><strong>No saved applications</strong><p>Add or import an application to see it here.</p></div>}
          </div>

          <footer>Deleted demo records cannot be restored unless you reset the demo or add them again.</footer>
        </section>
      </div>}
    </>
  );
}
