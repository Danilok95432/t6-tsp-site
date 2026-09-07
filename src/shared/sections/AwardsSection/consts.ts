import { type SwiperProps } from 'swiper/react'

export const sliderOptions: SwiperProps = {
	slidesPerView: 3,
	slidesPerGroup: 1,
	spaceBetween: 16,
	autoHeight: false,
	loop: true,
	breakpoints: {
		0: { slidesPerView: 1, spaceBetween: 24 },
		560: { slidesPerView: 1, spaceBetween: 24 },
		768: { slidesPerView: 1, spaceBetween: 24 },
		769: { slidesPerView: 2, spaceBetween: 24 },
		1090: { slidesPerView: 2, spaceBetween: 24 },
		1440: { slidesPerView: 3, spaceBetween: 16 },
		1920: { slidesPerView: 3, spaceBetween: 16 },
		2560: { slidesPerView: 3, spaceBetween: 16 },
		3840: { slidesPerView: 3, spaceBetween: 16 },
	},
}
