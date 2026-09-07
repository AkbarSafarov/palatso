import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';

const initSlider = (selector, options) => {
    const el = document.querySelector(selector);
    if (!el) {return;}

    const nav = document.querySelector(`.catalog-slider-nav[data-nav="${options.navKey}"]`);
    if (!nav) {return;}

    new Swiper(el, {
        modules: [Navigation, Pagination],
        spaceBetween: 30,
        slidesPerView: options.slidesPerView,
        breakpoints: options.breakpoints,
        pagination: {
            el: nav.querySelector('.catalog-slider-nav__pagination'),
            clickable: true,
        },
        navigation: {
            prevEl: nav.querySelector('.catalog-slider-nav__prev'),
            nextEl: nav.querySelector('.catalog-slider-nav__next'),
        },
    });
};

export const initCatalogSliders = () => {
    initSlider('.photo-gallery-slider--js', {
        navKey: 'photo-gallery',
        slidesPerView: 1.15,
        breakpoints: {
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
        },
    });

    initSlider('.popular-models-slider--js', {
        navKey: 'popular-models',
        slidesPerView: 1.4,
        breakpoints: {
            640: { slidesPerView: 2 },
            980: { slidesPerView: 3 },
            1280: { slidesPerView: 5 },
        },
    });
};
