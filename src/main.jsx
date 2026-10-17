import React from 'react';
import ReactDOM from 'react-dom/client';
import AppShell from './AppShell.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
import './unwritten.css';
import './url-importer.css';
import './url-importer-review.css';
import './go-inline.css';
import './grammarly-essay.css';
import './floating-controls.css';
import './application-manager.css';
import './application-card-enhancements.css';
import './action-hub.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppShell />
    </ErrorBoundary>
  </React.StrictMode>,
);
