/**
 * Navigation module — mobile burger menu + overflow "more" button
 */
import { $, on } from '../utils/dom.js';
import { trapFocus } from '../utils/a11y.js';

export const initNavigation = () => {
  const burger = $('.header__burger');
  const mobileNav = $('.mobile-nav');
  const closeBtn = mobileNav?.querySelector('.mobile-nav__close');

  if (!burger || !mobileNav) {return;}

  let releaseFocus = null;

  const openMenu = () => {
    mobileNav.removeAttribute('inert');
    mobileNav.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    releaseFocus = trapFocus(mobileNav);
  };

  const closeMenu = () => {
    mobileNav.classList.remove('is-open');
    mobileNav.setAttribute('inert', '');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    releaseFocus?.();
    releaseFocus = null;
    burger.focus();
  };

  on(burger, 'click', () => {
    mobileNav.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  if (closeBtn) {
    on(closeBtn, 'click', closeMenu);
  }

  on(document, 'keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {closeMenu();}
  });

  on(document, 'click', (e) => {
    if (
      mobileNav.classList.contains('is-open') &&
      !mobileNav.contains(e.target) &&
      !burger.contains(e.target)
    ) {closeMenu();}
  });

  // Mark current page
  document.querySelectorAll('.nav__link, .mobile-nav__link').forEach((link) => {
    if (link.href === window.location.href) {link.setAttribute('aria-current', 'page');}
  });
};

export const initOverflowNav = () => {
  const nav = document.querySelector('.header__nav');
  const navList = nav?.querySelector('.nav__list');
  if (!nav || !navList) {return;}

  const moreItem = navList.querySelector('.nav__item--more');
  const moreBtn = moreItem?.querySelector('.nav__more');
  const overflowList = moreItem?.querySelector('.nav__overflow');
  if (!moreItem || !moreBtn || !overflowList) {return;}

  const realItems = [...navList.querySelectorAll('.nav__item:not(.nav__item--more)')];

  const update = () => {
    // Reset: show all real items, hide more button
    realItems.forEach((item) => { item.hidden = false; });
    moreItem.hidden = true;
    overflowList.innerHTML = '';

    // Check against the nav container (not navList — its width changes when items are hidden)
    const navRight = nav.getBoundingClientRect().right;
    const needsMore = realItems.some(
      (item) => item.getBoundingClientRect().right > navRight + 1
    );

    if (!needsMore) {return;}

    // Show more button, then hide items from the end until the button fits in nav
    moreItem.hidden = false;
    const hiddenItems = [];

    for (let i = realItems.length - 1; i >= 0; i--) {
      if (moreItem.getBoundingClientRect().right <= navRight + 1) {break;}
      hiddenItems.unshift(realItems[i]);
      realItems[i].hidden = true;
    }

    hiddenItems.forEach((item) => {
      const clone = item.cloneNode(true);
      const link = clone.querySelector('.nav__link');
      if (link && link.href === window.location.href) {
        link.setAttribute('aria-current', 'page');
      }
      overflowList.appendChild(clone);
    });
  };

  // Toggle dropdown
  on(moreBtn, 'click', (e) => {
    e.stopPropagation();
    const isOpen = moreBtn.getAttribute('aria-expanded') === 'true';
    overflowList.hidden = isOpen;
    moreBtn.setAttribute('aria-expanded', String(!isOpen));
  });

  // Close on click outside
  on(document, 'click', (e) => {
    if (!moreItem.contains(e.target)) {
      overflowList.hidden = true;
      moreBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on Escape
  on(document, 'keydown', (e) => {
    if (e.key === 'Escape' && moreBtn.getAttribute('aria-expanded') === 'true') {
      overflowList.hidden = true;
      moreBtn.setAttribute('aria-expanded', 'false');
      moreBtn.focus();
    }
  });

  // Observe the nav container (not navList — it changes size when items hide)
  const ro = new ResizeObserver(update);
  ro.observe(nav);

  // Wait for fonts before measuring
  document.fonts.ready.then(update);
};
