import Swiper from 'swiper';
import { Pagination, Grid } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/grid';

/**
 * Article gallery — real slider below 768px; from 768px it lays out as a
 * static 3-column grid (via the Grid module) with dragging disabled, so it
 * is not a slider on desktop regardless of how many images there are.
 */
export const initGallerySlider = () => {
    const el = document.querySelector('.gallery-slider--js');
    if (!el) {return;}

    new Swiper(el, {
        modules: [Pagination, Grid],
        slidesPerView: 1.15,
        spaceBetween: 12,
        pagination: { el: '.article__gallery-pagination', clickable: true },
        breakpoints: {
            768: {
                slidesPerView: 3,
                spaceBetween: 20,
                grid: { rows: 2, fill: 'row' },
                allowTouchMove: false,
                simulateTouch: false,
            },
        },
    });
};
