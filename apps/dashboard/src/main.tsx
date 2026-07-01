import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

function App() {
  return (
    <main className="min-h-screen bg-slate-950 p-8 text-slate-100">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-400">
          ProcureWiz
        </p>
        <h1 className="mt-4 text-4xl font-semibold">Operations dashboard</h1>
        <p className="mt-4 text-lg text-slate-300">
          Authentication layout and app shell are ready for the next milestone.
        </p>
      </div>
    </main>
  );
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
