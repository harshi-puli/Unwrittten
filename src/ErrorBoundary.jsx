import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Unwritten interface error', error, info);
  }

  reset = () => {
    localStorage.removeItem('unwritten-hackathon-v1');
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;
    return <main style={{ maxWidth: 680, margin: '80px auto', padding: 30, fontFamily: 'system-ui' }}><h1>Unwritten needs a quick reset.</h1><p>The browser-local demo data could not be loaded safely. No official application data was changed.</p><button onClick={this.reset} style={{ padding: '12px 16px', border: 0, borderRadius: 8, color: 'white', background: '#617dc7', cursor: 'pointer' }}>Reset local demo data</button><pre style={{ marginTop: 20, padding: 14, overflow: 'auto', background: '#f4f2ed' }}>{String(this.state.error?.message || this.state.error)}</pre></main>;
  }
}
