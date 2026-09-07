import { Container } from '../../ui/Container/Container'
import styles from './index.module.scss'
import cn from 'classnames'
import { Swiper, type SwiperRef, SwiperSlide } from 'swiper/react'
import { Section } from 'src/shared/ui/Section/section'
import { type RefObject, useRef } from 'react'
import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'
import { SliderBtns } from 'src/widgets/Slider-btns/slider-btns'
import { sliderOptions } from './consts'
import { useGetSliderListQuery } from 'src/features/home/api/home.api'
import { useNavigate } from 'react-router-dom'

export const MainSliderSection = () => {
	const swiperRef: RefObject<SwiperRef> = useRef<SwiperRef>(null)
	const { data } = useGetSliderListQuery(null)
	const navigate = useNavigate()
	return (
		<Section className={cn(styles.mainSlider)}>
			<Container className={styles.sliderCont}>
				{data?.slider && data?.slider.length > 0 && (
					<FlexRow className={styles.sectionRow}>
						<Swiper {...sliderOptions} ref={swiperRef} className={styles.sliderMain}>
							{data?.slider.map((slideEl) => {
								return (
									<SwiperSlide key={slideEl.id}>
										<FlexRow className={styles.slideRow}>
											<FlexRow className={styles.contentSlide}>
												<p className={styles.slideTitle}>{slideEl.title}</p>
												<p className={styles.slideDesc}>{slideEl.itemdesc}</p>
												<button
													className={styles.infoBtn}
													onClick={() =>
														navigate(`/catalog/${slideEl.category_id}/item/${slideEl.id}`)
													}
												>
													Подробнее
												</button>
											</FlexRow>
											<div className={styles.imgWrapper}>
												{slideEl.img[0]?.original && (
													<img
														className={styles.sliderImg}
														src={slideEl.img[0]?.original}
														alt='image'
													/>
												)}
											</div>
										</FlexRow>
									</SwiperSlide>
								)
							})}
						</Swiper>
						<SliderBtns className={styles.sliderBtns} swiperRef={swiperRef} />
					</FlexRow>
				)}
			</Container>
		</Section>
	)
}
