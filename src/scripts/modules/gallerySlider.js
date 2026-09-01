import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';
import 'swiper/css';

export const initGallerySlider = () => {
    const el = document.querySelector('.gallery-slider--js');
    if (!el) {return;}

    new Swiper(el, {
        modules: [Pagination],
        slidesPerView: 1.15,
        spaceBetween: 12,
        pagination: { el: '.article__gallery-pagination', clickable: true },
        breakpoints: {
            768: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
        },
    });
};
