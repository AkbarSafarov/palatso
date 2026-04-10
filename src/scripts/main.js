/**
 * Main entry point
 * Initialises all modules
 */
import '../styles/main.scss';
import { initNavigation, initOverflowNav } from './modules/navigation.js';
import { initLazyImages } from './modules/lazyImages.js';
import { initHeroSlider } from './modules/heroSlider.js';

const init = () => {
    initNavigation();
    initOverflowNav();
    initLazyImages();
    initHeroSlider();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
