/**
 * DOM utility helpers
 */

export const $ = (selector, context = document) => context.querySelector(selector);
export const $$ = (selector, context = document) => context.querySelectorAll(selector);

export const on = (el, event, handler, options) => {
  el.addEventListener(event, handler, options);
  return () => el.removeEventListener(event, handler, options);
};

export const toggleAriaExpanded = (trigger) => {
  const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
  trigger.setAttribute('aria-expanded', String(!isExpanded));
};
