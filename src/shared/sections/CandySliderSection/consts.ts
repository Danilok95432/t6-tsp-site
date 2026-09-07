import { type SwiperProps } from 'swiper/react'

export const sliderOptions: SwiperProps = {
	slidesPerView: 4,
	slidesPerGroup: 1,
	spaceBetween: 0,
	autoHeight: false,
	loop: true,
	breakpoints: {
		0: { slidesPerView: 1, spaceBetween: 24 },
		560: { slidesPerView: 2, spaceBetween: 36 },
		1310: { slidesPerView: 3, spaceBetween: 24 },
		1400: { slidesPerView: 4, spaceBetween: 24 },
	},
}
