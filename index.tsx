import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

document.documentElement.lang = 'vi-VN';
document.body?.setAttribute('lang', 'vi-VN');

const STALE_CHUNK_RELOAD_KEY = 'smart_rental_stale_chunk_reload';

function isStaleChunkError(message: string) {
  return [
    'failed to fetch dynamically imported module',
    'importing a module script failed',
    'failed to load module script',
    'dynamically imported module',
    '/assets/',
  ].some((token) => message.includes(token));
}

function reloadOnStaleChunk(reason: unknown) {
  const message =
    reason instanceof Error
      ? reason.message
      : typeof reason === 'string'
        ? reason
        : JSON.stringify(reason || '');

  if (!isStaleChunkError(String(message).toLowerCase())) return false;

  if (sessionStorage.getItem(STALE_CHUNK_RELOAD_KEY) === '1') {
    sessionStorage.removeItem(STALE_CHUNK_RELOAD_KEY);
    return false;
  }

  sessionStorage.setItem(STALE_CHUNK_RELOAD_KEY, '1');
  window.location.reload();
  return true;
}

window.addEventListener('error', (event) => {
  reloadOnStaleChunk(event.message || event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  if (reloadOnStaleChunk(event.reason)) {
    event.preventDefault();
  }
});

sessionStorage.removeItem(STALE_CHUNK_RELOAD_KEY);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
