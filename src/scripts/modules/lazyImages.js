/**
 * Lazy image loading with IntersectionObserver
 */

export const initLazyImages = () => {
  const images = document.querySelectorAll('img[loading="lazy"][data-src]');
  if (!images.length) return;

  if (!('IntersectionObserver' in window)) {
    images.forEach((img) => { if (img.dataset.src) img.src = img.dataset.src; });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        img.classList.add('is-loaded');
        observer.unobserve(img);
      });
    },
    { rootMargin: '200px 0px' }
  );

  images.forEach((img) => observer.observe(img));
};
