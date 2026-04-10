/**
 * Accessibility utilities
 */

export const trapFocus = (container) => {
  const focusable = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  const handler = (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  container.addEventListener('keydown', handler);
  first?.focus();
  return () => container.removeEventListener('keydown', handler);
};

export const announce = (message, politeness = 'polite') => {
  let liveRegion = document.getElementById('live-region');
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'live-region';
    liveRegion.className = 'sr-only';
    liveRegion.setAttribute('aria-atomic', 'true');
    document.body.appendChild(liveRegion);
  }
  liveRegion.setAttribute('aria-live', politeness);
  liveRegion.textContent = '';
  requestAnimationFrame(() => { liveRegion.textContent = message; });
};
