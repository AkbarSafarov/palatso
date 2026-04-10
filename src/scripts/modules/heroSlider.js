import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';

export const initHeroSlider = () => {
    new Swiper('#hero-swiper', {
        modules: [Navigation, Pagination, Autoplay],
        loop: true,
        autoplay: { delay: 4000, disableOnInteraction: false },
        pagination: { el: '.swiper-pagination-hero', clickable: true },
    });
};
