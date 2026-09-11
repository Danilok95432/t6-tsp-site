import { type RefObject, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, type SwiperRef, SwiperSlide } from 'swiper/react'

import 'swiper/css'

import { Container } from '../../ui/Container/Container'
import { Section } from 'src/shared/ui/Section/section'
import { FlexRow } from 'src/shared/ui/FlexRow/FlexRow'
import { SliderBtns } from 'src/widgets/Slider-btns/slider-btns'

import { sliderOptions } from './consts'

import mockImg from 'src/assets/img/mockMainSlider.png'

import styles from './index.module.scss'

export const MainSliderSection = () => {
	const swiperRef: RefObject<SwiperRef> = useRef<SwiperRef>(null)

	// const { data } = useGetSliderListQuery(null)

	const sliderMock = [
		{
			id: '1',
			title: 'Системы безопасности доступа',
			itemdesc: 'Проектирование, реконструкция, поставка оборудования, монтаж, обслуживание',
			category_id: '1',
			img: [
				{
					original: mockImg,
				},
			],
		},
		{
			id: '2',
			title: 'Системы видеонаблюдения',
			itemdesc:
				'Проектирование и установка современных систем видеонаблюдения для объектов любого типа',
			category_id: '2',
			img: [
				{
					original: mockImg,
				},
			],
		},
		{
			id: '3',
			title: 'Пожарная безопасность',
			itemdesc:
				'Комплексные решения по проектированию, монтажу и обслуживанию систем пожарной безопасности',
			category_id: '3',
			img: [
				{
					original: mockImg,
				},
			],
		},
	]

	const navigate = useNavigate()

	return (
		<Section className={styles.mainSlider}>
			<Container className={styles.sliderCont}>
				{sliderMock && sliderMock.length > 0 && (
					<div className={styles.sliderWrapper}>
						<Swiper {...sliderOptions} ref={swiperRef} className={styles.sliderMain}>
							{sliderMock.map((slideEl) => (
								<SwiperSlide key={slideEl.id}>
									<FlexRow className={styles.slideRow}>
										<div className={styles.contentSlide}>
											<h1 className={styles.slideTitle}>{slideEl.title}</h1>

											<p className={styles.slideDesc}>{slideEl.itemdesc}</p>

											<button
												type='button'
												className={styles.infoBtn}
												onClick={() => navigate(`/catalog/${slideEl.category_id}`)}
											>
												<span>Перейти в каталог</span>

												<svg width='7' height='12' viewBox='0 0 7 12' fill='none'>
													<path
														d='M1 1L6 6L1 11'
														stroke='currentColor'
														strokeLinecap='round'
														strokeLinejoin='round'
													/>
												</svg>
											</button>
										</div>

										<div className={styles.imgWrapper}>
											<img
												className={styles.sliderImg}
												src={slideEl.img[0]?.original}
												alt={slideEl.title}
											/>
										</div>
									</FlexRow>
								</SwiperSlide>
							))}
						</Swiper>

						<SliderBtns className={styles.sliderBtns} swiperRef={swiperRef} />
					</div>
				)}
			</Container>
		</Section>
	)
}
