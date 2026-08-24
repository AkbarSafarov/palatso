import Swiper from 'swiper';
import { FreeMode } from 'swiper/modules';

/**
 * Breadcrumb slider — horizontal drag/scroll when the crumb chain overflows.
 */
export const initBreadcrumbSlider = () => {
    const el = document.querySelector('.breadcrumb-slider--js');
    if (!el) {return;}

    new Swiper(el, {
        modules: [FreeMode],
        slidesPerView: 'auto',
        spaceBetween: 0,
        freeMode: true,
        watchOverflow: true,
    });
};
