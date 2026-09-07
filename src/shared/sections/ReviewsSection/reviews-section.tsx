import { Container } from 'src/shared/ui/Container/Container'
import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'
import { Section } from 'src/shared/ui/Section/section'

import styles from './index.module.scss'
import { type RefObject, useRef } from 'react'
import { SliderBtns } from 'src/widgets/Slider-btns/slider-btns'
import { Swiper, type SwiperRef, SwiperSlide } from 'swiper/react'
import { sliderOptions } from './consts'

import cn from 'classnames'
import { RatingStars } from 'src/widgets/rating-stars/rating-stars'
import { Pagination } from 'swiper/modules'
import { useGetReviewsListQuery } from 'src/features/home/api/home.api'

export const ReviewSection = () => {
	const swiperRef: RefObject<SwiperRef> = useRef<SwiperRef>(null)
	// const sliderInfo = [
	// 	{
	// 		id: '1',
	// 		customer: 'Виктория',
	// 		status: 'клиент',
	// 		rate: 5,
	// 		review:
	// 			'Прекрасный шоколад, заказывали не раз на всю нашу большую семью, и дети, и что очень немаловажно, бабушка с дедушкой в восторге. Спасибо за ваш труд!!! и за подаренную радость нам!!!',
	// 	},
	// 	{
	// 		id: '2',
	// 		customer: 'Екатерина',
	// 		status: 'клиент',
	// 		rate: 4.5,
	// 		review:
	// 			'Прекрасный шоколад, заказывали не раз на всю нашу большую семью, и дети, и что очень немаловажно, бабушка с дедушкой в восторге. Спасибо за ваш труд!!! и за подаренную радость нам!!!',
	// 	},
	// 	{
	// 		id: '3',
	// 		customer: 'Инна',
	// 		status: 'клиент',
	// 		rate: 4,
	// 		review:
	// 			'Прекрасный шоколад, заказывали не раз на всю нашу большую семью, и дети, и что очень немаловажно, бабушка с дедушкой в восторге. Спасибо за ваш труд!!! и за подаренную радость нам!!!',
	// 	},
	// ]
	const { data } = useGetReviewsListQuery(null)
	if (data?.reviews && data?.reviews.length === 0) return null
	return (
		<Section className={cn(styles.reviewSlider)}>
			<Container className={styles.sliderCont}>
				<FlexRow className={styles.sectionRow}>
					<Swiper
						{...sliderOptions}
						ref={swiperRef}
						className={styles.sliderMain}
						modules={[Pagination]}
						pagination={{ clickable: true }}
					>
						{data?.reviews.map((slideEl) => {
							return (
								<SwiperSlide key={slideEl.id}>
									<FlexRow className={styles.slideRow}>
										<FlexRow className={styles.contentSlide}>
											<p className={styles.slideTitle}>
												{slideEl.name}
												<span>{`(${slideEl.role})`}</span>
											</p>
											<RatingStars
												value={Number(slideEl.rating)}
												idPrefix={
													slideEl.id ? `rate-${slideEl.id}` : `rate-${slideEl.name}-${slideEl.role}`
												}
											/>
											{slideEl.comment && (
												<div
													className={styles.slideDesc}
													dangerouslySetInnerHTML={{ __html: slideEl.comment }}
												/>
											)}
										</FlexRow>
									</FlexRow>
								</SwiperSlide>
							)
						})}
					</Swiper>
					<SliderBtns className={styles.sliderBtns} swiperRef={swiperRef} />
				</FlexRow>
			</Container>
		</Section>
	)
}
