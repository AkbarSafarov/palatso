/**
 * Main entry point
 * Initialises all modules
 */
import '../styles/main.scss';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import { initNavigation, initOverflowNav } from './modules/navigation.js';
import { initLazyImages } from './modules/lazyImages.js';
import { initHeroSlider } from './modules/heroSlider.js';
import { initSearchBlock } from '@/scripts/modules/searchBlock.js';

const init = () => {
    initNavigation();
    initOverflowNav();
    initLazyImages();
    initHeroSlider();
    initSearchBlock();

    Fancybox.bind('[data-fancybox]', {
        mainClass: 'fancybox--modal',
        animated: true,
        dragToClose: false,
        Toolbar: false,
        closeButton: 'inside',
        Html: { preload: false },
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
