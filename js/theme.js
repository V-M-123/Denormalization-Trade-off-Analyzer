/**
 * Theme Toggle & Persistence Module
 * Manages data-theme attribute on <html>, aria-pressed on toggle button,
 * and localStorage persistence.
 */

const THEME_STORAGE_KEY = 'denorm_theme';

export function getInitialTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === 'day' || saved === 'night') return saved;
  // Default to night per Modal specification
  return 'night';
}

export function applyTheme(theme, onThemeChangedCallback = null) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);

  // Update aria-pressed on any toggle buttons
  const toggles = document.querySelectorAll('.theme-toggle-btn');
  toggles.forEach(btn => {
    btn.setAttribute('aria-pressed', theme === 'night' ? 'true' : 'false');
    btn.setAttribute('title', theme === 'night' ? 'Switch to Day Mode' : 'Switch to Night Mode');
    btn.innerHTML = theme === 'night' 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  });

  if (typeof onThemeChangedCallback === 'function') {
    onThemeChangedCallback(theme);
  }
}

export function toggleTheme(onThemeChangedCallback = null) {
  const current = document.documentElement.getAttribute('data-theme') || 'night';
  const next = current === 'night' ? 'day' : 'night';
  applyTheme(next, onThemeChangedCallback);
  return next;
}
